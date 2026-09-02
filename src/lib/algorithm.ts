export type ElementResult = {
  status: 'OK' | 'ZERO_RESULTS' | string;
  duration: { value: number };
};

export type DestinationInput = {
  id: string;
  name?: string;
  lat: number;
  lng: number;
};

/**
 * pure function to evaluate best destination
 * matrix[originIdx][destinationIdx] = ElementResult
 */
export function evaluateBestDestination<T extends DestinationInput>(
  destinations: T[],
  matrix: { elements: ElementResult[] }[]
): (T & { maxDuration: number; avgDuration: number }) | null {
  const results = destinations
    .map((dest, destIdx) => {
      const durations = matrix.map((row) => row.elements[destIdx]);

      // Check if all participants can reach this destination
      const isReachable = durations.every((el) => el.status === 'OK');
      if (!isReachable) return null;

      const durationValues = durations.map((el) => el.duration.value);
      return {
        ...dest,
        maxDuration: Math.max(...durationValues),
        avgDuration:
          durationValues.reduce((a, b) => a + b, 0) / durationValues.length,
      };
    })
    .filter((d) => d !== null) as (T & {
    maxDuration: number;
    avgDuration: number;
  })[];

  if (results.length === 0) return null;

  // Min-Max Algorithm + Average Tie-break
  results.sort((a, b) => {
    if (a.maxDuration !== b.maxDuration) {
      return a.maxDuration - b.maxDuration;
    }
    return a.avgDuration - b.avgDuration;
  });

  return results[0];
}
