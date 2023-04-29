import {BcryptWrapper} from '../../wrappers/bcrypt.wrapper';
import {User} from '../../../Domain/models/user.model';
import {UserResponseDto} from '../../../Domain/dtos/user/user.response.dto';
import {TokenService} from '../token/token.service';
import {UsersRepository} from '../../../Domain/repositories/user.repository';
import {SignUpRequestDto} from '../../../Domain/dtos/auth/signUp.request.dto';
import {injectable, inject} from 'inversify';
import IAuthServiceInterface from "../../interfaces/IAuthService.interface";
import {SignInRequestDto} from "../../../Domain/dtos/auth/signIn.request.dto";
import {ResponseBaseDto} from "../../../Domain/dtos/response.base.dto";
import {ResetpasswordRequestDto} from "../../../Domain/dtos/auth/resetPassword.request.dto";
import {ForgotPasswordRequestDto} from "../../../Domain/dtos/auth/forgotPassword.request.dto";
import * as crypto from "crypto";
import * as moment from 'moment';
import {ResetPassword} from "../../../Domain/models/resetPassword.model";
import {ResetPasswordRepository} from "../../../Domain/repositories/resetPassword.repository";
import {AppConfig} from "../../../config/app.config";

export enum RegisterResult {
  Success = 'Success',
  EmailTaken = 'Email already taken',
}

@injectable()
export class AuthService implements IAuthServiceInterface {
  private readonly salt = 10;

  @inject(UsersRepository) private readonly repoUser: UsersRepository;
  @inject(ResetPasswordRepository) private readonly repoResetPassword: ResetPasswordRepository;
  @inject(TokenService) private readonly tokenService: TokenService;
  @inject(BcryptWrapper) private readonly bcrypt: BcryptWrapper;
  @inject(AppConfig) private readonly appConfig: AppConfig;

  public async signUp(dto: SignUpRequestDto): Promise<ResponseBaseDto<UserResponseDto>> {
    let responseDto: ResponseBaseDto<UserResponseDto> = new ResponseBaseDto<UserResponseDto>();

    const isEmailTaken = await this.repoUser.exists({email: dto.email});
    if (isEmailTaken) {
      responseDto.message = "Usuario ya existe";
      responseDto.status = 400;
      return responseDto;
    }
    const user = this.dtoToModel(dto);
    let dtoUser: UserResponseDto = new UserResponseDto();
    user.password = await this.bcrypt.hash(dto.password, this.salt);
    const userCreate: User = await this.repoUser.create(user);
    dtoUser = this.modelToDto(userCreate, null);
    responseDto.status = 200;
    responseDto.data = dtoUser;
 /*   if (userCreate) {
      this.sendEmailService.sendMail(userCreate.email, "Account success", "you have successfully registered");
    }*/
    return responseDto;
  }

  public async signIn(dto: SignInRequestDto): Promise<ResponseBaseDto<UserResponseDto>> {
    let responseDto: ResponseBaseDto<UserResponseDto> = new ResponseBaseDto<UserResponseDto>();
    const user = await this.repoUser.findOne({email: dto.email});
    if (user !== null) {
      const isPasswordMatch = await this.bcrypt.compare(dto.password, user.password);
      if (isPasswordMatch) {
        const token = await this.tokenService.create(user);
        const userDto = this.modelToDto(user, token);
        responseDto.data = userDto;
        responseDto.status = 200;
      } else {
        responseDto.status = 400;
        responseDto.message = "Contraseña o usuario invalido";
      }
    } else {
      responseDto.status = 400;
      responseDto.message = "Usuario no existe";
    }
    return responseDto;
  }

  public async forgotPassword(forgot: ForgotPasswordRequestDto): Promise<ResponseBaseDto<boolean>> {
    let responseDto: ResponseBaseDto<boolean> = new ResponseBaseDto<boolean>();
    responseDto.data = false;
    const existEmail = this.repoUser.exists({email: forgot.email});
    if (existEmail) {
      const [token, user] = await Promise.all([crypto.randomBytes(32).toString('hex'), this.repoUser.findOne({email: forgot.email})]);
      if (user != null) {
        const resetPassword = new ResetPassword({
          user: user,
          token: token,
          expire: moment.utc().add(60000, 'seconds').toString()
        });
        const refreshPassword = await this.repoResetPassword.create(resetPassword);
  /*      if (refreshPassword) {
          const html = '<h4><b>Reset Password</b></h4>' +
            '<p>To reset your password, complete this form:</p>' +
            '<a href=http://' + this.appConfig._urlClient + 'reset/' + user._id + '/' + token + '>Link</a>' +
            '<br><br>' +
            '<p>--Team</p>'
          this.sendEmailService.sendMail(forgot.email, "Forgot Password", html);
          responseDto.data = true;
          responseDto.message = "Send email for recuve the password"
        }*/
      }
    }
    return responseDto;
  }

  public async refreshPassword(resetPassword: ResetpasswordRequestDto): Promise<ResponseBaseDto<boolean>> {
    let responseDto: ResponseBaseDto<boolean> = new ResponseBaseDto<boolean>();
    responseDto.data = false;
    let user = await this.repoUser.findById(resetPassword.userId);
    if (user != null) {
      let expireTime = moment.utc(resetPassword.expire);
      let currentDate = new Date();
      const rsPassword = await this.repoResetPassword.findOne({token: resetPassword.token});
      if (rsPassword != null) {
        if (resetPassword.password === resetPassword.rptpassword) {
          user.password = await this.bcrypt.hash(resetPassword.password, this.salt);
          let model = await this.repoUser.update(resetPassword.userId, user);
       /*   if (model != null) {
            const html = '<h4><b>Reset Password Success</b></h4>' +
              '<p>Your password is update:</p>' +
              '<br><br>' +
              '<p>--Team</p>'
            this.sendEmailService.sendMail(user.email, "Update Password", html);
            const dl = await this.repoResetPassword.delete(rsPassword._id)
            responseDto.data = true;
            responseDto.status = 200;
            responseDto.message = "Send email for recuve the password"
          }*/
        } else {
          responseDto.status = 402;
        }
      } else {
        responseDto.status = 403;
      }

    } else {
      responseDto.status = 401;
    }
    return responseDto;
  }

  protected modelToDto(model: User, token): UserResponseDto {
    return new UserResponseDto({
      id: model._id,
      firstname: model.firstname,
      email: model.email,
      lastname: model.lastname,
      token: token
    });
  }

  private dtoToModel(dto: SignUpRequestDto): User {
    return new User({
      firstname: dto.firstname,
      lastname: dto.lastname,
      password: dto.password,
      email: dto.email,
      typeId: dto.typeId,
      numberId: dto.numberId,
      phoneNumber: dto.phoneNumber,
    });
  };
}
