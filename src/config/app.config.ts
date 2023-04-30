import { DevError } from '../Helpers/errors/dev.error';
import { cleanEnv, str, port, host, bool, num } from 'envalid';
import { injectable } from 'inversify';
import { isNullOrWhitespace } from '../Helpers/utils/string.helpers';
import { APPLICATION_PORT, MONGO_HOST, MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE, MONGO_PORT, URL_CLIENT } from './env';

@injectable()
export class AppConfig {
    public readonly sourcePath: string = './src';
    public readonly sourcePathProfile: string = './src/public/images';
    public readonly sourcePathPublic: string = "../public/images";
    public readonly apiPath: string = '/api';
    public _urlClient: string = '';

    private _mongoUser: string;
    public get mongoUser(): string {
        return this._mongoUser;
    }

    private _mongoPassword: string;
    public get mongoPassword(): string {
        return this._mongoPassword;
    }

    private _mongoHost: string;
    public get mongoHost(): string {
        return this._mongoHost;
    }

    private _mongoPort: number;
    public get mongoPort(): number {
        return this._mongoPort;
    }

    private _mongoDatabase: string;
    public get mongoDatabase(): string {
        return this._mongoDatabase;
    }

    private _applicationPort: number;
    public get applicationPort(): number {
        return this._applicationPort;
    }

    private _applicationHost: string;
    public get applicationHost(): string {
        return this._applicationHost;
    }

    private _debug: boolean;
    public get debug(): boolean {
        return this._debug;
    }
    /**
     * SMTP
     */
    private _smtpUsername: string;
    private _smtpPort: number;
    private _smtpPassword: string;

    public get smtpUsername(): string {
        return this._smtpUsername;
    }


    public get smtpPassword(): string {
        return this._smtpPassword
    }
    private _tokenExpirationInMin: number;
    public get tokenExpirationInMin(): number {
        return this._tokenExpirationInMin;
    }

    public setApplicationHost(host: string) {
        if (!isNullOrWhitespace(this._applicationHost)) {
            throw new DevError(`Variable 'applicationHost' already set-up: '${this._applicationHost}'`);
        }
        this._applicationHost = host === '::' ? 'localhost' : host;
    }

    public initialize(processEnv: NodeJS.ProcessEnv) {
        
        // const env = cleanEnv(processEnv, {
        //     MONGO_USER: str({ example: 'lkurzyniec', devDefault: '' }),
        //     MONGO_PASSWORD: str({ example: 'someSTRONGpwd123', devDefault: '' }),
        //     MONGO_HOST: host({ devDefault: 'localhost', example: 'mongodb0.example.com' }),
        //     MONGO_PORT: port({ default: 27017 }),
        //     MONGO_DATABASE: str({ default: 'intranet' }),
        //     APPLICATION_PORT: port({ devDefault: 5000, desc: 'Port number on which the Application will run' }),
        //     DEBUG: bool({ default: false, devDefault: true }),
        //     TOKEN_EXPIRATION_IN_MIN: num({ default: 15, devDefault: 60 }),
        //     SMTP_PORT: port({devDefault: 587, desc: '587'}),
        //     SMTP_USER: str({devDefault: 'sergio.inventiba', example: 'sergio.inventiba'}),
        //     SMTP_PASSWORD: str({devDefault: 'sergioorjuela'}),
        //     URL_CLIENT: str({devDefault: 'localhost:3000/'})
        // });

        this._mongoUser = MONGO_USER;
        this._mongoPassword = MONGO_PASSWORD;
        this._mongoHost = MONGO_HOST;
        this._mongoPort = parseInt(MONGO_PORT);
        this._mongoDatabase = MONGO_DATABASE;
        this._applicationPort = 5050;
        this._debug = true;
        this._tokenExpirationInMin = 540;
        this._urlClient = URL_CLIENT;
    }
}
