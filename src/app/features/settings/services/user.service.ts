import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {
  User,
  UserUpdateEmailRequest,
  UserUpdatePasswordRequest,
  UserUpdateRequest
} from '../../../core/models/user.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  find(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/user`);
  }

  update(request: UserUpdateRequest): Observable<User> {
    return this.http.patch<User>(`${this.API_URL}/user/update`, request);
  }

  changeEmail(request: UserUpdateEmailRequest): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/user/change-email`, request);
  }

  changePassword(request: UserUpdatePasswordRequest): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/user/change-password`, request);
  }
}
