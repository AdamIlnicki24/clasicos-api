import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsString()
  firebaseId: string;

  @IsBoolean()
  @IsOptional()
  isPrivacyPolicyAccepted?: boolean;

  @IsBoolean()
  @IsOptional()
  isTermsAndServicesAccepted?: boolean;
}
