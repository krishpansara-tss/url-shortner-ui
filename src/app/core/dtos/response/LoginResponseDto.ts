import { UserTypes } from "../../enums/UserTypes";

export interface LoginResponseDto {
  token: string;
  userId: number;
  name: string;
  email: string;
  verified: boolean;
  role: UserTypes;
}