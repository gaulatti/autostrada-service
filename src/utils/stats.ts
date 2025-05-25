import { Performance } from 'src/models/performance.model';

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
 * Calculates the average performance score from a collection of performance records.
 *
 * @param performances - An array of `Performance` objects with Core Web Vitals metrics.
 * @returns The average performance score calculated from the metrics. Returns 0 if the input array is empty.
 */
const getAveragePerformance = (performances: Performance[]) => {
  if (!performances.length) {
    return 0;
  }

  // Calculate performance score from Core Web Vitals metrics
  const performanceScores = performances
    .map((performance) => {
      // Simple scoring based on Core Web Vitals - this can be enhanced
      const lcpScore = performance.lcp
        ? Math.max(0, 100 - performance.lcp / 25)
        : 0;
      const fcpScore = performance.fcp
        ? Math.max(0, 100 - performance.fcp / 18)
        : 0;
      const clsScore = performance.cls
        ? Math.max(0, 100 - parseFloat(performance.cls) * 100)
        : 0;

      return Math.round((lcpScore + fcpScore + clsScore) / 3);
    })
    .filter((score) => score !== null && score !== undefined);

  if (!performanceScores.length) {
    return 0;
  }

  return Math.round(
    performanceScores.reduce((prev, current) => prev + current, 0) /
      performanceScores.length,
  );
};

/**
 * Retrieves the count of unique URLs monitored from a list of performance records.
 *
 * @param performances - An array of `Performance` objects containing URL information.
 * @returns The number of unique URLs found in the provided performance records.
 */
const getUrlsMonitored = (performances: Performance[]) => {
  const urls: Set<number> = new Set();

  for (const performance of performances) {
    if (!urls.has(performance.url_id)) {
      urls.add(performance.url_id);
    }
  }

  return urls.size;
};

/**
 * Computes the stability data for performance records based on their calculated performance scores.
 *
 * @param performances - An array of `Performance` objects with Core Web Vitals metrics.
 * @param type - The platform type to filter performance records by, either 'desktop' or 'mobile'.
 * @returns An array of `StabilityData` objects, each containing the URL, slug, variation,
 *          average performance score, and the list of scores for that URL.
 */
const getGradeStability = (
  performances: Performance[],
  type: 'desktop' | 'mobile',
): StabilityData[] => {
  const urlGradesMap: Record<number, number[]> = {};
  const urlSlugsMap: Record<number, string> = {};

  // Filter performance records by platform type and collect performance data
  const filteredPerformances = performances.filter(
    (performance) => performance.platform?.type === type,
  );

  filteredPerformances.forEach((performance) => {
    const urlId = performance.url_id;

    if (!urlSlugsMap[urlId] && performance.url) {
      urlSlugsMap[urlId] = performance.url.slug;
    }

    if (!urlGradesMap[urlId]) {
      urlGradesMap[urlId] = [];
    }

    // Calculate performance score from Core Web Vitals metrics
    const lcpScore = performance.lcp
      ? Math.max(0, 100 - performance.lcp / 25)
      : 0;
    const fcpScore = performance.fcp
      ? Math.max(0, 100 - performance.fcp / 18)
      : 0;
    const clsScore = performance.cls
      ? Math.max(0, 100 - parseFloat(performance.cls) * 100)
      : 0;
    const performanceScore = Math.round((lcpScore + fcpScore + clsScore) / 3);
    urlGradesMap[urlId].push(performanceScore);
  });

  // Calculate variations and other datapoints
  const urlVariations: StabilityData[] = Object.entries(urlGradesMap).map(
    ([urlId, grades]) => {
      const slug = urlSlugsMap[parseInt(urlId)] || '';

      // Calculate Variation
      const variation = !grades.length
        ? Infinity
        : Math.max(...grades) - Math.min(...grades);

      // Calculate Average
      const average = !grades.length
        ? 0
        : Math.round(
            grades.reduce((prev, current) => prev + current, 0) / grades.length,
          );

      return { url: undefined, slug, variation, average, grades };
    },
  );

  return urlVariations;
};

/**
 * Computes the stability data for a set of clusters based on their performance grades.
 *
 * @param performances - An array of Performance objects with an optional cluster property.
 * @returns An array of StabilityData objects, each containing the cluster, variation, average, and grades for that cluster.
 *
 * Note: This implementation assumes that each Performance may have a 'cluster' property or association.
 * If not, this function will return an empty array. Update this logic if/when clusters are reintroduced.
 */
const getClusterStability = (performances: Performance[]): StabilityData[] => {
  // If clusters are not present on Performance, return empty array
  if (!performances.length || !('cluster' in performances[0])) {
    return [];
  }
  // Group by cluster
  const clusterGradesMap: Record<string, number[]> = {};
  const clusterNamesMap: Record<string, string> = {};
  performances.forEach((performance: any) => {
    if (!performance.cluster) return;
    const clusterKey = performance.cluster.slug || performance.cluster;
    if (!clusterGradesMap[clusterKey]) {
      clusterGradesMap[clusterKey] = [];
      clusterNamesMap[clusterKey] = performance.cluster.name || '';
    }
    // Calculate performance score from Core Web Vitals metrics
    const lcpScore = performance.lcp
      ? Math.max(0, 100 - performance.lcp / 25)
      : 0;
    const fcpScore = performance.fcp
      ? Math.max(0, 100 - performance.fcp / 18)
      : 0;
    const clsScore = performance.cls
      ? Math.max(0, 100 - parseFloat(performance.cls) * 100)
      : 0;
    const performanceScore = Math.round((lcpScore + fcpScore + clsScore) / 3);
    clusterGradesMap[clusterKey].push(performanceScore);
  });
  // Calculate variations and other datapoints
  return Object.entries(clusterGradesMap).map(([cluster, grades]) => {
    const variation = !grades.length
      ? Infinity
      : Math.max(...grades) - Math.min(...grades);
    const average = !grades.length
      ? 0
      : Math.round(
          grades.reduce((prev, current) => prev + current, 0) / grades.length,
        );
    return {
      cluster,
      name: clusterNamesMap[cluster],
      slug: cluster,
      variation,
      average,
      grades,
    };
  });
};

/**
 * Compares the stability data between desktop and mobile platforms and identifies the differences.
 *
 * @param stability - An object containing stability data for both desktop and mobile platforms.
 * @returns An array of `PlatformDifference` objects, each representing the difference in stability metrics
 *          for a specific URL between desktop and mobile platforms, sorted by the difference in ascending order.
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
 * Extracts and formats time-related information from a Performance object.
 *
 * @param item - The Performance object containing the `created_at` timestamp and performance data.
 * @returns An object containing date, hour, timeDecimal, and performance information.
 */
const extractTimeOfDay = (item: Performance) => {
  const recordedAt = item.createdAt;
  const hours = recordedAt.getHours();
  const minutes = recordedAt.getMinutes();
  const timeDecimal = hours + minutes / 60;

  const year = recordedAt.getFullYear();
  const month = (recordedAt.getMonth() + 1).toString().padStart(2, '0');
  const day = recordedAt.getDate().toString().padStart(2, '0');
  const date = `${year}-${month}-${day}`;

  // Calculate performance score from Core Web Vitals metrics
  const lcpScore = item.lcp ? Math.max(0, 100 - item.lcp / 25) : 0;
  const fcpScore = item.fcp ? Math.max(0, 100 - item.fcp / 18) : 0;
  const clsScore = item.cls ? Math.max(0, 100 - parseFloat(item.cls) * 100) : 0;
  const performance = Math.round((lcpScore + fcpScore + clsScore) / 3);

  return {
    slug: `performance-${item.id}`,
    date,
    hour: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
    timeDecimal,
    performance,
  };
};

/**
 * Analyzes the performance of performance records based on the time of day, categorized by platform type.
 *
 * @param performances - An array of `Performance` objects.
 * @returns An object containing two arrays:
 *          - `mobile`: Time of day data extracted from performance records on mobile platforms.
 *          - `desktop`: Time of day data extracted from performance records on desktop platforms.
 */
const getTimeOfDayPerformance = (performances: Performance[]) => {
  const mobile = performances
    .filter((performance) => performance.platform?.type === 'mobile')
    .map(extractTimeOfDay);

  const desktop = performances
    .filter((performance) => performance.platform?.type === 'desktop')
    .map(extractTimeOfDay);

  return { mobile, desktop };
};

/**
 * Computes the performance distribution for mobile and desktop platforms based on the provided performance records.
 * Note: This function now calculates performance from Core Web Vitals metrics instead of pre-calculated grades.
 *
 * @param performances - An array of `Performance` objects with Core Web Vitals metrics.
 * @returns An object containing the performance distribution for both mobile and desktop platforms.
 */
const getGradesDistribution = (performances: Performance[]) => {
  // Collect performance scores for mobile
  const mobileScores = performances
    .filter((performance) => performance.platform?.type === 'mobile')
    .map((performance) => {
      const lcpScore = performance.lcp
        ? Math.max(0, 100 - performance.lcp / 25)
        : 0;
      const fcpScore = performance.fcp
        ? Math.max(0, 100 - performance.fcp / 18)
        : 0;
      const clsScore = performance.cls
        ? Math.max(0, 100 - parseFloat(performance.cls) * 100)
        : 0;
      return Math.round((lcpScore + fcpScore + clsScore) / 3);
    });

  // Collect performance scores for desktop
  const desktopScores = performances
    .filter((performance) => performance.platform?.type === 'desktop')
    .map((performance) => {
      const lcpScore = performance.lcp
        ? Math.max(0, 100 - performance.lcp / 25)
        : 0;
      const fcpScore = performance.fcp
        ? Math.max(0, 100 - performance.fcp / 18)
        : 0;
      const clsScore = performance.cls
        ? Math.max(0, 100 - parseFloat(performance.cls) * 100)
        : 0;
      return Math.round((lcpScore + fcpScore + clsScore) / 3);
    });

  // Calculate averages
  const mobileAverage =
    mobileScores.length > 0
      ? Math.round(
          mobileScores.reduce((a, b) => a + b, 0) / mobileScores.length,
        )
      : 0;

  const desktopAverage =
    desktopScores.length > 0
      ? Math.round(
          desktopScores.reduce((a, b) => a + b, 0) / desktopScores.length,
        )
      : 0;

  // Final Formatting - simplified since we only have overall performance now
  const gradesData = {
    desktop: [
      {
        metric: 'performance',
        value: desktopAverage,
      },
    ],
    mobile: [
      {
        metric: 'performance',
        value: mobileAverage,
      },
    ],
  };

  return gradesData;
};

/**
 * Transforms a `Performance` object containing Core Web Vitals (CWV) data into a history object.
 *
 * @param {Performance} performance - A Performance object with Core Web Vitals metrics.
 * @returns {Object} A history object containing CWV metrics.
 */
const cwvToHistory = (performance: Performance) => {
  if (!performance) {
    return null;
  }

  const recordedAt = performance.createdAt;

  const year = recordedAt.getFullYear();
  const month = (recordedAt.getMonth() + 1).toString().padStart(2, '0');
  const day = recordedAt.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  return {
    date: formattedDate,
    ttfb: performance.ttfb || 0,
    fcp: performance.fcp || 0,
    dcl: performance.dcl || 0,
    lcp: performance.lcp || 0,
    tti: performance.tti || 0,
    si: performance.si || 0,
    cls: parseFloat(performance.cls || '0').toFixed(3),
    tbt: performance.tbt || 0,
  };
};

/**
 * Processes an array of performance records and categorizes them into desktop and mobile histories.
 *
 * @param performances - An array of `Performance` objects to be processed.
 * @returns An object containing two arrays:
 * - `desktop`: An array of processed desktop performance records.
 * - `mobile`: An array of processed mobile performance records.
 */
const getHistory = (performances: Performance[]) => {
  return {
    desktop: performances
      .filter((performance) => performance.platform?.type === 'desktop')
      .map(cwvToHistory)
      .filter((item) => item !== null),
    mobile: performances
      .filter((performance) => performance.platform?.type === 'mobile')
      .map(cwvToHistory)
      .filter((item) => item !== null),
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

/**
 * Calculates percentile statistics (min, p50, avg, p75, p90, p99, max) for an array of numbers.
 * @param values Array of numbers to calculate statistics for
 * @returns An object with min, p50, avg, p75, p90, p99, max
 */
const calculatePercentileStats = (values: number[]) => {
  if (!values.length) {
    return { min: 0, p50: 0, avg: 0, p75: 0, p90: 0, p99: 0, max: 0 };
  }
  const sorted = [...values].sort((a, b) => a - b);
  const len = sorted.length;
  const getPercentile = (percentile: number) => {
    const index = Math.ceil((percentile / 100) * len) - 1;
    return sorted[Math.max(0, Math.min(index, len - 1))];
  };
  const avg = values.reduce((sum, val) => sum + val, 0) / len;
  return {
    min: sorted[0],
    p50: getPercentile(50),
    avg: Math.round(avg * 100) / 100,
    p75: getPercentile(75),
    p90: getPercentile(90),
    p99: getPercentile(99),
    max: sorted[len - 1],
  };
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
  calculatePercentileStats,
};
