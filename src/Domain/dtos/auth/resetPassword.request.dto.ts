import {IsEmail, IsString, MinLength} from "class-validator";

export class ResetpasswordRequestDto{
  @IsString()
  @MinLength(3)
  public token: string;

  @IsString()
  @MinLength(3)
  public rptpassword: string;

  @IsString()
  @MinLength(3)
  public password: string;

  @IsString()
  @MinLength(3)
  public userId: string;

  public expire:string;
}
