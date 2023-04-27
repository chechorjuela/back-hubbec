import {BaseModel} from "./base.model";
import {Document, model, Schema} from "mongoose";
import {User} from "./user.model";

const resetPasswordSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  token: {type: Schema.Types.String, required: true},
  expire: {type: Schema.Types.String, required: true}
});

export class ResetPassword extends BaseModel {
  user: User | string;
  expire: string;
  token: string;

  constructor(init?: Partial<ResetPassword>) {
    super(init);
    Object.assign(this, init);
  }
}

export const ResetPasswordModel = model<ResetPassword & Document>('ResetPassword', resetPasswordSchema);
