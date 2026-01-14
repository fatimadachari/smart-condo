export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  condominioId?: string;
  unidadeId?: string;
};

export type AuthPayload = {
  accessToken: string; 
  user: User;
};

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export type LoginCredentials = {
  email: string;
  senha: string;
};