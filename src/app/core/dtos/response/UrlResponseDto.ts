export interface UrlResponseDto {
  urlId: number;
  shortUrl: string;
  longUrl: string;
  urlStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | string;
  visitLimit: number;
  remainingVisits: number;
  totalVisits: number;
  userId: number;
  createdAt: string;
  expiresAt?: string;
  lastAccessedAt?: string;
}
