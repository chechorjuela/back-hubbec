import {Document, model, Schema} from 'mongoose';
import { BaseModel } from './base.model';

export const TypeIdentificatorSchema = new Schema({
  name: { type: Schema.Types.String, required: true },
  type: {
    type:Schema.Types.String,
    enum:['CC','Passport','T.I'],
  }
});

export class TypeIdentificator extends BaseModel {
  name: string;

  constructor(init?: Partial<TypeIdentificator>) {
    super(init);
    Object.assign(this, init);
  }
}
export const TypeIdentificatorModel = model<TypeIdentificator & Document>('TypeIdentificator', TypeIdentificatorSchema);
