import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RevenueController } from './revenue.controller';
import { RevenueService } from './revenue.service';
import { Invoice, InvoiceSchema } from '../invoices/schemas/invoice.schema';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Invoice.name, schema: InvoiceSchema },
    { name: Booking.name, schema: BookingSchema },
  ])],
  controllers: [RevenueController],
  providers: [RevenueService],
  exports: [RevenueService],
})
export class RevenueModule {}
