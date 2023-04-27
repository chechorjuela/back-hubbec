import {injectable} from "inversify";
import {BaseRepository} from "./base.repository";
import {Document, Model} from "mongoose";
import {ResetPassword} from "../models/resetPassword.model";

@injectable()
export class ResetPasswordRepository extends BaseRepository<ResetPassword> {
  constructor(mongooseModel: Model<ResetPassword & Document>) {
    super(mongooseModel);
  }
}
