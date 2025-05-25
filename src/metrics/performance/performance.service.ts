import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Performance } from 'src/models/performance.model';
import { PlatformService } from 'src/scans/platform/platform.service';
import { ProviderService } from 'src/scans/provider/provider.service';
import { UrlsService } from 'src/targets/urls/urls.service';
import {
  getGradeStability,
  minDatapointsFilter,
  getPlatformDifferences,
  getTimeOfDayPerformance,
  getHistory,
  calculatePercentileStats,
} from 'src/utils/stats';

// Reusable type for CWV stats summary
export type CwvStatsSummary = {
  min: number;
  p50: number;
  avg: number;
  p75: number;
  p90: number;
  p99: number;
  max: number;
};

@Injectable()
export class PerformanceService {
  constructor(
    @InjectModel(Performance)
    private readonly performanceModel: typeof Performance,
    private readonly platformsService: PlatformService,
    private readonly providerService: ProviderService,
    private readonly urlsService: UrlsService,
  ) {}

  async list(
    page: number,
    pageSize: number,
    sort: string,
    order: 'asc' | 'desc',
  ): Promise<{ count: number; rows: any[] }> {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    return this.performanceModel.findAndCountAll({
      include: [],
      distinct: true,
      offset,
      limit,
      order: sort ? [[sort, order]] : undefined,
    });
  }

  /**
   * Creates a new performance record with raw metrics.
   *
   * @param url_slug - The slug of the URL to associate with the performance record
   * @param platform_slug - The slug of the platform (mobile/desktop)
   * @param provider_slug - The slug of the provider
   * @param createdAt - Optional timestamp for when metrics were recorded (defaults to now)
   * @param metrics - Raw performance metrics object containing Core Web Vitals
   * @returns A promise that resolves to the created performance record
   */
  async createPerformanceRecord(
    url_slug: string,
    platform_slug: string,
    provider_slug: string,
    createdAt: Date = new Date(),
    metrics: {
      ttfb?: number;
      fcp?: number;
      dcl?: number;
      lcp?: number;
      tti?: number;
      si?: number;
      cls?: string;
      tbt?: number;
    },
  ): Promise<Performance> {
    // Resolve slugs to IDs
    const url = await this.urlsService.get(url_slug);
    if (!url) {
      throw new Error(`URL with slug ${url_slug} not found`);
    }

    const platform = await this.platformsService.getBySlug(platform_slug);
    if (!platform) {
      throw new Error(`Platform with slug ${platform_slug} not found`);
    }

    const provider = await this.providerService.getBySlug(provider_slug);
    if (!provider) {
      throw new Error(`Provider with slug ${provider_slug} not found`);
    }

    // Create performance record and return it
    const performance = await this.performanceModel.create({
      url_id: url.id,
      platforms_id: platform.id,
      provider_id: provider.id,
      createdAt,
      ttfb: metrics.ttfb || 0,
      fcp: metrics.fcp || 0,
      dcl: metrics.dcl || 0,
      lcp: metrics.lcp || 0,
      tti: metrics.tti || 0,
      si: metrics.si || 0,
      cls: metrics.cls || '0.00',
      tbt: metrics.tbt || 0,
    });

    return performance;
  }

  /**
   * Gets performance data points for a specific URL within a date range.
   * If url_id is undefined, gets data points across all URLs.
   *
   * @param url_id - The ID of the URL to get performance data for, or undefined for all URLs
   * @param from - Start date for the query
   * @param to - End date for the query
   * @returns Array of objects containing createdAt, platform_slug, provider_slug and all raw metric fields
   */
  async getDataPoints(
    url_id: number | undefined,
    from: Date,
    to: Date,
  ): Promise<
    Array<{
      createdAt: Date;
      platform_slug: string;
      provider_slug: string;
      ttfb: number;
      fcp: number;
      dcl: number;
      lcp: number;
      tti: number;
      si: number;
      cls: string;
      tbt: number;
    }>
  > {
    const whereClause: any = {
      createdAt: {
        [Op.between]: [from, to],
      },
    };

    // Only add url_id filter if it's provided
    if (url_id !== undefined) {
      whereClause.url_id = url_id;
    }

    const performances = await this.performanceModel.findAll({
      where: whereClause,
      order: [['createdAt', 'ASC']],
      include: [
        {
          association: 'platform',
          attributes: ['slug'],
        },
        {
          association: 'provider',
          attributes: ['slug'],
        },
      ],
    });

    return performances.map((performance) => ({
      createdAt: performance.createdAt,
      platform_slug: performance.platform?.slug || '',
      provider_slug: performance.provider?.slug || '',
      ttfb: performance.ttfb,
      fcp: performance.fcp,
      dcl: performance.dcl,
      lcp: performance.lcp,
      tti: performance.tti,
      si: performance.si,
      cls: performance.cls,
      tbt: performance.tbt,
    }));
  }

  /**
   * Gets performance statistics for a specific URL within a date range.
   * Optionally filters by platform and/or provider.
   * If urlId is undefined, gets stats across all URLs.
   *
   * @param urlId - The ID of the URL to get performance statistics for, or undefined for all URLs
   * @param from - Start date for the query
   * @param to - End date for the query
   * @param platformSlug - Optional platform slug to filter by
   * @param providerSlug - Optional provider slug to filter by
   * @returns Performance statistics object with percentile metrics
   */
  async getStats(
    urlId: number | undefined,
    from: Date,
    to: Date,
    platformSlug?: string,
    providerSlug?: string,
  ): Promise<{
    stats: Record<
      'ttfb' | 'fcp' | 'dcl' | 'lcp' | 'tti' | 'si' | 'cls' | 'tbt',
      CwvStatsSummary
    >;
    count: number;
    urlCount?: number;
    latestTimestamp: Date | null;
    stability: any;
    timeOfDay: any;
    history: any;
  }> {
    // Build Sequelize where object
    const whereClause: any = {
      createdAt: {
        [Op.between]: [from, to],
      },
    };

    // Add optional URL filter
    if (urlId !== undefined) {
      whereClause.url_id = urlId;
    }

    // Resolve platform slug to ID if provided
    if (platformSlug) {
      const platform = await this.platformsService.getBySlug(platformSlug);
      if (!platform) {
        throw new Error(`Platform with slug ${platformSlug} not found`);
      }
      whereClause.platforms_id = platform.id;
    }

    // Resolve provider slug to ID if provided
    if (providerSlug) {
      const provider = await this.providerService.getBySlug(providerSlug);
      if (!provider) {
        throw new Error(`Provider with slug ${providerSlug} not found`);
      }
      whereClause.provider_id = provider.id;
    }

    // Query performance records
    const rows = await this.performanceModel.findAll({
      where: whereClause,
      include: [
        { association: 'platform' },
        { association: 'url', attributes: ['id', 'slug', 'url'] },
      ],
    });

    // Compute and return statistics
    const statsResult = this.computeStatsOverRows(rows);

    // Find the latest timestamp in the sample
    let latestTimestamp: Date | null = null;
    if (rows.length > 0) {
      latestTimestamp = rows.reduce(
        (latest, row) => {
          return !latest || row.createdAt > latest ? row.createdAt : latest;
        },
        null as Date | null,
      );
    }

    let stability = {
      desktop: getGradeStability(rows, 'desktop'),
      mobile: getGradeStability(rows, 'mobile'),
    };
    if (urlId === undefined) {
      stability = minDatapointsFilter(stability);
    }
    stability.desktop.sort((a, b) => a.variation - b.variation);
    stability.mobile.sort((a, b) => a.variation - b.variation);
    const differences = getPlatformDifferences(stability);
    const timeOfDay = getTimeOfDayPerformance(rows);
    const history = getHistory(rows);

    if (urlId === undefined) {
      const urlSet = new Set<number>();
      for (const row of rows) {
        urlSet.add(row.url_id);
      }
      return {
        ...statsResult,
        urlCount: urlSet.size,
        latestTimestamp,
        stability: {
          mobile: stability.mobile.slice(0, 3),
          desktop: stability.desktop.slice(0, 3),
          differences: differences.slice(0, 3),
        },
        timeOfDay,
        history,
      };
    }
    return {
      ...statsResult,
      latestTimestamp,
      stability: {
        mobile: stability.mobile.slice(0, 3),
        desktop: stability.desktop.slice(0, 3),
        differences: differences.slice(0, 3),
      },
      timeOfDay,
      history,
    };
  }

  /**
   * Helper method to compute statistics over an array of performance rows.
   *
   * @param rows - Array of Performance model instances
   * @returns Performance statistics object with percentile metrics
   */
  private computeStatsOverRows(rows: Performance[]): {
    stats: Record<
      'ttfb' | 'fcp' | 'dcl' | 'lcp' | 'tti' | 'si' | 'cls' | 'tbt',
      CwvStatsSummary
    >;
    count: number;
  } {
    if (rows.length === 0) {
      const emptyStats = {
        min: 0,
        p50: 0,
        avg: 0,
        p75: 0,
        p90: 0,
        p99: 0,
        max: 0,
      };
      return {
        stats: {
          ttfb: emptyStats,
          fcp: emptyStats,
          dcl: emptyStats,
          lcp: emptyStats,
          tti: emptyStats,
          si: emptyStats,
          cls: emptyStats,
          tbt: emptyStats,
        },
        count: 0,
      };
    }
    const ttfbValues = rows.map((row) => row.ttfb);
    const fcpValues = rows.map((row) => row.fcp);
    const dclValues = rows.map((row) => row.dcl);
    const lcpValues = rows.map((row) => row.lcp);
    const ttiValues = rows.map((row) => row.tti);
    const siValues = rows.map((row) => row.si);
    const clsValues = rows.map((row) => parseFloat(row.cls));
    const tbtValues = rows.map((row) => row.tbt);
    return {
      stats: {
        ttfb: calculatePercentileStats(ttfbValues),
        fcp: calculatePercentileStats(fcpValues),
        dcl: calculatePercentileStats(dclValues),
        lcp: calculatePercentileStats(lcpValues),
        tti: calculatePercentileStats(ttiValues),
        si: calculatePercentileStats(siValues),
        cls: calculatePercentileStats(clsValues),
        tbt: calculatePercentileStats(tbtValues),
      },
      count: rows.length,
    };
  }
}
