import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PosController } from './pos.controller';
import { PosService } from './pos.service';
import { PosGateway } from './gateways/pos.gateway';
import { Order, OrderSchema } from './schemas/order.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])],
  controllers: [PosController],
  providers: [PosService, PosGateway],
  exports: [PosService, PosGateway],
})
export class PosModule {}
