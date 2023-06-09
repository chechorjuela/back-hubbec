import {AppConfig} from '../../../config/app.config';
import {AuthService, RegisterResult} from '../../../Infrastructure/services/auth/auth.service';
import {SignUpRequestDto} from '../../../Domain/dtos/auth/signUp.request.dto';
import {injectable, inject} from 'inversify';
import {BaseController} from '../base.controller';
import {Request, Response} from "express";
import {StatusHelper} from '../../../Helpers/utils/status.helper';
import {IBodyRequest} from '../../interfaces/IBody.request';
import {SignInRequestDto} from "../../../Domain/dtos/auth/signIn.request.dto";
import { DtoValidator } from '../../../Helpers/decorators/dto-validator.decorator';

@injectable()
export class AuthController extends BaseController {

  @inject(AuthService) private readonly auth: AuthService;
  @inject(AppConfig) private readonly appConfig: AppConfig;

  constructor() {
    super('/auth', false);
  }

  public initializeRoutes(): void {
    this.router
      .post(`${this.path}/signup`, this.register.bind(this))
      .post(`${this.path}/signin`, this.login.bind(this))
      .post(`${this.path}/refresh`, this.refresh.bind(this))
      .post(`${this.path}/logout`, this.logout.bind(this));
  }

  @DtoValidator(SignUpRequestDto)
  private async register(request: IBodyRequest<SignUpRequestDto>, response: Response) {
    const dto = request.body;

    const result = await this.auth.signUp(dto);
    response.send(result);
    return;
  }

  /**
   * @swagger
   * /auth/login/:
   *    post:
   *      tags:
   *        - auth
   *      description: Login user
   *      produces:
   *        - application/json
   *      parameters:
   *        - in: body
   *          name: body
   *          description: Login data (email and password)
   *          required: true
   *          schema:
   *            $ref: '#/definitions/LoginRequestDto'
   *      responses:
   *        200:
   *          description: Information of logged user
   *        401:
   *          description: Wrong login data
   */
  @DtoValidator(SignInRequestDto)
  private async login(request: IBodyRequest<SignInRequestDto>, response: Response) {
    const dto = request.body;

    const loginResult = await this.auth.signIn(dto);
    if (loginResult.status === 200) {
      response.setHeader('Set-Cookie', `Authorization=${loginResult.data.token.token}; HttpOnly; Max-Age=${loginResult.data.token.expiresIn}; Path=${this.appConfig.apiPath}`);
      response.send(loginResult.data);
      return;
    }

    throw StatusHelper.error401Unauthorized;
  }

  /**
   * @swagger
   * /auth/logout/:
   *    post:
   *      tags:
   *        - auth
   *      summary: Logout currently logged user
   *      responses:
   *        204:
   *          description: Successfully logged out
   */
  private async logout(request: Request, response: Response) {

    response.setHeader('Set-Cookie', 'Authorization=; Max-Age=0');
    response.sendStatus(StatusHelper.status204NoContent);
  }

  private async refresh(request: Request, response: Response) {
    const result = await this.auth.refresh(request);
    response.send(result);
    return;
  }
}
