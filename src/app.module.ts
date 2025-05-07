import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { PlayersModule } from "./players/players.module";
import { CommentsModule } from "./comments/comments.module";
import { PrismaService } from "prisma/prisma.service";
import { FirebaseService } from "./common/services/firebase.service";
import { PreauthMiddleware } from "./auth/preauth.middleware";
import { AuthService } from "./auth/auth.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    UsersModule,
    AuthModule,
    PlayersModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, FirebaseService, AuthService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PreauthMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
