import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { Role, User } from "@prisma/client";
import { FirebaseService } from "../common/services/firebase.service";
import { PrismaService } from "../prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { AuthEntity } from "./entities/auth.entity";
import { EXISTING_EMAIL_EXCEPTION, EXISTING_NICK_EXCEPTION, PASSWORD_LENGTH_EXCEPTION, PRIVACY_POLICY_ACCEPTANCE_EXCEPTION } from "../constants/exceptions";
import { SOMETHING_WENT_WRONG_ERROR_MESSAGE } from "../constants/errorMessages";
import { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from "../constants/lengths";

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

  async createUser({ email, nick, password, isPrivacyPolicyAccepted }: RegisterDto): Promise<User> {
    const doesEmailExist = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (doesEmailExist) throw new ConflictException(EXISTING_EMAIL_EXCEPTION);

    const doesNickExist = await this.prismaService.user.findUnique({
      where: {
        nick,
      },
    });

    if (doesNickExist) throw new ConflictException(EXISTING_NICK_EXCEPTION);

    // TODO: Handle nick's length validation

    if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
      throw new BadRequestException(PASSWORD_LENGTH_EXCEPTION);
    }

    if (!isPrivacyPolicyAccepted) {
      throw new BadRequestException(PRIVACY_POLICY_ACCEPTANCE_EXCEPTION);
    }

    const userFromFirebase = await this.firebaseService.createFirebaseUser(email, password);

    return await this.prismaService.user
      .create({
        data: {
          firebaseId: userFromFirebase.uid,
          email,
          nick,
          acceptedPrivacyPolicyAt: isPrivacyPolicyAccepted ? new Date() : null,
          visitor: { create: {} },
          role: Role.Visitor,
        },
      })
      .catch((error) => {
        console.error(error);
        throw new BadRequestException(SOMETHING_WENT_WRONG_ERROR_MESSAGE);
      });
  }
}
