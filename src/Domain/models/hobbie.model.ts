import {model, Document, Schema} from 'mongoose';
import {BaseModel} from './base.model';

const hobbieSchema = new Schema({
  nameHobbie: {type: Schema.Types.String, required: true},
  userId: {ref: 'User', type: Schema.Types.ObjectId, required: true},
  creaetAt: {type: Schema.Types.Date, default: new Date(Date.now())},
  updateAt: {type: Schema.Types.Date},
  delete: {type: Schema.Types.Boolean, default: false}
});

export class Hobbie extends BaseModel {
  nameHobbie: string;
  userId: string;
  createAt: Date;
  updateAt?: Date;
  delete: boolean;
  constructor(init?: Partial<Hobbie>) {
    super(init);
    Object.assign(this, init);
  }
}

export const HobbieModel = model<Hobbie & Document>('hobbie', hobbieSchema);