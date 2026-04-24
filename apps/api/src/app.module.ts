import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { BranchesModule } from './branches/branches.module';
import { StaffModule } from './staff/staff.module';
import { AttendanceModule } from './attendance/attendance.module';
import { InventoryModule } from './inventory/inventory.module';
import { InvoicesModule } from './invoices/invoices.module';
import { BookingsModule } from './bookings/bookings.module';
import { RevenueModule } from './revenue/revenue.module';
import { PosModule } from './pos/pos.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI', 'mongodb://localhost:27017/chuoi-kinh-doanh'),
        connectionFactory: (connection) => {
          console.log('MongoDB connected successfully');
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    BranchesModule,
    StaffModule,
    AttendanceModule,
    InventoryModule,
    InvoicesModule,
    BookingsModule,
    RevenueModule,
    PosModule,
    CustomersModule,
  ],
})
export class AppModule {}
