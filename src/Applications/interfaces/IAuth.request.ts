import { TokenData } from '../../Infrastructure/services/token/token';
import { Request } from 'express';

export interface IAuthRequest extends Request {
  auth: TokenData;
}
