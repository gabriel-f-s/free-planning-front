import {User} from './user.model';
import {Occupation} from '../enums/occupation.enum';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  occupation: Occupation;
}

export interface AuthResponse {
  token: string;
  user: User;
}
