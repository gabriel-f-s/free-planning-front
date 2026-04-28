
export interface ClientDetailResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface ClientSummaryResponse {
  id: number;
  name: string;
}

export interface ClientRequest {
  name: string;
  email: string;
  phone: string;
}
