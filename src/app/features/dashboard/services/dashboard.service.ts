import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DashboardNotes, DashboardPipeline, DashboardSummary} from '../../../core/models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  API_URL: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  findSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.API_URL}/dashboard/summary`);
  }

  findPipeline(): Observable<DashboardPipeline> {
    return this.http.get<DashboardPipeline>(`${this.API_URL}/dashboard/pipeline`);
  }

  findAnnotation(): Observable<DashboardNotes> {
    return this.http.get<DashboardNotes>(`${this.API_URL}/dashboard/notes`);
  }

  updateAnnotation(annotation: DashboardNotes): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/dashboard/notes`, annotation);
  }

  findUserHourlyRate(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/dashboard/hourly-rate`);
  }
}
