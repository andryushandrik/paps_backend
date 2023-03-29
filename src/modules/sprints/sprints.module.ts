import { Module } from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { SprintsGateway } from './sprints.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    providers: [SprintsGateway, SprintsService],
})
export class SprintsModule {}
