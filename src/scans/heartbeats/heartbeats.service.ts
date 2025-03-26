import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CwvService } from 'src/metrics/cwv/cwv.service';
import { GradesService } from 'src/metrics/grades/grades.service';
import { Heartbeat } from 'src/models/heartbeat.model';
import { Pulse } from 'src/models/pulse.model';
import { PlatformService } from '../platform/platform.service';
import { ProviderService } from '../provider/provider.service';

@Injectable()
export class HeartbeatsService {
  constructor(
    @InjectModel(Heartbeat) private readonly heartbeatModel: typeof Heartbeat,
    private readonly platformsService: PlatformService,
    private readonly providerService: ProviderService,
    private readonly gradesService: GradesService,
    private readonly cwvService: CwvService,
  ) {}

  async list(
    page: number,
    pageSize: number,
    sort: string,
    order: 'asc' | 'desc',
  ): Promise<{ count: number; rows: any[] }> {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    return this.heartbeatModel.findAndCountAll({
      include: [],
      distinct: true,
      offset,
      limit,
      order: sort ? [[sort, order]] : undefined,
    });
  }

  /**
   * Creates a new heartbeat entry along with its associated metrics.
   *
   * @param pulse - The pulse object containing the pulse ID to associate with the heartbeat.
   * @param data - The data object containing additional information for the heartbeat creation.
   * @param data.userAgent - The user agent string used to identify the platform.
   * @param viewport - The viewport type, either 'mobile' or 'desktop', used to determine platform context.
   * @returns A promise that resolves when the heartbeat and its associated metrics are created.
   *
   * @remarks
   * - The platform is determined based on the user agent string and viewport type.
   * - The provider is currently hardcoded but should be dynamically determined in the future.
   * - The heartbeat is created first as it serves as a foreign key for the associated metrics.
   * - Metrics creation is delegated to the gradesService and cwvService.
   */
  async create(pulse: Pulse, data: any) {
    /**
     * Retrieves the platform information associated with the specified user agent string.
     *
     * @param data.userAgent - The user agent string to identify the platform.
     * @param platform - The platform context to use for the lookup.
     * @returns A promise that resolves to the platform information corresponding to the user agent.
     */
    const platform = await this.platformsService.getByUserAgent(
      data.userAgent,
      data.mode,
    );

    /**
     * Provider.
     * TODO: This should not be hardcoded. It should be determined by the wiphala strategy
     * or the provider itself used. Brainstorming pending.
     *
     * By now, using a placeholder.
     */
    const provider = await this.providerService.getBySlug(
      'ETOZ6MXeewPnrJAv2paRm',
    );

    /**
     * The heartbeat itself. We must create it before metrics as it's FK.
     */
    const heartbeat = await this.heartbeatModel.create({
      pulses_id: pulse.id,
      platforms_id: platform.id,
      provider_id: provider!.id,
    });

    /**
     * Create the child metrics.
     */
    void this.gradesService.create(heartbeat, data);
    void this.cwvService.create(heartbeat, data);
  }
}
