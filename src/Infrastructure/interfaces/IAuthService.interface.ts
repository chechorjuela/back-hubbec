import {SignUpRequestDto} from "../../Domain/dtos/auth/signUp.request.dto";
import {SignInRequestDto} from "../../Domain/dtos/auth/signIn.request.dto";
import {UserResponseDto} from "../../Domain/dtos/user/user.response.dto";
import {ResponseBaseDto} from "../../Domain/dtos/response.base.dto";
import {Request, Response} from "express";

export default interface IAuthServiceInterface {
  signUp(signup: SignUpRequestDto): Promise<ResponseBaseDto<UserResponseDto>>
  signIn(login: SignInRequestDto): Promise<ResponseBaseDto<UserResponseDto>>
  refresh(request: Request): Promise<ResponseBaseDto<UserResponseDto>>
}
