import {IsNotEmpty, IsString, MinLength} from "class-validator";
import {FileRequestDto} from "./file.request.dto";

export class UploadImageRequestDto {
  
  @IsString()
  @MinLength(10)
  public user_id;


  public picture:FileRequestDto[];

}
