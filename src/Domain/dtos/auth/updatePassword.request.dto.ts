import {IsEmail, IsString, MinLength} from "class-validator";

export class UpdatePasswordRequestDto{
  @IsString()
  @MinLength(3)
  public userId;

  @IsString()
  @MinLength(3)
  public currentPassword;

  @IsString()
  @MinLength(3)
  public newPassword;

  @IsString()
  @MinLength(3)
  public rptPassword;
}
