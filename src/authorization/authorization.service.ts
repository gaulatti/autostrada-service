import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  GetFeaturesByApplicationResponse,
  UserContext,
  UserIdentity,
} from 'src/types/pompeii';
import { PompeiiService } from '../interfaces/pompeii.interface';

/**
 * The `AuthorizationService` is responsible for handling authorization-related operations
 * by interacting with the Pompeii service. It provides methods to retrieve application
 * features and authenticate users.
 *
 * This service implements the `OnModuleInit` lifecycle hook to initialize the Pompeii service
 * client upon module initialization.
 *
 * Methods:
 * - `onModuleInit`: Initializes the Pompeii service client.
 * - `getFeatures`: Retrieves the features associated with the current application.
 * - `login`: Authenticates a user by sending their identity payload to the Pompeii service.
 *
 * Dependencies:
 * - `ClientGrpc`: Injected gRPC client used to communicate with the Pompeii service.
 *
 * Environment Variables:
 * - `POMPEII_KEY`: Used to identify the application when interacting with the Pompeii service.
 */
@Injectable()
export class AuthorizationService implements OnModuleInit {
  private pompeiiService: PompeiiService;

  constructor(@Inject('pompeii') private readonly client: ClientGrpc) {}

  /**
   * Lifecycle hook that is called when the module is initialized.
   * This method retrieves and assigns the PompeiiService instance
   * from the client to the `pompeiiService` property.
   */
  onModuleInit() {
    this.pompeiiService =
      this.client.getService<PompeiiService>('PompeiiService');
  }

  /**
   * Retrieves the features associated with the current application by making a request
   * to the Pompeii service. The application is identified using the `POMPEII_KEY` environment variable.
   *
   * @returns A promise that resolves to a `GetFeaturesByApplicationResponse` containing
   *          the features of the application.
   *
   * @throws Will propagate any errors encountered during the request to the Pompeii service.
   */
  async getFeatures(): Promise<GetFeaturesByApplicationResponse> {
    return firstValueFrom(
      this.pompeiiService.getFeaturesByApplication({
        slug: process.env.POMPEII_KEY!,
      }),
    );
  }

  /**
   * Authenticates a user by sending their identity payload to the Pompeii service.
   *
   * @param payload - The user's identity information required for authentication.
   * @returns A promise that resolves to the user's context upon successful login.
   *
   * @throws An error if the login request fails or the Pompeii service is unreachable.
   */
  async login(payload: UserIdentity): Promise<UserContext> {
    return firstValueFrom(
      this.pompeiiService.login({
        ...payload,
        key: process.env.POMPEII_KEY!,
      }),
    );
  }
}
