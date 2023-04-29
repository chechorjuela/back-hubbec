import {IsDateString, IsEmail, IsEnum, IsNumber, IsString, MinLength, ValidateNested} from 'class-validator';
export class HobbieRequestDto{

  @IsString()
  @MinLength(3)
  nameHobbie: string;

  @IsString()
  @MinLength(3)
  userId: string;
}
