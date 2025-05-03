import { Request } from 'express';
import { AuthEntity } from 'src/auth/entities/auth.entity';

export interface UserRequest extends Request {
  user: AuthEntity;
}
