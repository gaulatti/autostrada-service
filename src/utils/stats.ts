import { Heartbeat } from 'src/models/heartbeat.model';
import { Pulse } from 'src/models/pulse.model';

export interface StabilityData {
  url: string;
  slug: string;
  variation: number;
  average: number;
  grades: number[];
}

export interface StabilityObject {
  desktop: StabilityData[];
  mobile: StabilityData[];
}

export interface PlatformDifference {
  url: string;
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
    desktopMap.set(item.url, item);
  });
  stability.mobile.forEach((item) => {
    mobileMap.set(item.url, item);
  });

  const differences: PlatformDifference[] = [];

  desktopMap.forEach((desktopItem, url) => {
    if (mobileMap.has(url)) {
      const mobileItem = mobileMap.get(url)!;
      const diff = Math.abs(desktopItem.average - mobileItem.average);
      differences.push({
        url,
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
const getTimeOfDayPerformance = (pulses: Pulse[]) => {
  const heartbeats = pulses.flatMap((pulse) => pulse.heartbeats);

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
const getGradesDistribution = (pulses: Pulse[]) => {
  const heartbeats = pulses.flatMap((pulse) => pulse.heartbeats);

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

export {
  getAveragePerformance,
  getGradesDistribution,
  getGradeStability,
  getPlatformDifferences,
  getTimeOfDayPerformance,
  getUrlsMonitored,
};
