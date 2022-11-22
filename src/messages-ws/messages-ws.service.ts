import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConectedClients {
    [id: string]: {
        socket: Socket,
        user: User
    };
}

@Injectable()
export class MessagesWsService {
  private conectedClients: ConectedClients = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({id: userId});

    if(!user)
        throw new Error('User not found');
    if(!user.isActive)
        throw new Error('User is not active');

    this.checkUserConnection( user );
    
    this.conectedClients[client.id] = {
        socket: client,
        user: user
    };
  }

  removeClient(clientId: string) {
    delete this.conectedClients[clientId];
  }

  getConnectedClients(): string[] {
    return Object.keys( this.conectedClients );
  }

  getUserFullName(socketId: string) {
    return this.conectedClients[socketId].user.fullName;
  }

  checkUserConnection(user: User) {
    for(const clientId of Object.keys(this.conectedClients)){
        const connectedClient = this.conectedClients[clientId];
        if(connectedClient.user.id === user.id){
            connectedClient.socket.disconnect();
            break;
        }
    }
  }

}
