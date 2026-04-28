import {ClientDetailResponse} from './client.model';

export interface ProjectRequest {
  title: string;
  description: string;
  platform: string;
  type: string;
  minimumValue: number;
  maximumValue: number;
  closedValue: number;
  deliveryForecast: string;
  deliveryDate: string;
  clientId: number;
}

export interface ProjectSummaryResponse {
  id: number;
  title: string;
  description: string;
  platform: string;
  status: string;
  type: string;
  closedValue: number;
  deliveryForecast: string;
  client: string;
}

export interface ProjectDetailResponse {
  id: number;
  title: string;
  description: string;
  platform: string;
  status: string;
  type: string;
  minimumValue: number;
  maximumValue: number;
  closedValue: number;
  deliveryForecast: string;
  deliveryDate: string;
  client: ClientDetailResponse;
}
