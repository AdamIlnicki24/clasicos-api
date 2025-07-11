import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { FirebaseService } from "../common/services/firebase.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, FirebaseService],
})
export class AuthModule {}
