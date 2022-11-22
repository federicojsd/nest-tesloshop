import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { JwtPayload } from '../auth/interfaces';
import { NewMessageDto } from './dto/new-message.dto';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true})
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
    ) {}


/*
  --> HANDLE CONNECT
*/
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.token as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);

    } catch (error) {
      client.disconnect();
      return;
    }

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }


/*
  --> HANDLE DISCONNECT
*/
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients());
  }


/*
  --> HANDLE MESSAGE FROM CLIENT
*/
  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {

  //EMITE SOLO AL CLIENTE
    // client.emit('messages-from-server', {
    //   fullName: 'jelajela',
    //   message: payload.message || 'no-message'
    // });

  //EMITE A TODOS MENOS AL CLIENTE
    // client.broadcast.emit('messages-from-server', {
    //   fullName: 'jelajela',
    //   message: payload.message || 'no-message'
    // });

  //EMITE A TODOS
    this.wss.emit('messages-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no-message'
    });


  }


}
