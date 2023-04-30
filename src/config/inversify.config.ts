import { ImageController } from './../Applications/controllers/user/filePath.controller';
import { FileModel } from './../Domain/models/filePath.model';
import { FilePath } from 'Domain/models/filePath.model';
import { FileRepository } from './../Domain/repositories/filePath.repository';
import { FilesService } from './../Infrastructure/services/user/filePath.service';
import { JwtWrapper, BcryptWrapper } from "../Infrastructure/wrappers/index.wrapper";

import { ErrorExtractor } from "../Helpers/error-extractor.helper";

import {
  AuthMiddleware,
  ResponseLoggerMiddleware,
  ErrorMiddleware,
  RequestLoggerMiddleware,
} from "../Applications/middlewares/index.middleware";

import {
  AuthLogger,
  AppLogger,
  ResponseLogger,
  RequestLogger,
} from "../App/loggers/index.logger";

import {
  Container as InversifyContainer,
  interfaces,
  ContainerModule,
} from "inversify";

import { MongoDbConnector } from "./connectors/mongdb.connector";
import { App } from "../App/app";
import { AppConfig } from "./app.config";
import {
  UserService,
  TokenService,
  AuthService,
  SecretsProvider,
  HobbieService,
} from "../Infrastructure/services/index.services";
import { SwaggerConfig } from "./swagger.config";
import {
  HobbieController,
  AuthController,
  UserController,
  BaseController,
} from "../Applications/controllers/index.controller";

import { UserModel } from "../Domain/models/user.model";
import { HobbieModel } from "../Domain/models/hobbie.model";
import { ResetPasswordModel } from "../Domain/models/resetPassword.model";

import {
  HobbieRepository,
  ResetPasswordRepository,
  UsersRepository,
} from "../Domain/repositories/index.repositories";

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
      bind<BaseController>(BaseController).to(HobbieController);
      bind<BaseController>(BaseController).to(ImageController);
    });
  }

  private getServicesModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<AuthService>(AuthService).toSelf();
      bind<TokenService>(TokenService).toSelf();
      bind<UserService>(UserService).toSelf();
      bind<HobbieService>(HobbieService).toSelf();
    });
  }

  private getRepositoriesModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<UsersRepository>(UsersRepository).toConstantValue(new UsersRepository(UserModel));
      bind<ResetPasswordRepository>(ResetPasswordRepository).toConstantValue(new ResetPasswordRepository(ResetPasswordModel));
      bind<HobbieRepository>(HobbieRepository).toConstantValue(new HobbieRepository(HobbieModel));
      bind<FileRepository>(FileRepository).toConstantValue(new FileRepository(FileModel));
    
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
      bind<FilesService>(FilesService).toSelf();
    });
  }

  private getWrappersModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<BcryptWrapper>(BcryptWrapper).toSelf();
      bind<JwtWrapper>(JwtWrapper).toSelf();
    });
  }
}
