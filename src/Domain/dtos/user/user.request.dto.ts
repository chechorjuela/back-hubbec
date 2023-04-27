import {IsDateString, IsEmail, IsEnum, IsNumber, IsString, MinLength, ValidateNested} from 'class-validator';
import {Type} from "class-transformer/decorators";
import {FilePathRequestDto} from "../file/File.request.dto";
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
  public birthdate: Date;

  @ValidateNested()
  @Type(()=> FilePathRequestDto)
  public file: FilePathRequestDto;
}
