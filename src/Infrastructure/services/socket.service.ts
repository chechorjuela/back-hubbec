import {inject, injectable} from 'inversify';
import { Server, Socket } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import { RequestHandler } from 'express';
import {AppLogger} from "../../App/loggers/app.logger";

@injectable()
export class SocketService {
  private httpServer: HttpServer;
  public io: Server;
  @inject(AppLogger) private readonly appLogger: AppLogger;

  constructor() {
    this.io = new Server(this.httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT'],
      },
    });
  }

  public initializeMiddleware(): RequestHandler {
    return (req, res, next) => {
      // @ts-ignore
      req.io = this.io;
      next();
    };
  }

  public initialize(): void {
    this.httpServer = createServer();

    this.io.on('connection', (socket: Socket) => {
      this.appLogger.info(`Socket Connected*************************************: ${socket.id}`);
      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
      });

      socket.on('listHobbie', (data) => {
        console.log('Send emmit:', socket.id);
        this.emit('listHobbie', data);
      })
    });

    this.httpServer.listen(process.env.PORT || 3000, () => {
      console.log(`Server listening on port ${process.env.PORT || 3000}.`);
    });
  }

  public emit(event: string, data: any): void {
    this.io.emit(event, data);

  }
}