<script setup lang="ts">
import { formatDate } from '~/utils/date'
import { WEEKLY_TARGET } from '~/utils/progress'

defineProps<{ weeks: { week: string, count: number }[] }>()
const { t, locale } = useI18n()
</script>

<template>
  <ol class="grid" :aria-label="t('progress.gridLabel')">
    <li
      v-for="w in weeks" :key="w.week"
      :class="{ full: w.count >= WEEKLY_TARGET, some: w.count > 0 && w.count < WEEKLY_TARGET }"
      :title="t('progress.gridWeek', { date: formatDate(w.week, locale), n: w.count })"
      :aria-label="t('progress.gridWeek', { date: formatDate(w.week, locale), n: w.count })"
    >
      {{ w.count || '' }}
    </li>
  </ol>
</template>

<style scoped>
.grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(12, 1fr); gap: 4px; }
li { aspect-ratio: 1; border-radius: 6px; border: 2px solid var(--line); display: grid; place-items: center; font-size: 12px; font-weight: 700; color: var(--muted); }
li.some { background: var(--accent-soft); border-color: var(--accent-soft); color: var(--accent); }
li.full { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); }
</style>
