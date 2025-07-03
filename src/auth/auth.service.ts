import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";
import { FirebaseService } from "../common/services/firebase.service";
import { SOMETHING_WENT_WRONG_ERROR_MESSAGE } from "../constants/errorMessages";
import {
  EXISTING_EMAIL_EXCEPTION,
  PRIVACY_POLICY_ACCEPTANCE_EXCEPTION
} from "../constants/exceptions";
import { PrismaService } from "../prisma.service";
import { UserEntity } from "../users/entities/user.entity";
import { RegisterDto } from "./dto/register.dto";
import { AuthEntity } from "./entities/auth.entity";

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
      include: {
        visitor: true,
      },
    });
  }

  async createUser({ email, password, isPrivacyPolicyAccepted }: RegisterDto): Promise<UserEntity> {
    const doesEmailExist = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (doesEmailExist) throw new ConflictException(EXISTING_EMAIL_EXCEPTION);

    // TODO: Handle nick's length validation


    // TODO: Handle exeption below in DTO
    if (!isPrivacyPolicyAccepted) {
      throw new BadRequestException(PRIVACY_POLICY_ACCEPTANCE_EXCEPTION);
    }

    const userFromFirebase = await this.firebaseService.createFirebaseUser(email, password);

    return await this.prismaService.user
      .create({
        data: {
          firebaseId: userFromFirebase.uid,
          email,
          acceptedPrivacyPolicyAt: new Date(),
          visitor: { create: {} },
          role: Role.Visitor,
        },
      })
      .catch((error) => {
        console.error(error);
        // TODO: Think about deleting firebase user
        throw new BadRequestException(SOMETHING_WENT_WRONG_ERROR_MESSAGE);
      });
  }
}
