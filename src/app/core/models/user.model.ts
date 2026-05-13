import {Occupation} from '../enums/occupation.enum';

export interface User {
  id: string;
  name: string;
  email: string;
  occupation: Occupation;
  hourlyRate: number;
}

export interface UserUpdateRequest {
  name: string;
  occupation: string;
  hourlyRate: number;
}

export interface UserUpdateEmailRequest {
  email: string;
  password: string;
}

export interface UserUpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
