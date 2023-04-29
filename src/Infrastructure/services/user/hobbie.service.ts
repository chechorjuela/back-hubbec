import { inject, injectable } from "inversify";
import { BaseService } from "../base.service";
import { ResponseBaseDto } from "../../../Domain/dtos/response.base.dto";
import { PaginatorResponse } from "../../../Domain/dtos/paginator.response.dto";
import { Hobbie } from "../../../Domain/models/hobbie.model";
import { HobbieRepository } from "../../../Domain/repositories/index.repositories";
import { HobbieRequestDto } from "../../../Domain/dtos/user/hobbie.request.dto";
import { HobbieResponseDto } from "../../../Domain/dtos/user/hobbie.response.dto";
import IHobbieServiceImplInterface from "../../../Infrastructure/interfaces/IHobbieService.interface";

@injectable()
export class HobbieService extends BaseService<HobbieResponseDto, HobbieRequestDto, Hobbie> implements IHobbieServiceImplInterface
{
  @inject(HobbieRepository) protected readonly repo: HobbieRepository;

  public async create(hobbieRequest: HobbieRequestDto): Promise<ResponseBaseDto<HobbieResponseDto>> {
    
    let responseDto: ResponseBaseDto<HobbieResponseDto> = new ResponseBaseDto<HobbieResponseDto>();

    const isExist = await this.repo.exists({
      nameHobbie: hobbieRequest.nameHobbie,
    });

    return responseDto;
  }

  public async delete(id: string): Promise<ResponseBaseDto<HobbieResponseDto>> {
    let responseDto: ResponseBaseDto<HobbieResponseDto> = new ResponseBaseDto<HobbieResponseDto>();
    const exist = await this.repo.exists({ _id: id });

    return responseDto;
  }

  public async findById(id: string): Promise<ResponseBaseDto<HobbieResponseDto>> {
    let responseDto: ResponseBaseDto<HobbieResponseDto> =
      new ResponseBaseDto<HobbieResponseDto>();
    const find_exist = await this.repo.exists({ _id: id });
    if (find_exist) {
      let user_find = await this.repo.findById(id);
      responseDto.data = await this.modelToDto(user_find);
    } else {
      responseDto.message = "No se encuentro resultados";
    }
    return responseDto;
  }

  public async getAll(deleted: boolean,queryfilter
  ): Promise<ResponseBaseDto<PaginatorResponse<HobbieResponseDto[]>>> {
    let responseDto: ResponseBaseDto<PaginatorResponse<HobbieResponseDto[]>> =
      new ResponseBaseDto<PaginatorResponse<HobbieResponseDto[]>>();
    let query = {
      delete: deleted,
    };
    let data = [];
    //const data = await this.repoUser.getAll(query, {firstname: 'asc'});
    let paginateResponse: PaginatorResponse<HobbieResponseDto[]> =
      new PaginatorResponse<HobbieResponseDto[]>();
    const paginate = await this.repo.paginator(
      query,
      parseInt(queryfilter.limit),
      parseInt(queryfilter.skip),
      parseInt(queryfilter.page),
      null,
      { firstname: "asc" }
    );
    const userData = await Promise.all(
      paginate.data.map((item) => this.modelToDto(item))
    );
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

  public async update(
    id: string,
    dto: HobbieRequestDto
  ): Promise<ResponseBaseDto<HobbieResponseDto>> {
    
    let responseDto: ResponseBaseDto<HobbieResponseDto> = new ResponseBaseDto<HobbieResponseDto>();

    return responseDto;
  }

  public async getByUserId(id: string): Promise<ResponseBaseDto<HobbieResponseDto>> {
    let responseDto: ResponseBaseDto<HobbieResponseDto> = new ResponseBaseDto<HobbieResponseDto>();

    return responseDto;
  }

  protected modelToDto(model: Hobbie): HobbieResponseDto {
    const dto = new HobbieResponseDto({
      id: model._id,
      nameHobbie: model.nameHobbie,
      userId: model.userId,
    });
    return dto;
  }

  protected dtoToModel(dto: HobbieRequestDto): Hobbie {
    return new Hobbie({
      userId: dto.userId,
      nameHobbie: dto.nameHobbie,
    });
  }
}
