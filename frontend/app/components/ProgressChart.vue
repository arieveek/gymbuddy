<script setup lang="ts">
import type { TestResult } from '~/data/types'
import { formatDate } from '~/utils/date'

const props = defineProps<{ tests: TestResult[] }>()
const { t, locale } = useI18n()

const W = 320, H = 150, pl = 28, pr = 10, pt = 12, pb = 24
const chart = computed(() => {
  const T = props.tests
  const max = Math.max(4, ...T.map(x => x.pullups))
  const top = Math.ceil(max / 2) * 2
  const x = (i: number) => pl + (W - pl - pr) * (T.length === 1 ? 0.5 : i / (T.length - 1))
  const y = (v: number) => pt + (H - pt - pb) * (1 - v / top)
  const stepV = Math.max(1, Math.round(top / 4))
  const grid: number[] = []
  for (let v = 0; v <= top; v += stepV) grid.push(v)
  const pts = T.map((r, i) => `${x(i)},${y(r.pullups)}`).join(' ')
  const area = `M${x(0)},${y(0)} L${T.map((r, i) => `${x(i)},${y(r.pullups)}`).join(' L')} L${x(T.length - 1)},${y(0)} Z`
  return { x, y, grid, pts, area }
})
</script>

<template>
  <div>
    <p v-if="tests.length < 2" class="sub">{{ tests.length ? t('progress.chartOneMore') : t('progress.chartEmpty') }}</p>
    <template v-else>
      <svg :viewBox="`0 0 ${W} ${H}`" role="img" :aria-label="t('progress.chartLabel', { n: tests.at(-1)!.pullups })" class="chart">
        <g v-for="v in chart.grid" :key="v">
          <line :x1="pl" :x2="W - pr" :y1="chart.y(v)" :y2="chart.y(v)" stroke="var(--line)" />
          <text :x="pl - 6" :y="chart.y(v) + 4" text-anchor="end" font-size="11" fill="var(--muted)">{{ v }}</text>
        </g>
        <path :d="chart.area" fill="var(--accent)" fill-opacity=".12" />
        <polyline :points="chart.pts" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" />
        <circle v-for="(r, i) in tests" :key="r.id" :cx="chart.x(i)" :cy="chart.y(r.pullups)" :r="i === tests.length - 1 ? 5 : 3" fill="var(--accent)" />
        <text :x="pl" :y="H - 6" font-size="11" fill="var(--muted)">{{ formatDate(tests[0]!.date, locale) }}</text>
        <text :x="W - pr" :y="H - 6" font-size="11" text-anchor="end" fill="var(--muted)">{{ formatDate(tests.at(-1)!.date, locale) }}</text>
      </svg>
      <p class="sub" style="margin-top: 4px">{{ t('progress.chartCaption') }}</p>
    </template>
  </div>
</template>

<style scoped>
.chart { width: 100%; height: auto; display: block; }
</style>
