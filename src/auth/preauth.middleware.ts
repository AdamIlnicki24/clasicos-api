import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NextFunction, Response } from "express";
import * as admin from "firebase-admin";
import { ACCESS_DENIED_ERROR_MESSAGE, TOKEN_VERIFICATION_ERROR_MESSAGE } from "../constants/errorMessages";
import { UserRequest } from "types/userRequest";
import { AuthService } from "./auth.service";

@Injectable()
export class PreauthMiddleware implements NestMiddleware {
  private readonly defaultApp: admin.app.App;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    const firebaseConfig = this.configService.get<admin.ServiceAccount>("firebase");

    this.defaultApp =
      admin.apps.length > 0
        ? admin.app()
        : admin.initializeApp({
            credential: admin.credential.cert(firebaseConfig),
          });
  }

  async use(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next();
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return this.accessDenied(req.url, res);
    }

    const idToken = parts[1];

    try {
      const decodedToken = await this.defaultApp.auth().verifyIdToken(idToken);
      const user = await this.authService.getUserByUid(decodedToken.uid);

      req.user = user;
      return next();
    } catch (error) {
      console.error(TOKEN_VERIFICATION_ERROR_MESSAGE, error);
      return this.accessDenied(req.url, res);
    }
  }

  private accessDenied(url: string, res: Response): void {
    res.status(403).json({
      statusCode: 403,
      timestamp: new Date().toISOString(),
      path: url,
      message: ACCESS_DENIED_ERROR_MESSAGE,
    });
  }
}
