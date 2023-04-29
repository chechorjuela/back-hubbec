import {ResponseBaseDto} from "../../Domain/dtos/response.base.dto";
import {PaginatorBase} from "../../Domain/models/paginatorBase.model";
import { HobbieResponseDto } from "Domain/dtos/user/hobbie.response.dto";
import { HobbieRequestDto } from "Domain/dtos/user/hobbie.request.dto";

export default interface IHobbieServiceImplInterface {
  getAll(deleted: boolean, queryFilter): Promise<ResponseBaseDto<PaginatorBase<HobbieResponseDto[]>>>;

  create(userRequest: HobbieRequestDto): Promise<ResponseBaseDto<HobbieResponseDto>>;

  update(id: string, dto: HobbieRequestDto): Promise<ResponseBaseDto<HobbieResponseDto>>;

  delete(id: string): Promise<ResponseBaseDto<HobbieResponseDto>>;

  findById(id: string): Promise<ResponseBaseDto<HobbieResponseDto>>;

  getByUserId(id: string): Promise<ResponseBaseDto<HobbieResponseDto>>;
}
