import { UserStatus } from "../enums/UserStatus";
import { UserTypes } from "../enums/UserTypes";

export interface User {
  userId: number;
  name: string;
  email: string;
  profilePicturePath: string | null;
  role: UserTypes;
  status: UserStatus;
  remainingUrlSlots: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}