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

export {
  getAveragePerformance,
  getGradeStability,
  getPlatformDifferences,
  getUrlsMonitored,
};
