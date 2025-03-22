import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}

  /**
   * Initiates a process for the given user and returns an object containing the user's data
   * along with an empty `enums` array.
   *
   * @param user - The user object containing relevant data.
   * @returns An object that merges the user's data with an empty `enums` array.
   */
  kickoff(user: any) {
    return {
      ...user,
      enums: [],
    };
  }
}
