import { Cluster } from 'src/models/cluster.model';
import { Heartbeat } from 'src/models/heartbeat.model';
import { Pulse } from 'src/models/pulse.model';

export interface StabilityData {
  url?: string;
  cluster?: string;
  slug: string;
  name?: string;
  variation: number;
  average: number;
  grades: number[];
}

export interface StabilityObject {
  desktop: StabilityData[];
  mobile: StabilityData[];
}

export interface PlatformDifference {
  url?: string;
  name?: string;
  cluster?: string;
  slug: string;
  desktopAverage: number;
  mobileAverage: number;
  difference: number;
  desktopVariation: number;
  mobileVariation: number;
}
/**
 * Calculates the average performance score from a collection of pulses.
 *
 * @param pulses - An array of `Pulse` objects, each containing heartbeats and their associated grades.
 * @returns The average performance score rounded to the nearest integer. Returns 0 if the input array is empty.
 */
const getAveragePerformance = (pulses: Pulse[]) => {
  if (!pulses.length) {
    return 0;
  }

  const grades = pulses
    .flatMap((pulse) => pulse.heartbeats)
    .flatMap((heartbeat) => heartbeat.grades)
    .flatMap(({ performance }) => [performance]);

  return Math.round(
    grades.reduce((prev, current) => prev + current, 0) / grades.length,
  );
};

/**
 * Retrieves the count of unique URLs monitored from a list of pulses.
 *
 * @param pulses - An array of `Pulse` objects containing URL information.
 * @returns The number of unique URLs found in the provided pulses.
 */
const getUrlsMonitored = (pulses: Pulse[]) => {
  const urls: Set<string> = new Set();

  for (const pulse of pulses) {
    if (!urls.has(pulse.url!.url)) {
      urls.add(pulse.url!.url);
    }
  }

  return urls.size;
};

/**
 * Computes the stability data for a set of pulses based on their performance grades.
 *
 * @param pulses - An array of `Pulse` objects containing URL and heartbeat data.
 * @param type - The platform type to filter heartbeats by, either 'desktop' or 'mobile'.
 * @returns An array of `StabilityData` objects, each containing the URL, slug, variation,
 *          average performance grade, and the list of grades for that URL.
 *
 * The function performs the following steps:
 * 1. Collects metadata from the provided pulses, including URLs, slugs, and performance grades
 *    filtered by the specified platform type.
 * 2. Calculates the variation (difference between the maximum and minimum grades) and the average
 *    performance grade for each URL.
 * 3. Returns the computed stability data for each URL.
 */
const getGradeStability = (
  pulses: Pulse[],
  type: 'desktop' | 'mobile',
): StabilityData[] => {
  const urlGradesMap: Record<string, number[]> = {};
  const urlSlugsMap: Record<string, string> = {};

  /**
   * Collect metadata from pulse, heartbeats and url
   */
  pulses.forEach((pulse) => {
    const url = pulse.url!.url;

    if (!urlSlugsMap[url]) {
      urlSlugsMap[url] = pulse.url!.slug;
    }

    if (!urlGradesMap[url]) {
      urlGradesMap[url] = [];
    }

    pulse.heartbeats
      .filter((heartbeat) => heartbeat.platform?.type == type)
      .forEach((heartbeat) => {
        const performance = heartbeat.grades.performance;
        urlGradesMap[url].push(performance);
      });
  });

  /**
   * Calculate variations and other datapoints
   */
  const urlVariations: StabilityData[] = Object.entries(urlGradesMap).map(
    ([url, grades]) => {
      const slug = urlSlugsMap[url] || '';

      /**
       * Calculate Variation
       */
      const variation = !grades.length
        ? Infinity
        : Math.max(...grades) - Math.min(...grades);

      /**
       * Calculate Average
       */
      const average = !grades.length
        ? 0
        : Math.round(
            grades.reduce((prev, current) => prev + current, 0) / grades.length,
          );

      return { url, slug, variation, average, grades };
    },
  );

  return urlVariations;
};

/**
 * Computes the stability data for a set of clusters based on their performance grades.
 *
 * @param clusters - An array of clusters, each containing metadata such as name, slug, and URLs.
 * @param type - The platform type to filter heartbeats by, either 'desktop' or 'mobile'.
 * @returns An array of stability data objects, each containing the cluster's name, slug,
 *          variation in performance grades, average performance grade, and the list of grades.
 *
 * The function performs the following steps:
 * 1. Collects metadata from the provided clusters, including performance grades from heartbeats
 *    filtered by the specified platform type.
 * 2. Calculates the variation (difference between the maximum and minimum grades) and the average
 *    performance grade for each cluster.
 * 3. Returns an array of stability data objects containing the computed metrics and associated metadata.
 *
 * StabilityData includes:
 * - `name`: The name of the cluster.
 * - `slug`: The unique identifier for the cluster.
 * - `variation`: The difference between the highest and lowest performance grades.
 * - `average`: The average of all performance grades, rounded to the nearest integer.
 * - `grades`: The list of performance grades for the cluster.
 */
const getClusterStability = (
  clusters: Cluster[],
  type: 'desktop' | 'mobile',
): StabilityData[] => {
  const gradesMap: Record<string, number[]> = {};
  const namesMap: Record<string, string> = {};

  /**
   * Collect metadata from pulse, heartbeats and url
   */
  clusters.forEach(({ name, slug, urls }) => {
    if (!namesMap[slug]) {
      namesMap[slug] = name;
    }
    if (!gradesMap[slug]) {
      gradesMap[slug] = [];
    }

    urls
      .flatMap((url) => url.pulses)
      .flatMap((pulse) => pulse.heartbeats)
      .filter((heartbeat) => heartbeat.platform?.type == type)
      .sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime())
      .forEach((heartbeat) => {
        const performance = heartbeat.grades.performance;
        gradesMap[slug].push(performance);
      });
  });

  /**
   * Calculate variations and other datapoints
   */
  const variations: StabilityData[] = Object.entries(gradesMap)
    .map(([slug, grades]) => {
      const name = namesMap[slug] || '';

      /**
       * Calculate Variation
       */
      const variation = !grades.length
        ? Infinity
        : Math.max(...grades) - Math.min(...grades);

      /**
       * Calculate Average
       */
      const average = !grades.length
        ? 0
        : Math.round(
            grades.reduce((prev, current) => prev + current, 0) / grades.length,
          );

      return { name, slug, variation, average, grades };
    })
    .filter((item) => item.grades.length);

  return variations;
};

/**
 * Compares the stability data between desktop and mobile platforms and identifies the differences.
 *
 * @param stability - An object containing stability data for both desktop and mobile platforms.
 * @returns An array of `PlatformDifference` objects, each representing the difference in stability metrics
 *          for a specific URL between desktop and mobile platforms, sorted by the difference in ascending order.
 *
 * The function performs the following steps:
 * - Maps the stability data for desktop and mobile platforms by URL.
 * - Iterates through the desktop data and checks for matching URLs in the mobile data.
 * - Calculates the absolute difference in the average stability metric for each matching URL.
 * - Constructs a `PlatformDifference` object for each matching URL, including additional stability metrics.
 * - Sorts the resulting differences by the calculated difference in ascending order.
 */
const getPlatformDifferences = (
  stability: StabilityObject,
): PlatformDifference[] => {
  const desktopMap = new Map<string, StabilityData>();
  const mobileMap = new Map<string, StabilityData>();

  stability.desktop.forEach((item) => {
    const key = item.url || item.slug;
    desktopMap.set(key, item);
  });
  stability.mobile.forEach((item) => {
    const key = item.url || item.slug;
    mobileMap.set(key, item);
  });

  const differences: PlatformDifference[] = [];

  desktopMap.forEach((desktopItem, key) => {
    if (mobileMap.has(key)) {
      const mobileItem = mobileMap.get(key)!;
      const diff = Math.abs(desktopItem.average - mobileItem.average);
      differences.push({
        url: desktopItem.url,
        name: desktopItem.name,
        slug: desktopItem.slug,
        desktopAverage: desktopItem.average,
        mobileAverage: mobileItem.average,
        difference: diff,
        desktopVariation: desktopItem.variation,
        mobileVariation: mobileItem.variation,
      });
    }
  });

  differences.sort((a, b) => a.difference - b.difference);
  return differences;
};

/**
 * Extracts and formats time-related information from a Heartbeat object.
 *
 * @param item - The Heartbeat object containing the `updatedAt` timestamp and `grades.performance` data.
 * @returns An object containing:
 *   - `date`: The formatted date string in the format `YYYY-MM-DD`.
 *   - `hour`: The formatted time string in the format `HH:mm`.
 *   - `timeDecimal`: The time represented as a decimal value (hours + minutes/60).
 *   - `performance`: The performance grade from the Heartbeat object.
 */
const extractTimeOfDay = (item: Heartbeat) => {
  const hours = item.updatedAt.getHours();
  const minutes = item.updatedAt.getMinutes();
  const timeDecimal = hours + minutes / 60;

  const year = item.updatedAt.getFullYear();
  const month = (item.updatedAt.getMonth() + 1).toString().padStart(2, '0');
  const day = item.updatedAt.getDate().toString().padStart(2, '0');
  const date = `${year}-${month}-${day}`;
  return {
    slug: item.slug,
    date,
    hour: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
    timeDecimal,
    performance: item.grades.performance,
  };
};

/**
 * Analyzes the performance of heartbeats based on the time of day, categorized by platform type.
 *
 * @param pulses - An array of `Pulse` objects, each containing heartbeats and their associated data.
 * @returns An object containing two arrays:
 *          - `mobile`: Time of day data extracted from heartbeats on mobile platforms.
 *          - `desktop`: Time of day data extracted from heartbeats on desktop platforms.
 */
const getTimeOfDayPerformance = (heartbeats: Heartbeat[]) => {
  const mobile = heartbeats
    .filter((heartbeat) => heartbeat.platform?.type == 'mobile')
    .map(extractTimeOfDay);

  const desktop = heartbeats
    .filter((heartbeat) => heartbeat.platform?.type == 'desktop')
    .map(extractTimeOfDay);

  return { mobile, desktop };
};

const categories = [
  'performance',
  'accessibility',
  'best_practices',
  'seo',

  /**
   * We're not collecting these metrics. Yet.
   */
  // 'security',
  // 'aesthetics',
];

/**
 * Computes the grades distribution for mobile and desktop platforms based on the provided pulses.
 *
 * @param pulses - An array of `Pulse` objects, where each pulse contains heartbeats with grades and platform information.
 * @returns An object containing the grades distribution for both mobile and desktop platforms.
 *          The result is formatted as:
 *          {
 *            desktop: Array<{ metric: string, value: number }>,
 *            mobile: Array<{ metric: string, value: number }>
 *          }
 *          Each entry in the `desktop` and `mobile` arrays represents a category (metric) and its average grade value.
 *
 * @remarks
 * - Grades are grouped by platform type (`mobile` or `desktop`) and category.
 * - The average grade for each category is calculated and rounded to the nearest integer.
 * - If no grades are available for a category, the average is set to `0`.
 */
const getGradesDistribution = (heartbeats: Heartbeat[]) => {
  /**
   * Collect metrics p/category for mobile.
   */
  const mobile = heartbeats
    .filter((heartbeat) => heartbeat.platform?.type === 'mobile')
    .map((heartbeat) => heartbeat.grades)
    .reduce(
      (prev, current) => {
        for (const category of categories) {
          if (!prev[category]) {
            prev[category] = [];
          }
          prev[category].push(current[category]);
        }
        return prev;
      },
      {} as Record<string, number[]>,
    );

  /**
   * Collect metrics p/category for desktop.
   */
  const desktop = heartbeats
    .filter((heartbeat) => heartbeat.platform?.type === 'desktop')
    .map((heartbeat) => heartbeat.grades)
    .reduce(
      (prev, current) => {
        for (const category of categories) {
          if (!prev[category]) {
            prev[category] = [];
          }
          prev[category].push(current[category]);
        }
        return prev;
      },
      {} as Record<string, number[]>,
    );

  /**
   * Calculate their averages
   */
  const mobileAverages: Record<string, number> = {};
  const desktopAverages: Record<string, number> = {};
  categories.forEach((category) => {
    mobileAverages[category] = Math.round(
      (mobile[category] || []).reduce((a, b) => a + b, 0) /
        (mobile[category].length || 1),
    );
    desktopAverages[category] = Math.round(
      (desktop[category] || []).reduce((a, b) => a + b, 0) /
        (desktop[category].length || 1),
    );
  });

  /**
   * Final Formatting
   */
  const gradesData = {
    desktop: categories.map((category) => ({
      metric: category,
      value: desktopAverages[category] || 0,
    })),
    mobile: categories.map((category) => ({
      metric: category,
      value: mobileAverages[category] || 0,
    })),
  };

  return gradesData;
};

/**
 * Transforms a `Heartbeat` object containing Core Web Vitals (CWV) data into a history object.
 *
 * @param {Heartbeat} param0 - An object containing the `cwv` property with Core Web Vitals data.
 * @returns {Object} A history object containing the following properties:
 * - `date` (Date): The last updated timestamp of the CWV data.
 * - `ttfb` (number): Time to First Byte.
 * - `fcp` (number): First Contentful Paint.
 * - `dcl` (number): DOM Content Loaded.
 * - `lcp` (number): Largest Contentful Paint.
 * - `tti` (number): Time to Interactive.
 * - `si` (number): Speed Index.
 * - `cls` (number): Cumulative Layout Shift.
 * - `tbt` (number): Total Blocking Time.
 */
const cwvToHistory = ({ cwv }: Heartbeat) => {
  return {
    date: cwv.updatedAt,
    ttfb: cwv.ttfb,
    fcp: cwv.fcp,
    dcl: cwv.dcl,
    lcp: cwv.lcp,
    tti: cwv.tti,
    si: cwv.si,
    cls: cwv.cls,
    tbt: cwv.tbt,
  };
};

/**
 * Processes an array of heartbeats and categorizes them into desktop and mobile histories.
 *
 * @param heartbeats - An array of `Heartbeat` objects to be processed.
 * @returns An object containing two arrays:
 * - `desktop`: An array of processed desktop heartbeats.
 * - `mobile`: An array of processed mobile heartbeats.
 */
const getHistory = (heartbeats: Heartbeat[]) => {
  return {
    desktop: heartbeats
      .filter((heartbeat) => heartbeat.platform?.type === 'desktop')
      .map(cwvToHistory),
    mobile: heartbeats
      .filter((heartbeat) => heartbeat.platform?.type === 'mobile')
      .map(cwvToHistory),
  };
};

/**
 * Filters the `mobile` and `desktop` arrays in a `StabilityObject` to remove items
 * with a number of grades below a calculated minimum threshold.
 *
 * The minimum threshold is determined as half of the median value of the grades' lengths
 * for each respective array (`mobile` and `desktop`).
 *
 * This function ensures that only URLs with a sufficient number of datapoints are considered
 * for stability statistics, avoiding skewed rankings due to insufficient data.
 *
 * You must be "this" tall to ride this ride.
 *
 * @param stability - The `StabilityObject` containing `mobile` and `desktop` arrays to be filtered.
 * @returns The updated `StabilityObject` with filtered `mobile` and `desktop` arrays.
 */
const minDatapointsFilter = (stability: StabilityObject) => {
  const mobileCount = stability.mobile.map((item) => item.grades.length);
  mobileCount.sort((a, b) => Number(a) - Number(b));
  const minMobile = mobileCount[Math.round(mobileCount.length / 2)] / 2;

  if (!isNaN(minMobile)) {
    stability.mobile = stability.mobile.filter(
      (item) => item.grades.length >= minMobile,
    );
  }

  const desktopCount = stability.desktop.map((item) => item.grades.length);
  desktopCount.sort((a, b) => Number(a) - Number(b));
  const minDesktop = desktopCount[Math.round(desktopCount.length / 2)] / 2;

  if (!isNaN(minDesktop)) {
    stability.desktop = stability.desktop.filter(
      (item) => item.grades.length >= minDesktop,
    );
  }
  return stability;
};

export {
  getAveragePerformance,
  getClusterStability,
  getGradesDistribution,
  getGradeStability,
  getHistory,
  getPlatformDifferences,
  getTimeOfDayPerformance,
  getUrlsMonitored,
  minDatapointsFilter,
};
