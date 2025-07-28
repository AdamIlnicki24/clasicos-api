import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { AuthService } from "./auth/auth.service";
import { PreauthMiddleware } from "./auth/preauth.middleware";
import { CommentsModule } from "./comments/comments.module";
import { IsBannedGuard } from "./common/guards/is-banned.guard";
import { RolesGuard } from "./common/guards/roles.guard";
import { ConnectionLoggerMiddleware } from "./common/middleware/connection-logger.middleware";
import { FirebaseService } from "./common/services/firebase.service";
import configuration from "./config/configuration";
import { PlayersModule } from "./players/players.module";
import { RecommendationsModule } from "./recommendations/recommendations.module";
import { TeamModule } from "./team/team.module";
import { UsersModule } from "./users/users.module";
import { UsersService } from "./users/users.service";
import { PrismaModule } from "../prisma/prisma.module";
import { TestAccountsModule } from './test-accounts/test-accounts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    PlayersModule,
    CommentsModule,
    TeamModule,
    RecommendationsModule,
    TestAccountsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    FirebaseService,
    AuthService,
    UsersService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: IsBannedGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PreauthMiddleware, ConnectionLoggerMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
