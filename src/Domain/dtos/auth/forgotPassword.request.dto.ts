import {IsEmail, IsString, MinLength} from "class-validator";

export class ForgotPasswordRequestDto{
  @IsString()
  @MinLength(3)
  @IsEmail()
  public email: string;
}
