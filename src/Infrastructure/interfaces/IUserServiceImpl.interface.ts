import { UploadImageRequestDto } from './../../Domain/dtos/user/uploadImage.request.dto';
import { FilePathResponseDto } from './../../Domain/dtos/user/filepath.response.dto';
import {ResponseBaseDto} from "../../Domain/dtos/response.base.dto";
import {PaginatorBase} from "../../Domain/models/paginatorBase.model";
import {UserResponseDto} from "../../Domain/dtos/user/user.response.dto";
import {UserRequestDto} from "../../Domain/dtos/user/user.request.dto";
import {UpdatePasswordRequestDto} from "../../Domain/dtos/auth/updatePassword.request.dto";

export default interface IUserServiceImplInterface {
  getAll(deleted: boolean, queryFilter): Promise<ResponseBaseDto<PaginatorBase<UserResponseDto[]>>>;
  create(userRequest: UserRequestDto): Promise<ResponseBaseDto<UserResponseDto>>;
  update(id: string, dto: UserRequestDto): Promise<ResponseBaseDto<UserResponseDto>>;
  delete(id: string): Promise<ResponseBaseDto<UserResponseDto>>;
  findById(id: string): Promise<ResponseBaseDto<UserResponseDto>>;
  updatePassword(dto: UpdatePasswordRequestDto): Promise<ResponseBaseDto<UserResponseDto>>;
  uploadImage(fileImage: UploadImageRequestDto): Promise<ResponseBaseDto<FilePathResponseDto[]>>;
}
