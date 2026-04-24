import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice, InvoiceDocument } from '../invoices/schemas/invoice.schema';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';

@Injectable()
export class RevenueService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  async getDashboard(user: any, branchId?: string) {
    const now = new Date();
    const todayStart = new Date(now); todayStart.setHours(0,0,0,0);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const filter: any = { tenantId: user.tenantId, status: 'paid' };
    if (branchId) filter.branchId = new Types.ObjectId(branchId);

    const [todayRevenue, monthRevenue, lastMonthRevenue] = await Promise.all([
      this.invoiceModel.aggregate([{ $match: { ...filter, createdAt: { $gte: todayStart } } }, { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }]),
      this.invoiceModel.aggregate([{ $match: { ...filter, createdAt: { $gte: monthStart } } }, { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }]),
      this.invoiceModel.aggregate([{ $match: { ...filter, createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    ]);

    const todayTotal = todayRevenue[0]?.total || 0;
    const monthTotal = monthRevenue[0]?.total || 0;
    const lastMonthTotal = lastMonthRevenue[0]?.total || 0;
    const growth = lastMonthTotal > 0 ? ((monthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1) : 0;

    return { todayRevenue: todayTotal, todayOrders: todayRevenue[0]?.count || 0, monthRevenue: monthTotal, monthOrders: monthRevenue[0]?.count || 0, lastMonthRevenue: lastMonthTotal, growth };
  }

  async getChartData(user: any, branchId?: string, days = 30) {
    const start = new Date(); start.setDate(start.getDate() - days);
    const filter: any = { tenantId: user.tenantId, status: 'paid', createdAt: { $gte: start } };
    if (branchId) filter.branchId = new Types.ObjectId(branchId);

    const data = await this.invoiceModel.aggregate([
      { $match: filter },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    return data.map(d => ({ date: d._id, revenue: d.revenue, orders: d.orders }));
  }

  async getByBranch(user: any, month?: string) {
    const now = new Date();
    const start = month ? new Date(month + '-01') : new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
    const filter: any = { tenantId: user.tenantId, status: 'paid', createdAt: { $gte: start, $lte: end } };

    return this.invoiceModel.aggregate([
      { $match: filter },
      { $group: { _id: '$branchId', revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
      { $lookup: { from: 'branches', localField: '_id', foreignField: '_id', as: 'branch' } },
      { $unwind: { path: '$branch', preserveNullAndEmptyArrays: true } },
      { $project: { branchId: '$_id', branchName: '$branch.name', industry: '$branch.industry', revenue: 1, orders: 1 } },
      { $sort: { revenue: -1 } }
    ]);
  }

  async getTopProducts(user: any, branchId?: string, limit = 10) {
    const filter: any = { tenantId: user.tenantId, status: 'paid' };
    if (branchId) filter.branchId = new Types.ObjectId(branchId);

    return this.invoiceModel.aggregate([
      { $match: filter },
      { $unwind: '$items' },
      { $group: { _id: '$items.name', totalQty: { $sum: '$items.quantity' }, totalRevenue: { $sum: '$items.total' } } },
      { $sort: { totalRevenue: -1 } },
      { $limit: limit }
    ]);
  }
}
