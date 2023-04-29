import {Document, model, Schema} from "mongoose";
import {BaseModel} from "./base.model";

export const filePathSchema = new Schema({
  id: {type: Schema.Types.String},
  name: {type: Schema.Types.String, required: true},
  type_file: {type: Schema.Types.String, required: true},
  dir_path: {type: Schema.Types.String, required: false},
  object_id: {type: Schema.Types.String},
  type_object: {type: Schema.Types.Number, required: true, default: 1},
  creaet_at: {type: Schema.Types.Date, default: Date.now()},
  delete: {type: Schema.Types.Boolean, default: false}
});


export class FilePath extends BaseModel {
  id: string;
  name: string;
  type_file: string;
  dir_path: string;
  object_id: string;
  type_object: number;
  create_at: Date;
  delete: boolean;
  constructor(init?: Partial<FilePath>) {
    super(init);
    Object.assign(this, init);
  }
}

export const FilePathModel = model<FilePath & Document>('FilePath', filePathSchema);
