import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginationModel } from '../../core/models/pagination.model';
import {ProjectDetailResponse, ProjectRequest} from '../../core/models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  findAllProjects(pageNumber: number, pageSize: number): Observable<PaginationModel> {
    return this.http.get<PaginationModel>(`${this.API_URL}/projects?page=${pageNumber}&size=${pageSize}`);
  }

  create(project: ProjectRequest): Observable<ProjectDetailResponse> {
    return this.http.post<ProjectDetailResponse>(`${this.API_URL}/projects`, project);
  }
}
