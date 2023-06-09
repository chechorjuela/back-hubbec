import { AuthLogger } from '../../../App/loggers/auth.logger';
import { SecretsProvider } from './secrets.provider';
import { User } from '../../../Domain/models/user.model';
import { AppConfig } from '../../../config/app.config';
import { TokenInfo, TokenData } from './token';
import { injectable, inject } from 'inversify';
import { JwtWrapper } from '../../wrappers/jwt.wrapper';

@injectable()
export class TokenService {
  @inject(AppConfig) private readonly appConfig: AppConfig;
  @inject(SecretsProvider) private readonly secretsProvider: SecretsProvider;
  @inject(AuthLogger) private readonly authLogger: AuthLogger;
  @inject(JwtWrapper) private readonly jwt: JwtWrapper;

  public create(user: User): TokenInfo {
    const tokenData: TokenData = {
      userId: user._id,
      name: user.firstname,
      email: user.email,
    };

    const options = {
      algorithm: 'RS256',
      expiresIn: this.appConfig.tokenExpirationInMin * 60, //*60
    };
    const token = this.jwt.sign(tokenData, this.secretsProvider.privateKey, options);
    return {
      expiresIn: options.expiresIn as number,
      token,
    };
  }

  public verify(token: string): TokenData {

      const options = {
        algorithms: ['RS256'],
      };
      const tokenData = this.jwt.verify(token, this.secretsProvider.publicKey, options) as TokenData;
      return tokenData;

  }
}
