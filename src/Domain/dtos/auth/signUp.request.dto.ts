import {IsString, MinLength, IsEmail, Matches, IsMongoId, IsOptional, MaxLength } from 'class-validator';

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
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
  public password: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  passwordConfirm: string;
}
