import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  sendNotification(data: { type: string, message: string, machine?: any }) {
    this.server.emit('appNotification', {
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  sendHighEnergyAlert(machine: any) {
    this.server.emit('energyAlert', {
      type: 'Energy',
      message: `High energy alert! Machine ${machine.name} (${machine.uid}) is using ${machine.energy} kWh.`,
      machine,
      timestamp: new Date().toISOString()
    });
  }
}
