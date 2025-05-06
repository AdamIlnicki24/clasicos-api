import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthEntity } from 'src/auth/entities/auth.entity';

export const User = createParamDecorator(
  (data: keyof AuthEntity, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const user = request.user as AuthEntity;
    return data ? user?.[data] : user;
  },
);
