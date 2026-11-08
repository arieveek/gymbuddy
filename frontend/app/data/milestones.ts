/** Open-ended milestone series: fixed early steps, then a repeating increment forever. */
export interface MilestoneSeries {
  kind: 'pullups' | 'workouts' | 'streak'
  start: number[]
  every: number
}

export const MILESTONES: MilestoneSeries[] = [
  { kind: 'pullups', start: [1, 5, 10, 15, 20], every: 5 },
  { kind: 'workouts', start: [10, 25, 50, 100], every: 50 },
  { kind: 'streak', start: [4, 8, 12, 26, 52], every: 26 }
]
