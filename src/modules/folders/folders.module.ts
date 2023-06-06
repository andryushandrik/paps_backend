import { Module } from '@nestjs/common';
import { FoldersService } from './folders.service';
import { FoldersController } from './folders.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports:[DatabaseModule, AuthModule],
    controllers: [FoldersController],
    providers: [FoldersService],
})
export class FoldersModule {}
