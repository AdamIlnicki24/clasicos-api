import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PlayersModule } from './players/players.module';
import { AuthService } from './auth/auth.service';
import { PreauthMiddleware } from './auth/preauth.middleware';
import { PrismaService } from 'prisma/prisma.service'; // <-- tutaj
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [UsersModule, AuthModule, PlayersModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService, AuthService, PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PreauthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
