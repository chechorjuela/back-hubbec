export class ResponseBaseDto<T> {
  public status: number = 200;
  public data: T;
  public message: string = "";
}
