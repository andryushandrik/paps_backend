import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';

import { SprintsService } from './sprints.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway()
export class SprintsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('AppGateway');

    constructor(private readonly sprintsService: SprintsService, private readonly jwtService: JwtService) {}

    @SubscribeMessage('createSprint')
    create(@MessageBody() createSprintDto: CreateSprintDto) {
        return this.sprintsService.create(createSprintDto);
    }

    @SubscribeMessage('findAllSprints')
    findAll() {
        return this.sprintsService.findAll();
    }

    @SubscribeMessage('findOneSprint')
    findOne(@MessageBody() id: number) {
        return this.sprintsService.findOne(id);
    }

    @SubscribeMessage('updateSprint')
    update(@MessageBody() updateSprintDto: UpdateSprintDto) {
        return this.sprintsService.update(updateSprintDto.id, updateSprintDto);
    }

    @SubscribeMessage('removeSprint')
    remove(@MessageBody() id: number) {
        return this.sprintsService.remove(id);
    }

    afterInit(server: Server) {
        this.logger.log('Init');
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    handleConnection(client: Socket, ...args: any[]) {
        const payload = this.jwtService.verify(client.handshake.headers.authorization);
        // const user = await this.usersService.findOne(payload.userId);
        //
        this.logger.log(payload);
    }
}
