import {model, Document, Schema} from 'mongoose';
import {BaseModel} from './base.model';

const userSchema = new Schema({
  firstname: {type: Schema.Types.String, required: true},
  lastname: {type: Schema.Types.String, required: true},
  email: {type: Schema.Types.String, required: true, unique: true},
  password: {type: Schema.Types.String, required: true},
  birthdate: {type: Schema.Types.Date},
  creaetAt: {type: Schema.Types.Date, default: Date.now()},
  updateAt: {type: Schema.Types.Date},
  delete: {type: Schema.Types.Boolean, default: false}
});

export class User extends BaseModel {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  birthdate: Date;
  createAt: Date;
  updateAt?: Date;
  delete: boolean;

  constructor(init?: Partial<User>) {
    super(init);
    Object.assign(this, init);
  }
}

export const UserModel = model<User & Document>('User', userSchema);
