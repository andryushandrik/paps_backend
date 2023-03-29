import { SessionService } from './session/session.service';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../database/database.module';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
    controllers: [UsersController],
    providers: [UsersService, SessionService],
    exports: [UsersService, SessionService],
    imports: [DatabaseModule, JwtModule],
})
export class UsersModule {}
