import {IAuthRequest} from './IAuth.request';

export interface IBodyRequest<T> extends IAuthRequest {
  body: T;
}
