export class CreateCommissionDto {
  referralCode: string;
  bookingId?: string;
  bookingAmount: number;
  branchId?: string;
}
export class UpdateCommissionDto {
  status?: string;
  note?: string;
}
export class GenerateReferralDto {
  userId: string;
}
