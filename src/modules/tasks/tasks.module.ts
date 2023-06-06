import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
    controllers: [TasksController],
    providers: [TasksService],
    imports: [DatabaseModule],
})
export class TasksModule {}
