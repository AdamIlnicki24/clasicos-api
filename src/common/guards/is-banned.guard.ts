import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UsersService } from "../../users/users.service";
import { IS_BANNED_KEY } from "../decorators/is-banned.decorator";
import { USER_HAS_BEEN_BANNED_EXCEPTION, USER_NOT_LOGGED_IN_EXCEPTION } from "../../constants/exceptions";

@Injectable()
export class IsBannedGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const shouldCheckWhetherUserIsBanned = this.reflector.getAllAndOverride<boolean>(IS_BANNED_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!shouldCheckWhetherUserIsBanned) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new UnauthorizedException(USER_NOT_LOGGED_IN_EXCEPTION);
    }

    const isBanned = await this.usersService.isUserBanned(user.uuid);

    if (isBanned) {
      throw new ForbiddenException(USER_HAS_BEEN_BANNED_EXCEPTION);
    }

    return true;
  }
}
