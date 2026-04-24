import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/pos' })
export class PosGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('PosGateway');

  handleConnection(client: Socket) {
    this.logger.log(`POS Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`POS Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_branch')
  handleJoinBranch(@MessageBody() data: { branchId: string }, @ConnectedSocket() client: Socket) {
    client.join(`branch_${data.branchId}`);
    client.emit('joined', { branchId: data.branchId });
  }

  @SubscribeMessage('new_order')
  handleNewOrder(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    this.server.to(`branch_${data.branchId}`).emit('order_created', data);
  }

  @SubscribeMessage('order_updated')
  handleOrderUpdated(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    this.server.to(`branch_${data.branchId}`).emit('order_updated', data);
  }

  broadcastToKitchen(branchId: string, order: any) {
    this.server.to(`branch_${branchId}`).emit('kitchen_order', order);
  }
}
