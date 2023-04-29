import {SignUpRequestDto} from "../../Domain/dtos/auth/signUp.request.dto";
import {SignInRequestDto} from "../../Domain/dtos/auth/signIn.request.dto";
import {UserResponseDto} from "../../Domain/dtos/user/user.response.dto";
import {ResponseBaseDto} from "../../Domain/dtos/response.base.dto";

export default interface IAuthServiceInterface {
  signUp(signup: SignUpRequestDto): Promise<ResponseBaseDto<UserResponseDto>>

  signIn(login: SignInRequestDto): Promise<ResponseBaseDto<UserResponseDto>>
}
