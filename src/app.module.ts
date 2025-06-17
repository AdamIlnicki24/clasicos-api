import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { PlayersModule } from "./players/players.module";
import { CommentsModule } from "./comments/comments.module";
import { PrismaService } from "./prisma.service";
import { FirebaseService } from "./common/services/firebase.service";
import { PreauthMiddleware } from "./auth/preauth.middleware";
import { AuthService } from "./auth/auth.service";
import { TeamModule } from "./team/team.module";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "./common/guards/roles.guard";
import { IsBannedGuard } from "./common/guards/is-banned.guard";
import { UsersService } from "./users/users.service";
import { RecommendationsModule } from './recommendations/recommendations.module';

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
    TeamModule,
    RecommendationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
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
    consumer.apply(PreauthMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
