import {ProjectPipelineResponse} from './project.model';

export interface DashboardSummary {
  activeProjectsCount: number,
  monthBilling: number,
  deliveriesThisWeek: number
}

export interface DashboardPipeline {
  inProgressProjects: ProjectPipelineResponse[],
  underNegotiationProjects: ProjectPipelineResponse[],
  onHoldProjects: ProjectPipelineResponse[]
}
