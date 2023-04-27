import {Model, Document, FilterQuery, QueryWithHelpers } from 'mongoose';
import {BaseModel} from '../models/base.model';
import {PaginatorBase} from "../models/paginatorBase.model";

export abstract class BaseRepository<TModel extends BaseModel> {
  constructor(
    private mongooseModel: Model<TModel>
  ) {

  }

  public findById(id: string): Promise<TModel> {
    return this.mongooseModel.findById(id).exec();
  }

  public findOne(conditions: FilterQuery<TModel>): Promise<TModel> {
    return this.mongooseModel.findOne(conditions).exec();
  }

  public findMany(conditions: any): Promise<TModel[]> {
    return this.mongooseModel.find(conditions).exec();
  }

  public exists(conditions: FilterQuery<TModel>): any {
    return this.mongooseModel.exists(conditions);
  }

  public getAll(conditions?: Partial<TModel>, sort?: Partial<TModel>, limit?: number, skip?: number, page?: number, comeback?): Promise<TModel[]> {
    // @ts-ignore
    const query = this.mongooseModel.find(conditions);
    if (sort) {
      // @ts-ignore
      query.sort(sort);
    }
    return query.exec();
  }

  public async create(data: TModel): Promise<TModel> {
    const entity = new this.mongooseModel(data);
    const saved = await entity.save();
    return this.findById(saved._id);
  }

  public async update(id: string, data: TModel): Promise<TModel> {
    const saved = await this.mongooseModel.findByIdAndUpdate(id, data).exec();
    if (!saved) {
      return null;
    }
    return this.findById(saved._id);
  }

  public async delete(id: string): Promise<boolean> {
    const deleted = await this.mongooseModel.findByIdAndDelete(id).exec();
    return !!deleted;
  }

  public async paginator(query, limit: number, skip: number, page: number, filter, sort): Promise<PaginatorBase<TModel[]>> {
    let paginator: PaginatorBase<TModel[]> = new PaginatorBase();
    try {
      let [total] = await Promise.all([this.mongooseModel.countDocuments(query)]);
      let pages = await (limit > 0) ? (Math.ceil(total / limit) || 1) : 0;
      paginator.total = total;
      paginator.pages = pages;
      paginator.data = await Promise.all(await this.getAll(query, sort, limit, skip, page))
      paginator.currentPage = page;
      paginator.nextPage = paginator.currentPage + 1 <= paginator.pages ? page + 1 : null;
      paginator.hasNextPage = paginator.currentPage + 1 <= paginator.pages ? true : false;
      paginator.prevPage = paginator.currentPage - 1 > 0 ? page - 1 : 0;
      paginator.hasPrevPage = paginator.currentPage - 1 > 0;
      paginator.limit = limit;
      paginator.offset = skip;
    } catch (e) {
      throw e;
    }
    return paginator;
  }
}
