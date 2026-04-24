import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Commission, CommissionDocument } from './schemas/commission.schema';

@Injectable()
export class CommissionService {
  constructor(
    @InjectModel(Commission.name) private model: Model<CommissionDocument>,
  ) {}

  // Generate referral code for a user (idempotent)
  async getOrCreateReferralCode(userId: string): Promise<string> {
    const existing = await this.model.findOne({ referrerId: new Types.ObjectId(userId) }).sort({ createdAt: 1 });
    if (existing) return existing.referralCode;
    const code = 'REF' + userId.toString().slice(-6).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
    return code;
  }

  // Record commission when booking is made via referral
  async recordCommission(referralCode: string, bookingAmount: number, bookingId?: string, branchId?: string) {
    // Find who owns this referral code
    const existing = await this.model.findOne({ referralCode });
    const referrerId = existing?.referrerId;
    if (!referrerId) return null;

    const rate = 0.05; // 5% default
    const amount = Math.round(bookingAmount * rate);

    return this.model.create({
      referrerId,
      referralCode,
      bookingId: bookingId ? new Types.ObjectId(bookingId) : undefined,
      branchId: branchId ? new Types.ObjectId(branchId) : undefined,
      bookingAmount,
      commissionRate: rate,
      commissionAmount: amount,
      status: 'pending',
    });
  }

  async getMyCommissions(userId: string) {
    return this.model.find({ referrerId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).lean();
  }

  async getAll(filter?: { status?: string; referrerId?: string }) {
    const q: any = {};
    if (filter?.status) q.status = filter.status;
    if (filter?.referrerId) q.referrerId = new Types.ObjectId(filter.referrerId);
    return this.model.find(q).sort({ createdAt: -1 }).lean();
  }

  async getLeaderboard() {
    return this.model.aggregate([
      { $match: { status: { $in: ['approved', 'paid'] } } },
      { $group: { _id: '$referrerId', totalCommission: { $sum: '$commissionAmount' }, totalBookings: { $sum: 1 }, totalAmount: { $sum: '$bookingAmount' } } },
      { $sort: { totalCommission: -1 } },
      { $limit: 20 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      { $project: { referrerId: '$_id', name: '$user.fullName', email: '$user.email', totalCommission: 1, totalBookings: 1, totalAmount: 1 } },
    ]);
  }

  async updateStatus(id: string, status: string, note?: string) {
    return this.model.findByIdAndUpdate(id, { status, note, ...(status === 'paid' ? { paidAt: new Date() } : {}) }, { new: true });
  }

  async getStats(referrerId?: string) {
    const match: any = {};
    if (referrerId) match.referrerId = new Types.ObjectId(referrerId);

    const [pending, approved, paid] = await Promise.all([
      this.model.aggregate([{ $match: { ...match, status: 'pending' } }, { $group: { _id: null, count: { $sum: 1 }, total: { $sum: '$commissionAmount' } } }]),
      this.model.aggregate([{ $match: { ...match, status: 'approved' } }, { $group: { _id: null, count: { $sum: 1 }, total: { $sum: '$commissionAmount' } } }]),
      this.model.aggregate([{ $match: { ...match, status: 'paid' } }, { $group: { _id: null, count: { $sum: 1 }, total: { $sum: '$commissionAmount' } } }]),
    ]);

    return {
      pending: { count: pending[0]?.count || 0, amount: pending[0]?.total || 0 },
      approved: { count: approved[0]?.count || 0, amount: approved[0]?.total || 0 },
      paid: { count: paid[0]?.count || 0, amount: paid[0]?.total || 0 },
    };
  }
}
