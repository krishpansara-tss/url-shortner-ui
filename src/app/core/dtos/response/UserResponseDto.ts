export interface UserResponseDto {
  userId: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED' | string;
  remainingUrlSlots: number;
  isVerified: boolean;
  profilePicturePath?: string;
  createdAt: string;
  updatedAt?: string;
}
