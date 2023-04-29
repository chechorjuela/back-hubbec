export class HobbieResponseDto {
  public id: string;
  public nameHobbie: string;
  public userId: string;
  public create_at: Date;
  public update_at: Date;

  constructor(init?: Partial<HobbieResponseDto>) {
    Object.assign(this, init);
  }
}
