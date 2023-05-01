export class UserResponseDto {
  public address: string;
  public city?: string;
  public country?: string;

  public id: string;
  public firstname: string;
  public lastname: string;
  public numberId: string;
  public email: string;

  public birthDate: Date;
  public expeditionDate?: Date;
  public phonenumber?: string;
  public typeId?: string;
  public create_at: Date;
  public update_at: Date;

  public profile_image: string;

  public token: {
    token: string;
    expiresIn: number;
  };

  constructor(init?: Partial<UserResponseDto>) {
    Object.assign(this, init);
  }
}
