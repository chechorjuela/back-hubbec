import {model, Document, Schema} from 'mongoose';
import {FilePath} from './filePath.model';
import {BaseModel} from './base.model';

const userSchema = new Schema({
  address: {type: Schema.Types.String, required: false},
  firstname: {type: Schema.Types.String, required: true},
  lastname: {type: Schema.Types.String, required: true},
  country: {type: Schema.Types.String, required: false},
  city: {type: Schema.Types.String, required: false},
  phoneNumber: {type: Schema.Types.Number, required: false},
  email: {type: Schema.Types.String, required: true, unique: true},
  password: {type: Schema.Types.String, required: true},
  typeId: { type: Schema.Types.String, required: true},
  numberId: {type: Schema.Types.String, required: true},
  photoProfile: {type: Schema.Types.String},
  birthDate: {type: Schema.Types.Date},
  expeditionDate: {type: Schema.Types.Date},
  createAt: {type: Schema.Types.Date, default: new Date(Date.now())},
  updateAt: {type: Schema.Types.Date},
  delete: {type: Schema.Types.Boolean, default: false}
});

export class User extends BaseModel {
  address?: string;
  firstname: string;
  lastname: string;
  email: string;
  country?: string;
  city?: string;
  phoneNumber: string;
  password: string;
  typeId: string;
  numberId: string;
  photoProfile?: string | null;
  birthDate: Date;
  expeditionDate: Date;
  createAt: Date;
  updateAt?: Date;
  delete: boolean;

  constructor(init?: Partial<User>) {
    super(init);
    Object.assign(this, init);
  }
}

export const UserModel = model<User & Document>('User', userSchema);
