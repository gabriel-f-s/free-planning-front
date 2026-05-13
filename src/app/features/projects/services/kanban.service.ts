import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ProjectBoardResponse } from '../../../core/models/project.model';

@Injectable({
  providedIn: 'root',
})
export class KanbanService {
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  findBoard(id: string): Observable<ProjectBoardResponse> {
    return this.http.get<ProjectBoardResponse>(`${this.API_URL}/projects/${id}/columns`);
  }

  createColumn(id: string, column: KanbanColumnCreateRequest): Observable<KanbanColumnResponse> {
    return this.http.post<KanbanColumnResponse>(`${this.API_URL}/projects/${id}/columns`, column);
  }

  renameColumn(id: string, column: KanbanColumnRenameRequest): Observable<KanbanColumnResponse> {
    return this.http.patch<KanbanColumnResponse>(`${this.API_URL}/columns/${id}/rename`, column);
  }

  moveColumn(
    projectId: string,
    id: string,
    column: KanbanColumnMoveRequest,
  ): Observable<KanbanColumnResponse> {
    return this.http.patch<KanbanColumnResponse>(
      `${this.API_URL}/projects/${projectId}/columns/${id}/move`,
      column,
    );
  }

  deleteColumn(columnId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/columns/${columnId}`);
  }

  createTask(columnId: string, task: KanbanTaskCreateRequest): Observable<KanbanTaskResponse> {
    return this.http.post<KanbanTaskResponse>(`${this.API_URL}/columns/${columnId}/tasks`, task);
  }

  moveTask(taskId: string, request: KanbanTaskMoveRequest): Observable<KanbanTaskResponse> {
    return this.http.patch<KanbanTaskResponse>(`${this.API_URL}/tasks/${taskId}/move`, request);
  }

  updateTask(taskId: string, request: KanbanTaskUpdateRequest): Observable<KanbanTaskResponse> {
    return this.http.patch<KanbanTaskResponse>(`${this.API_URL}/tasks/${taskId}`, request);
  }

  deleteTask(taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/tasks/${taskId}`);
  }
}
