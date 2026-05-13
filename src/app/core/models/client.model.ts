import {ProjectSummaryResponse} from './project.model';

export interface ClientDetailResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  projects: ProjectSummaryResponse[];
}

export interface ClientSummaryResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ClientRequest {
  name: string;
  email: string;
  phone: string;
}
