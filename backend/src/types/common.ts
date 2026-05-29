export interface MapPoint {
  id: string;
  type: "opportunity" | "organization" | "event";
  title: string;
  category: string | null;
  latitude: number;
  longitude: number;
  location: string | null;
  organizationId: string | null;
  organizationName: string | null;
}

export interface SearchResult {
  type: "opportunity" | "organization" | "event";
  id: string;
  title: string;
  description: string;
  category: string | null;
  location: string | null;
}

export interface GlobalSearchResponse {
  query: string;
  results: SearchResult[];
}
