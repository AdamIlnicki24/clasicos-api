import { SetMetadata } from '@nestjs/common';

export const IS_BANNED_KEY = 'isBanned';
export const IsBanned = () => SetMetadata(IS_BANNED_KEY, true);
