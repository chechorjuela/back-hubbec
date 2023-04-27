import { AppConfig } from '../../../config/app.config';
import { injectable, inject } from 'inversify';
import { readFileSync } from 'fs';

@injectable()
export class SecretsProvider {
  private _privateKey: string;
  public get privateKey(): string {
    return this._privateKey;
  }

  private _publicKey: string;
  public get publicKey(): string {
    return this._publicKey;
  }

  constructor(
    @inject(AppConfig) private readonly appConfig: AppConfig
  ) {
    this._privateKey = readFileSync(`${appConfig.sourcePath}/config/tokenKey/private.key`, 'utf8');
    this._publicKey = readFileSync(`${appConfig.sourcePath}/config/tokenKey/public.key`, 'utf8');
  }
}
