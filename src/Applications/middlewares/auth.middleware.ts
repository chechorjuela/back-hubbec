import { TokenService } from '../../Infrastructure/services/token/token.service';
import { IAuthRequest } from '../interfaces/IAuth.request';
import { Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { StatusHelper } from '../../Helpers/utils/status.helper';

@injectable()
export class AuthMiddleware {
  @inject(TokenService) private readonly tokenService: TokenService;

  public handle(request: IAuthRequest, response: Response, next: NextFunction): void {
    if (!request.cookies || !request.cookies.Authorization) {
      throw StatusHelper.error401Unauthorized;
    }

    const tokenData = this.tokenService.verify(request.cookies.Authorization);
    if (!tokenData) {
      throw StatusHelper.error401Unauthorized;
    }

    request.auth = tokenData;
    next();
  }
}
