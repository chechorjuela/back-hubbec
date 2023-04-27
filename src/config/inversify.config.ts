// import { ProgressRepository } from '../Domain/repositories/progress.repository';
import {JwtWrapper} from '../Infrastructure/wrappers/jwt.wrapper';
import {BcryptWrapper} from '../Infrastructure/wrappers/bcrypt.wrapper';
import {AuthLogger} from '../App/loggers/auth.logger';
import {AuthMiddleware} from '../Applications/middlewares/auth.middleware';
import {SecretsProvider} from '../Infrastructure/services/token/secrets.provider';
import {TokenService} from '../Infrastructure/services/token/token.service';
import {AuthService} from '../Infrastructure/services/auth/auth.service';
import {UserModel} from '../Domain/models/user.model';
import {UsersRepository} from '../Domain/repositories/user.repository';
import {AuthController} from '../Applications/controllers/auth/auth.controller';
import {ErrorExtractor} from '../Helpers/error-extractor.helper';
import {ResponseLoggerMiddleware} from '../Applications/middlewares/response-logger.middleware';
import {ResponseLogger} from '../App/loggers/response.logger';
import {ErrorMiddleware} from '../Applications/middlewares/error.middleware';
import {RequestLoggerMiddleware} from '../Applications/middlewares/request.logger.middleware';
import {RequestLogger} from '../App/loggers/request.logger';
import {Container as InversifyContainer, interfaces, ContainerModule} from 'inversify';
import {AppLogger} from '../App/loggers/app.logger';
import {UserController} from '../Applications/controllers/user/user.controller';
import {MongoDbConnector} from './connectors/mongdb.connector';
import {App} from '../App/app';
import {AppConfig} from './app.config';
import {BaseController} from '../Applications/controllers/base.controller';
import {UserService} from '../Infrastructure/services/user/user.service';
import {SwaggerConfig} from './swagger.config';

/*import {FilesService} from "../Infrastructure/services/file/file.service";
import {FilePathRepository} from "../Domain/repositories/filePath.repository";
import SendEmailService from "../Infrastructure/services/mail/sendEmail.service";
import {ResetPasswordRepository} from "../Domain/repositories/resetPassword.repository";
import {TypeUserRepository} from "../Domain/repositories/typeUser.repository";
import {TypeUserModel} from "../Domain/models/typeUser.model";
import {StatusRepository} from "../Domain/repositories/status.repository";
import {StatusModel} from "../Domain/models/status.model";*/

export class Container {
  private _container: InversifyContainer = new InversifyContainer();

  protected get container(): InversifyContainer {
    return this._container;
  }

  constructor() {
    this.register();
  }

  public getApp(): App {
    return this.container.get(App);
  }

  // https://github.com/inversify/InversifyJS/blob/master/wiki/recipes.md#injecting-dependencies-into-a-function
  private bindDependencies(func: Function, dependencies: any[]): Function {
    let injections = dependencies.map((dependency) => {
      return this.container.get(dependency);
    });
    return func.bind(func, ...injections);
  }

  private register(): void {
    this._container.load(this.getRepositoriesModule());
    this._container.load(this.getLoggersModule());
    this._container.load(this.getMiddlewaresModule());
    this._container.load(this.getGeneralModule());
    this._container.load(this.getControllersModule());
    this._container.load(this.getHelpersModule());
    this._container.load(this.getServicesModule());
    this._container.load(this.getWrappersModule());

    this._container.bind<App>(App).toSelf();
  }

  private getControllersModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<BaseController>(BaseController).to(UserController);
      bind<BaseController>(BaseController).to(AuthController);
    });
  }

  private getServicesModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<AuthService>(AuthService).toSelf();
      bind<TokenService>(TokenService).toSelf();
      bind<UserService>(UserService).toSelf();
    });
  }

  private getRepositoriesModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<UsersRepository>(UsersRepository).toConstantValue(new UsersRepository(UserModel));
      //bind<ResetPasswordRepository>(ResetPasswordRepository).toConstantValue(new ResetPasswordRepository(ResetPasswordModel));
    });
  }

  private getLoggersModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<AppLogger>(AppLogger).toSelf();
      bind<RequestLogger>(RequestLogger).toSelf();
      bind<ResponseLogger>(ResponseLogger).toSelf();
      bind<AuthLogger>(AuthLogger).toSelf();
    });
  }

  private getMiddlewaresModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<RequestLoggerMiddleware>(RequestLoggerMiddleware).toSelf();
      bind<ErrorMiddleware>(ErrorMiddleware).toSelf();
      bind<ResponseLoggerMiddleware>(ResponseLoggerMiddleware).toSelf();
      bind<AuthMiddleware>(AuthMiddleware).toSelf();
    });
  }

  private getGeneralModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<AppConfig>(AppConfig).toSelf().inSingletonScope();
      bind<SwaggerConfig>(SwaggerConfig).toSelf();
      bind<MongoDbConnector>(MongoDbConnector).toSelf();
    });
  }

  private getHelpersModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<ErrorExtractor>(ErrorExtractor).toSelf();
      bind<SecretsProvider>(SecretsProvider).toSelf().inSingletonScope();
    });
  }

  private getWrappersModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<BcryptWrapper>(BcryptWrapper).toSelf();
      bind<JwtWrapper>(JwtWrapper).toSelf();
    });
  }
}
