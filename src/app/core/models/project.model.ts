import {ClientDetailResponse} from './client.model';

export interface ProjectCreateRequest {
  title: string;
  description: string;
  platform: string;
  type: string;
  minimumValue: number;
  maximumValue: number;
  closedValue: number;
  deliveryForecast: string;
  deliveryDate: string;
  isPersonalProject: boolean;
  clientId: number;
}

export interface ProjectUpdateRequest {
  title: string;
  description: string;
  platform: string | null;
  status: string;
  type: string;
  minimumValue: number;
  maximumValue: number;
  closedValue: number;
  deliveryForecast: string;
  deliveryDate: string;
  annotation: string;
  isPersonalProject: boolean;
  clientId: string;
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
  isPersonalProject: boolean;
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
  annotation: string;
  isPersonalProject: boolean;
  client: ClientDetailResponse;
}

export interface ProjectPipelineResponse {
  id: string,
  title: string,
  closedValue: number,
  deliveryDate: string,
  isPersonalProject: boolean
}

export interface ProjectBoardResponse {
  columns: KanbanColumnResponse[]
}
