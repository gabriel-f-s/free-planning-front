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
  id: string;
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
  id: string;
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

export interface ProjectPipelineResponse {
  id: string,
  title: string,
  platform: string
  type: string,
  closedValue: number,
  deliveryDate: string,
  client: string
}
