export interface ResponseDTO<T> {
  data: T;
  time: string;
}

export interface AuthRequestDTO {
  username: string;
  password: string;
}

export interface UserRegistrationRequest {
  // Adicione os campos necessários baseado no DTO do backend
  username: string;
  password: string;
  email?: string;
  // Adicione outros campos conforme necessário
}

export interface LoginResponse {
  token: string;
  // Adicione outros campos que o backend retorna no login
  user?: {
    id: string;
    username: string;
    email?: string;
  };
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  birthDate?: string; // formato: YYYY-MM-DD
  photo?: string;
}

export interface Profile {
  id: string;
  name?: string;
  phone?: string;
  birthDate?: string;
  photo?: string;
  // Adicione outros campos conforme a entidade Profile do backend
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
