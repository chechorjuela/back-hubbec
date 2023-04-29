export class UserResponseDto {
  public id: string;
  public firstname: string;
  public lastname: string;
  public email: string;

  public birthdate: Date;
  public create_at: Date;
  public update_at: Date;
  public token: {
    token: string;
    expiresIn: number;
  };

  constructor(init?: Partial<UserResponseDto>) {
    Object.assign(this, init);
  }
}
