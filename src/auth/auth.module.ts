import { Module } from "@nestjs/common";
import { FirebaseService } from "../common/services/firebase.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService, FirebaseService],
})
export class AuthModule {}
