import {injectable} from "inversify";
import {BaseRepository} from "./base.repository";
import {Document, Model} from "mongoose";
import { FilePath } from "../../Domain/models/filePath.model";

@injectable()
export class FileRepository extends BaseRepository<FilePath> {
  constructor(mongooseModel: Model<FilePath & Document>) {
    super(mongooseModel);
  }
}
