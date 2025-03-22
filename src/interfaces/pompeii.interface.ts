import { Observable } from 'rxjs';

export type GetFeaturesByApplicationRequest = {
  slug: string;
};

export type GetFeaturesByApplicationResponse = {
  features: { name: string; slug: string; default_value: string }[];
};

export interface PompeiiService {
  getFeaturesByApplication(
    data: GetFeaturesByApplicationRequest,
  ): Observable<GetFeaturesByApplicationResponse>;
}
