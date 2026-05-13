import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginationModel } from '../../../core/models/pagination.model';
import { ProjectDetailResponse, ProjectCreateRequest, ProjectUpdateRequest } from '../../../core/models/project.model';
import {AnnotationDTO} from '../../../core/models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  API_URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  findAllProjects(pageNumber: number, pageSize: number): Observable<PaginationModel> {
    return this.http.get<PaginationModel>(`${this.API_URL}/projects?page=${pageNumber}&size=${pageSize}`);
  }

  findOne(id: string): Observable<ProjectDetailResponse> {
    return this.http.get<ProjectDetailResponse>(`${this.API_URL}/projects/${id}`);
  }

  create(project: ProjectCreateRequest): Observable<ProjectDetailResponse> {
    return this.http.post<ProjectDetailResponse>(`${this.API_URL}/projects`, project);
  }

  update(id: string, project: ProjectUpdateRequest | null): Observable<ProjectDetailResponse> {
    return this.http.put<ProjectDetailResponse>(`${this.API_URL}/projects/${id}`, project);
  }

  updateAnnotation(id: string, note: AnnotationDTO): Observable<AnnotationDTO> {
    return this.http.put<AnnotationDTO>(`${this.API_URL}/projects/${id}/notes`, note);
  }
}
