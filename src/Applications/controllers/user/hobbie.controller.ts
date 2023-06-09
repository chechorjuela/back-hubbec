import {injectable, inject} from 'inversify';
import { BaseController } from "../base.controller";
import { HobbieService } from "../../../Infrastructure/services/user/hobbie.service";
import { IAuthRequest } from '../../../Applications/interfaces/IAuth.request';
import { IBodyRequest } from '../../../Applications/interfaces/IBody.request';
import { HobbieRequestDto } from '../../../Domain/dtos/user/hobbie.request.dto';
import {Response} from "express";
import { IdValidator } from '../../../Helpers/decorators/id-validator.decorator';
import { StatusHelper } from '../../../Helpers/utils/status.helper';
import {SocketService} from "../../../Infrastructure/services/socket.service";

@injectable()
export class HobbieController extends BaseController {
  @inject(HobbieService) private readonly hobbieService: HobbieService;
  @inject(SocketService) private readonly socketService: SocketService;

  constructor() {
    super('/hobbie');
  }

  public initializeRoutes(): void {
    this.router
      .get(`${this.path}`, this.index.bind(this))
      .post(`${this.path}`, this.create.bind(this))
      .get(`${this.path}/:userId`, this.getHobbieByUser.bind(this))
      .delete(`${this.path}/:id`, this.delete.bind(this))
      .put(`${this.path}/:id`, this.update.bind(this))
  }

  private async index(request: IAuthRequest, response: Response) {
    /*onst withDeleted = this.getBoolFromQueryParams(request, 'withDeleted');
    const data = await this.userService.getAll(request.auth.userId, withDeleted);
    response.send(data);*/
    const withDeleted = this.getBoolFromQueryParams(request, 'deleted');

    const usersList = await this.hobbieService.getAll(withDeleted, request.query);
    response.send(usersList);
    return;
  }


  private async create(request: IBodyRequest<HobbieRequestDto>, response: Response) {
    const dto = request.body;
    const hobbie = await this.hobbieService.create(dto);
    if (hobbie) {
      this.socketService.emit('listHobbie',hobbie);
      response.send(hobbie);
    }
    return;
  }

  @IdValidator()
  private async delete(request: IAuthRequest, response: Response) {
    const id = request.params.id;
    const deleteUser = await this.hobbieService.delete(request.params.id);
    if (deleteUser) {
      response.sendStatus(StatusHelper.status204NoContent);
    } else {
      throw StatusHelper.error404NotFound;
    }
  }

  private async getHobbieByUser(request: IAuthRequest, response: Response) {
    const hobbieByUser = await this.hobbieService.getByUserId(request.params.userId);
    response.send(hobbieByUser);
  }

  @IdValidator()
  private async update(request: IBodyRequest<HobbieRequestDto>, response: Response) {
    const userUpdate = await this.hobbieService.update(request.params.id, request.body);
    response.send(userUpdate);
    return;
  }
}