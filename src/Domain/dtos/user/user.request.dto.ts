import {IsDateString, IsEmail, IsEnum, IsNumber, IsString, MinLength, ValidateNested} from 'class-validator';
export class UserRequestDto{
  
  @IsString()
  @MinLength(3)
  public firstname;

  @IsString()
  @MinLength(3)
  public lastname;

  @IsString()
  @MinLength(3)
  @IsEmail()
  public email: string;

  @IsNumber()
  public type_user: number;

  @IsDateString()
  public birthDate: Date;

  public phoneNumber?: string;

  public expeditionDate?: Date;

  @IsString()
  @MinLength(3)
  public numberId: string;

  @IsString()
  @MinLength(3)
  public country?: string;

  @IsString()
  @MinLength(3)
  public city?: string;

  public address?: string;

}
