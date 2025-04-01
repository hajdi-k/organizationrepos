import type { User } from 'key/types/github';

interface TokenData {
  id: string;
  user: User;
}

export interface SessionData {
  tokens: TokenData[];
}
