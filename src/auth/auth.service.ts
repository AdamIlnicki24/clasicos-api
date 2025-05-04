import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, Role, User } from 'generated/prisma';
import { PrismaService } from 'prisma/prisma.service';
import { AuthEntity } from './entities/auth.entity';
import { RegisterDto } from './dto/register.dto';
import { EXISTING_USER_EXCEPTION } from 'src/constants/exceptions';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  // TODO: Finish method below
  // private getSelectFields(): Prisma.UserSelect {}

  async getUserByUid(uid: string): Promise<AuthEntity> {
    return await this.prismaService.user.findUnique({
      where: {
        firebaseId: uid,
      },
      // select: this.getSelectFields(),
    });
  }

  async createUser(registerDto: RegisterDto): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: registerDto.email,
      },
    });

    if (user) throw new ConflictException(EXISTING_USER_EXCEPTION);

    return await this.prismaService.user.create({
      data: {
        firebaseId: registerDto.firebaseId,
        email: registerDto.email,
        isPrivacyPolicyAccepted: registerDto.isPrivacyPolicyAccepted
          ? new Date()
          : null,
        isTermsAndServicesAccepted: registerDto.isTermsAndServicesAccepted
          ? new Date()
          : null,
        role: Role.Visitor,
      },
    });
  }
}
