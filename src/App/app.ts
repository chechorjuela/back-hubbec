import { RequestLoggerMiddleware } from '../Applications/middlewares/request.logger.middleware';
import { ResponseLoggerMiddleware } from '../Applications/middlewares/response-logger.middleware';
import { AppLogger } from './loggers/app.logger';
import { MongoDbConnector } from '../config/connectors/mongdb.connector';
import { DevError } from '../Helpers/errors/dev.error';
import { AppConfig } from '../config/app.config';
import { BaseController } from '../Applications/controllers/base.controller';
import { ErrorMiddleware } from '../Applications/middlewares/error.middleware';
import { SwaggerConfig } from '../config/swagger.config';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import helmet from 'helmet';
import * as cors from 'cors';
import { jsonIgnoreReplacer } from 'json-ignore';
import { injectable, inject, multiInject } from 'inversify';
import { AddressInfo } from 'net';
import * as path from 'path';
import * as bodyParser from "body-parser";
import {SocketService} from "../Infrastructure/services/socket.service";

@injectable()
export class App {
  private app: express.Application = express();
  private isInitialized: boolean = false;

  @inject(AppConfig) private readonly appConfig: AppConfig;
  @multiInject(BaseController) private controllers: BaseController[];
  @inject(MongoDbConnector) private readonly dbConnector: MongoDbConnector;
  @inject(SwaggerConfig) private readonly swaggerConfig: SwaggerConfig;
  @inject(AppLogger) private readonly appLogger: AppLogger;
  @inject(ErrorMiddleware) private readonly errorMiddleware: ErrorMiddleware;
  @inject(RequestLoggerMiddleware) private readonly requestLoggerMiddleware: RequestLoggerMiddleware;
  @inject(ResponseLoggerMiddleware) private readonly responseLoggerMiddleware: ResponseLoggerMiddleware;
  @inject(SocketService) private readonly socketService: SocketService;
  public initialize(process: NodeJS.Process): void {
    this.appConfig.initialize(process.env);

    this.dbConnector.connect();
    this.socketService.initialize()
    this.setExpressSettings();
    this.initializePreMiddlewares();
    this.initializeControllers();
    this.initializePostMiddlewares();

    this.isInitialized = true;
  }

  public listen() {
    if (!this.isInitialized) {
      throw new DevError('Call initialize() before.');
    }

    const server = this.app.listen(this.appConfig.applicationPort, () => {
      const addressInfo = server.address() as AddressInfo;
      this.appConfig.setApplicationHost(addressInfo.address);

      this.swaggerConfig.initialize(this.app);

      this.appLogger.info(`Listening at 'http://${this.appConfig.applicationHost}:${this.appConfig.applicationPort}'.`);
    });
  }

  private setExpressSettings(): void {
    this.app.set('json replacer', jsonIgnoreReplacer);
  }

  private initializePreMiddlewares(): void {
    this.app.use(this.socketService.initializeMiddleware());
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(bodyParser.urlencoded({extended: true,limit:"150mb"}))
    this.app.use(bodyParser.json({limit:"150mb"}));
    this.app.use(express.static(path.resolve(__dirname,this.appConfig.sourcePathPublic)));
    this.app.use(this.requestLoggerMiddleware.handle.bind(this.requestLoggerMiddleware));
    this.app.use(this.responseLoggerMiddleware.handle.bind(this.responseLoggerMiddleware));
  }

  private initializeControllers(): void {
    this.app.get('/', (req, res) => {
      res.redirect('/swagger');
    });

    this.controllers.forEach((controller: BaseController) => {
      controller.initializeRoutes();
      this.app.use(this.appConfig.apiPath, controller.router);
      this.appLogger.debug(`Registered '${this.appConfig.apiPath}${controller.path}'.`);
    });
  }

  private initializePostMiddlewares(): void {
    this.app.use(this.errorMiddleware.handle.bind(this.errorMiddleware));
  }
}
