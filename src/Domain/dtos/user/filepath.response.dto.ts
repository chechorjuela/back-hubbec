export class FilePathResponseDto {
    public id: string;
    public name: string;
    public type_file: string;
    public dir_path: string;
    public size:number;
    public object_id: string;
    public type_object: number;
    public create_at: Date;
    public delete: boolean;
  
    constructor(init?: Partial<FilePathResponseDto>) {
      Object.assign(this, init);
    }
  }
  