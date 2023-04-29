import {User} from '../models/user.model';
import {BaseRepository} from "./base.repository";
import {Document, Model} from 'mongoose';
import {injectable} from "inversify";
import { Hobbie } from '../../Domain/models/hobbie.model';

@injectable()
export class HobbieRepository extends BaseRepository<Hobbie> {
  constructor(mongooseModel: Model<Hobbie & Document>) {
    super(mongooseModel);
  }
}
