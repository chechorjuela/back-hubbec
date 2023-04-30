import { inject, injectable } from "inversify";
import * as fs from "fs";
import { FileRepository } from "../../../Domain/repositories/index.repositories";
import { AppConfig } from "../../../config/app.config";
import { ResponseBaseDto } from "../../../Domain/dtos/response.base.dto";
import { FilePath } from "../../../Domain/models/filePath.model";
import { FileRequestDto } from "../../../Domain/dtos/user/file.request.dto";
import { FilePathResponseDto } from "../../../Domain/dtos/user/filepath.response.dto";

@injectable()
export class FilesService {
  private readonly path;

  @inject(FileRepository) private readonly repoFile: FileRepository;

  constructor(@inject(AppConfig) private readonly appConfig: AppConfig) {
    this.path = appConfig.sourcePathProfile;
  }

  public createFile(
    files: Array<FileRequestDto>,
    path_folders: string,
    path_id: string,
    sub_folder?: string
  ): Array<FilePathResponseDto> {
    let dir_files: Array<FilePathResponseDto> = [];

    let path_folder = `${this.path}/${path_folders}/${path_id}`;
    if (!this.existFolder(path_folder)) {
      this.createFolder(path_folder);
    }
    if (sub_folder) {
      path_folder = `${path_folder}/${sub_folder != "" ? sub_folder : ""}`;
      if (!this.existFolder(path_folder)) {
        this.createFolder(path_folder);
      }
    }

    files.map((file) => {
      let file_response: FilePathResponseDto = new FilePathResponseDto();

      let file_files =
        typeof file.base64 !== "undefined" ? file.base64.toString() : null;
      if (file_files != null) {
        var matches = file_files.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches.length !== 3) {
        }
        let format_file = "txt";
        switch (this.getTypeFile(matches[2])) {
          case "image/png":
            format_file = "png";
            break;
        }
        const buffer_image = Buffer.from(matches[2], "base64");
        const dir_file = `${path_folder}/${file.name}`;
        if (this.existFile(dir_file)) {
          this.deleteFile(dir_file);
        }
        file_response.create_at = new Date();
        file_response.dir_path = dir_file;
        file_response.type_object = path_folders === "user" ? 2 : 1;
        file_response.name = file.name;
        file_response.size = file.size;
        file_response.object_id = path_id;
        file_response.type_file = file.type;

        dir_files.push(file_response);
        const modelCourse = this.dtoModelFile(file_response);

        this.repoFile.create(modelCourse);
        fs.writeFile(
          dir_file,
          buffer_image,
          { encoding: "base64" },
          function (err) {
            console.info(err, "45");
          }
        );
      }
    });
    return dir_files;
  }
  public existFile(path_file: string): boolean {
    try {
      return fs.existsSync(path_file);
    } catch (e) {}
    return false;
  }
  public deleteFile(folder: string): boolean {
    let boolean_delete = false;
    if (this.existFolder(folder)) {
      fs.unlink(folder, (err) => {
        boolean_delete = true;
      });
    }
    return boolean_delete;
  }
  public existFolder(nameFolder: string): boolean {
    let boolean_exist = false;
    if (fs.existsSync(nameFolder)) {
      boolean_exist = true;
    }
    return boolean_exist;
  }

  public createFolder(namefolder: string): string {
   
    try {
      if (!fs.existsSync(namefolder)) {
        fs.mkdirSync(namefolder);
      }
    } catch (e) {
      console.info(e);
    }
    return namefolder;
  }

  public deleteFolder() {}

  public getTypeFile(b64: string) {
    var signatures = {
      JVBERi0: "application/pdf",
      R0lGODdh: "image/gif",
      R0lGODlh: "image/gif",
      iVBORw0KGgo: "image/png",
    };
    for (var s in signatures) {
      if (b64.indexOf(s) === 0) {
        return signatures[s];
      }
    }
  }
  public async getFileByName(
    id: string,
    file: string
  ): Promise<ResponseBaseDto<string>> {
    let response = new ResponseBaseDto<string>();
    let image = await this.repoFile.findOne({ object_id: id, name: file });
    response.data = image.dir_path;
    console.info(response.data)
    return response;
  }

  public async getFileByCourseId(
    id: string
  ): Promise<Array<FilePathResponseDto>> {
    let response: FilePathResponseDto[];
    const files = await this.repoFile.getAll({ object_id: id });
    response = files.map((f) => this.modelToDto(f));

    return response;
  }
  public async deleteFileByIdAndObject(
    id_file: string
  ): Promise<ResponseBaseDto<boolean>> {
    let response: ResponseBaseDto<boolean> = new ResponseBaseDto<boolean>();
    const deleteImage = await this.repoFile.delete(id_file);
    response.data = deleteImage;
    return response;
  }
  private modelToDto(dto: FilePath): FilePathResponseDto {
    return new FilePathResponseDto({
      id: dto._id,
      name: dto.name,
      type_file: dto.type_file,
      dir_path: dto.dir_path,
      object_id: dto.object_id,
      type_object: dto.type_object,
    });
  }
  private dtoModelFile(dto: FilePathResponseDto): FilePath {
    return new FilePath({
      name: dto.name,
      type_file: dto.type_file,
      dir_path: dto.dir_path,
      object_id: dto.object_id,
      type_object: dto.type_object,
    });
  }
}
