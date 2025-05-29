import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { AuthEntity } from "./entities/auth.entity";
import { RegisterDto } from "./dto/register.dto";
import { EXISTING_USER_EXCEPTION } from "src/constants/exceptions";
import { FirebaseService } from "src/common/services/firebase.service";
import { User, Role } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async getUserByUid(uid: string): Promise<AuthEntity> {
    return await this.prismaService.user.findUnique({
      where: {
        firebaseId: uid,
      },
    });
  }

  async createUser(registerDto: RegisterDto): Promise<User> {
    const userFromDatabase = await this.prismaService.user.findUnique({
      where: {
        email: registerDto.email,
      },
    });

    if (userFromDatabase) throw new ConflictException(EXISTING_USER_EXCEPTION);
    
    // TODO: Handle nick being unique

    const userFromFirebase = await this.firebaseService.createFirebaseUser(registerDto.email, registerDto.password);

    return await this.prismaService.user.create({
      data: {
        firebaseId: userFromFirebase.uid,
        email: registerDto.email,
        nick: registerDto.nick,
        acceptedPrivacyPolicyAt: registerDto.isPrivacyPolicyAccepted ? new Date() : null,
        visitor: { create: {} },
        role: Role.Visitor,
      },
    });
  }
}
