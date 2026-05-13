import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PaginationModel } from '../../../core/models/pagination.model';
import {ClientDetailResponse, ClientRequest} from '../../../core/models/client.model';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {

  API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  findAllClients(pageNumber: number, pageSize: number): Observable<PaginationModel> {
    return this.http.get<PaginationModel>(`${this.API_URL}/clients?page=${pageNumber}&size=${pageSize}`)
  }

  findClientsByName(name: string, pageNumber?: number, pageSize?: number): Observable<PaginationModel> {
    if (pageNumber && pageSize) {
      return this.http.get<PaginationModel>(`${this.API_URL}/clients?name=${name}&page=${pageNumber}&size=${pageSize}`)
    }
    return this.http.get<PaginationModel>(`${this.API_URL}/clients?name=${name}`)
  }

  findOne(id: string): Observable<ClientDetailResponse> {
    return this.http.get<ClientDetailResponse>(`${this.API_URL}/clients/${id}`)
  }

  create(client: ClientRequest): Observable<ClientDetailResponse> {
    return this.http.post<ClientDetailResponse>(`${this.API_URL}/clients`, client)
  }

  update(id: string, client: ClientRequest): Observable<ClientDetailResponse> {
    return this.http.put<ClientDetailResponse>(`${this.API_URL}/clients/${id}`, client)
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/clients/${id}`)
  }
}
