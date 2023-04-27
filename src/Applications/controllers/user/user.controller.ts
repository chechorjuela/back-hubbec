import {IAuthRequest} from '../../interfaces/IAuth.request';
import {injectable, inject} from 'inversify';
import {BaseController} from '../base.controller';
import {Response} from "express";
import {StatusHelper} from '../../../Helpers/utils/status.helper';
import {IBodyRequest} from '../../interfaces/IBody.request';
import {IdValidator} from '../../../Helpers/decorators/id-validator.decorator';
import {UserService} from "../../../Infrastructure/services/user/user.service";
import {UserRequestDto} from "../../../Domain/dtos/user/user.request.dto";
import {UpdatePasswordRequestDto} from "../../../Domain/dtos/auth/updatePassword.request.dto";

@injectable()
export class UserController extends BaseController {
  @inject(UserService) private readonly userService: UserService;

  constructor() {
    super('/user');
  }

  public initializeRoutes(): void {
    this.router
      .get(`${this.path}`, this.index.bind(this))
      .post(`${this.path}`, this.create.bind(this))
      .put(`${this.path}/:id`, this.update.bind(this))
      .get(`${this.path}/:id`, this.getById.bind(this))
      .delete(`${this.path}/:id`, this.delete.bind(this))
      .get(`${this.path}/profile/:id`, this.getProfile.bind(this))
      .post(`${this.path}/updatepassword`, this.updatePassword.bind(this))
  }

  private async index(request: IAuthRequest, response: Response) {
    /*onst withDeleted = this.getBoolFromQueryParams(request, 'withDeleted');
    const data = await this.userService.getAll(request.auth.userId, withDeleted);
    response.send(data);*/
    const withDeleted = this.getBoolFromQueryParams(request, 'deleted');

    console.info();
    const usersList = await this.userService.getAll(withDeleted, request.query);
    response.send(usersList);
    return;
  }

  @IdValidator()
  private async getById(request: IAuthRequest, response: Response) {
    const userUpdate = await this.userService.findById(request.params.id);
    if (userUpdate) {
      response.send(userUpdate);
    } else {
      throw StatusHelper.error404NotFound;
    }
  }

  /**
   * @swagger
   * /user:
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
  private async create(request: IBodyRequest<UserRequestDto>, response: Response) {
    const dto = request.body;
    const user = await this.userService.create(dto);
    if (user) {
      response.send(user);
    }
    return;
  }

  @IdValidator()
  private async update(request: IBodyRequest<UserRequestDto>, response: Response) {
    const userUpdate = await this.userService.update(request.params.id, request.body);
    response.send(userUpdate);
    return;
  }

  private async getProfile(request: IBodyRequest<UserRequestDto>, response: Response) {
    const userProfile = await this.userService.findById(request.params.id);
    // @ts-ignore
    response.sendfile(userProfile.data.profile_image);
    return;
  }

  @IdValidator()
  private async delete(request: IAuthRequest, response: Response) {
    const id = request.params.id;
    const deleteUser = await this.userService.delete(request.params.id);
    if (deleteUser) {
      response.sendStatus(StatusHelper.status204NoContent);
    } else {
      throw StatusHelper.error404NotFound;
    }
  }

  private async updatePassword(request: IBodyRequest<UpdatePasswordRequestDto>, response: Response) {
    const dto = request.body;
    const passwordUpdate = await this.userService.updatePassword(dto);
    response.send(passwordUpdate)
  }
}
