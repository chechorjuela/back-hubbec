import {model, Document, Schema} from 'mongoose';
import {FilePath} from './filePath.model';
import {BaseModel} from './base.model';

const userSchema = new Schema({
  firstname: {type: Schema.Types.String, required: true},
  lastname: {type: Schema.Types.String, required: true},
  phoneNumber: {type: Schema.Types.Number, required: true},
  email: {type: Schema.Types.String, required: true, unique: true},
  password: {type: Schema.Types.String, required: true},
  typeId: {ref: 'TypeIdentificator', type: Schema.Types.ObjectId, required: true},
  numberId: {type: Schema.Types.String, required: true},
  photoProfile: {ref: 'FilePath', type: Schema.Types.ObjectId},
  birthdate: {type: Schema.Types.Date},
  expeditionDate: {type: Schema.Types.Date},
  creaetAt: {type: Schema.Types.Date, default: new Date(Date.now())},
  updateAt: {type: Schema.Types.Date},
  delete: {type: Schema.Types.Boolean, default: false}
});

export class User extends BaseModel {
  firstname: string;
  lastname: string;
  email: string;
  country?: string;
  city?: string;
  address?: string;
  phoneNumber: string;
  password: string;
  typeId: string;
  numberId: string;
  photoProfile?: FilePath | null;
  expeditionDate: Date;
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
