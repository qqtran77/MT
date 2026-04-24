import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { InventoryItem, InventoryItemSchema } from './schemas/inventory.schema';
import { StockMovement, StockMovementSchema } from './schemas/stock-movement.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: InventoryItem.name, schema: InventoryItemSchema },
    { name: StockMovement.name, schema: StockMovementSchema },
  ])],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
