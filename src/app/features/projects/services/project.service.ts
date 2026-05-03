import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginationModel } from '../../../core/models/pagination.model';
import {ProjectDetailResponse, ProjectRequest} from '../../../core/models/project.model';
import {Status} from '../../../core/enums/status.enum';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  findAllProjectsInProgress(pageNumber: number, pageSize: number): Observable<PaginationModel> {
    return this.http.get<PaginationModel>(`${this.API_URL}/projects?page=${pageNumber}&size=${pageSize}&status=${Status.IN_PROGRESS}`);
  }

  findAllProjects(pageNumber: number, pageSize: number): Observable<PaginationModel> {
    return this.http.get<PaginationModel>(`${this.API_URL}/projects?page=${pageNumber}&size=${pageSize}`);
  }

  findOne(id: string): Observable<ProjectDetailResponse> {
    return this.http.get<ProjectDetailResponse>(`${this.API_URL}/projects/${id}`);
  }

  create(project: ProjectRequest): Observable<ProjectDetailResponse> {
    return this.http.post<ProjectDetailResponse>(`${this.API_URL}/projects`, project);
  }

  update(id: string, project: ProjectRequest | null): Observable<ProjectDetailResponse> {
    return this.http.patch<ProjectDetailResponse>(`${this.API_URL}/projects/${id}`, project);
  }
}
