import {User} from '../../../Domain/models/user.model';
import {inject, injectable} from 'inversify';
import {BaseService} from '../base.service';
import {UserResponseDto, UserRequestDto, ResponseBaseDto, PaginatorResponse, UpdatePasswordRequestDto} from "../../../Domain/dtos/index.response";
import {UsersRepository} from "../../../Domain/repositories/index.repositories";
import {BcryptWrapper} from "../../wrappers/bcrypt.wrapper";
import IUserServiceImplInterface from "../../interfaces/IUserServiceImpl.interface";

@injectable()
export class UserService extends BaseService<UserResponseDto, UserRequestDto, User> implements IUserServiceImplInterface{

  @inject(UsersRepository) protected readonly repo: UsersRepository;
  @inject(BcryptWrapper) private readonly bcrypt: BcryptWrapper;

  private readonly salt = 10;

  public async create(userRequest: UserRequestDto): Promise<ResponseBaseDto<UserResponseDto>> {
    let responseDto: ResponseBaseDto<UserResponseDto> = new ResponseBaseDto<UserResponseDto>();
    const isEmailTaken = await this.repo.exists({email: userRequest.email});

    if (!isEmailTaken) {
      let length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
      for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      const password = Promise.resolve(this.bcrypt.hash(retVal, this.salt));
      if (password != null) {
        const userCreate = this.dtoToModel(userRequest, await password);
        let user = await this.repo.create(userCreate);
        let dtoUser: UserResponseDto = new UserResponseDto();
        if (user) {

          [dtoUser] = await Promise.all([this.modelToDto(user)]);
          responseDto.status = 200;
          responseDto.data = dtoUser;
        }
      }

    } else {
      responseDto.status = 200;
      responseDto.message = "Usuario ya se encuentra registrado";
    }
    return responseDto;

  }

  public async delete(id: string): Promise<ResponseBaseDto<UserResponseDto>> {
    let responseDto: ResponseBaseDto<UserResponseDto> = new ResponseBaseDto<UserResponseDto>();
    const exist = await this.repo.exists({_id: id});
    if (exist) {
      let model = new User({
        _id: id,
        delete: true
      });
      [model, responseDto.data] = await Promise.all([this.repo.update(id, model), this.modelToDto(model)]);
      responseDto.status = 200;
    }
    return responseDto;
  }

  public async findById(id: string): Promise<ResponseBaseDto<UserResponseDto>> {
    let responseDto: ResponseBaseDto<UserResponseDto> = new ResponseBaseDto<UserResponseDto>();
    const find_exist = await this.repo.exists({_id: id});
    if (find_exist) {
      let user_find;
      [user_find, responseDto.data] = await Promise.all([this.repo.findById(id), this.modelToDto(user_find)]);
    } else {
      responseDto.message = "No se encuentro resultados";
    }
    return responseDto;
  }

  public async getAll(deleted: boolean, queryfilter): Promise<ResponseBaseDto<PaginatorResponse<UserResponseDto[]>>> {
    let responseDto: ResponseBaseDto<PaginatorResponse<UserResponseDto[]>> = new ResponseBaseDto<PaginatorResponse<UserResponseDto[]>>();
    let query = {
      delete: deleted
    };
    let data = [];
    //const data = await this.repoUser.getAll(query, {firstname: 'asc'});
    let paginateResponse: PaginatorResponse<UserResponseDto[]> = new PaginatorResponse<UserResponseDto[]>();
    const paginate = await this.repo.paginator(query, parseInt(queryfilter.limit), parseInt(queryfilter.skip), parseInt(queryfilter.page), null, {firstname: 'asc'});
    const userData = await Promise.all(paginate.data.map((item) => this.modelToDto(item)))
    paginateResponse.data = userData;
    paginateResponse.currentPage = paginate.currentPage;
    paginateResponse.hasNextPage = paginate.hasNextPage;
    paginateResponse.nextPage = paginate.nextPage;
    paginateResponse.hasPrevPage = paginate.hasPrevPage;
    paginateResponse.prevPage = paginate.prevPage;
    paginateResponse.limit = paginate.limit;
    paginateResponse.offset = paginate.offset;
    paginateResponse.total = paginate.total;
    paginateResponse.pages = paginate.pages;
    responseDto.data = paginateResponse;
    responseDto.status = 200;
    return responseDto;
  }

  public async update(id: string, dto: UserRequestDto): Promise<ResponseBaseDto<UserResponseDto>> {
    let responseDto: ResponseBaseDto<UserResponseDto> = new ResponseBaseDto<UserResponseDto>();
    const exist = await this.repo.exists({_id: id});
    if (exist) {
      let model = this.dtoToModel(dto);
      delete model.password;
      model.updateAt = new Date(Date.now());
      model = await this.repo.update(id, model);
      if (model) {
        [responseDto.data] = await Promise.all([this.modelToDto(model)]);
        responseDto.status = 200;
      }
    }

    return responseDto;
  }

  public async updatePassword(dto: UpdatePasswordRequestDto): Promise<ResponseBaseDto<UserResponseDto>> {
    let responseDto: ResponseBaseDto<UserResponseDto> = new ResponseBaseDto<UserResponseDto>();
    const user = await this.repo.findById(dto.userId);
    const isPasswordMatch = await this.bcrypt.compare(dto.currentPassword, user.password);
    if(isPasswordMatch){
      if(dto.newPassword===dto.rptPassword){
        let dtoUser: UserResponseDto = new UserResponseDto();
        let model;
        [user.password, model, dtoUser] = await Promise.all([this.bcrypt.hash(dto.newPassword, this.salt), this.repo.update(dto.userId, user), this.modelToDto(model)]);
        responseDto.status = 200;
        responseDto.data = dtoUser;
      }else{
        responseDto.status = 402;
      }
    }else{
      responseDto.status = 401;
    }
    return responseDto;
  }

  protected modelToDto(model: User): UserResponseDto {
    const dto = new UserResponseDto({
      id: model._id,
      firstname: model.firstname,
      email: model.email,
      lastname: model.lastname,
      birthdate: model.birthdate,
      create_at: model.createAt,
      update_at: model.updateAt,

    });

    return dto;
  }

  protected dtoToModel(dto: UserRequestDto, passwordToken?: string): User {

    return new User({
      firstname: dto.firstname,
      lastname: dto.lastname,
      email: dto.email,
      birthdate: dto.birthdate,
      password: passwordToken,
    });
  };
}
