import { Observable } from 'rxjs';
import {
  GetFeaturesByApplicationRequest,
  GetFeaturesByApplicationResponse,
  UserIdentity,
  UserContext,
} from 'src/types/pompeii';

/**
 * Interface representing the Pompeii service.
 * Provides methods for interacting with application features and user authentication.
 */
export interface PompeiiService {
  /**
   * Retrieves features associated with a specific application.
   *
   * @param data - The request data containing application details.
   * @returns An observable emitting the response with the application's features.
   */
  getFeaturesByApplication(
    data: GetFeaturesByApplicationRequest,
  ): Observable<GetFeaturesByApplicationResponse>;

  /**
   * Authenticates a user and retrieves their context.
   *
   * @param data - The user identity information required for login.
   * @returns An observable emitting the authenticated user's context.
   */
  login(data: UserIdentity): Observable<UserContext>;
}
