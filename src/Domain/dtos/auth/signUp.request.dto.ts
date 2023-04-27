import {IsString, MinLength, IsEmail, Matches, IsMongoId, IsOptional} from 'class-validator';

export class SignUpRequestDto {
  @IsString()
  @MinLength(2)
  public firstname: string;

  @IsString()
  @MinLength(2)
  public lastname: string;

  @IsString()
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(8)
  public password: string;

  @IsMongoId()
  @IsOptional()
  public statusId: string;

  @IsMongoId()
  @IsOptional()
  public typeUserId: string;
}
