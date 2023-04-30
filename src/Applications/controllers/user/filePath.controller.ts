import { IBodyRequest } from './../../interfaces/IBody.request';
import { FilesService } from './../../../Infrastructure/services/user/filePath.service';
import {BaseController} from "../base.controller";
import {inject, injectable} from "inversify";
import {Response} from "express";
@injectable()
export class ImageController extends BaseController{

  @inject(FilesService) private readonly fileService: FilesService;

  constructor() {
    super('/filePath',false);
  }
  initializeRoutes(): void {
    this.router
      .get(`${this.path}/user/:user/:file`,this.getImage.bind(this))
    ;
  }
  private async getImage(request: IBodyRequest<any>, response: Response){
    const file_image = await this.fileService.getFileByName(request.params.user,request.params.file);
    response.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    response.sendfile(file_image.data);
    return;
  }

}
