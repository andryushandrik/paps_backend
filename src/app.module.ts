import { AuthModule } from './modules/auth/auth.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TasksModule } from './modules/tasks/tasks.module';
import { FoldersModule } from './modules/folders/folders.module';
import { SprintsModule } from './modules/sprints/sprints.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        AuthModule,
        ThrottlerModule.forRoot({
            ttl: 1,
            limit: 5,
        }),
        FoldersModule,
        TasksModule,
        SprintsModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('/');
    }
}
