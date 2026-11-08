<script setup lang="ts">
import { DEFAULT_REMINDERS, type ReminderSettings } from '~/utils/reminders'

/** Workout-day reminders for the active athlete, stored on this phone only. */
const { t, locale } = useI18n()
const store = useTrainingStore()
const { native, apply } = useReminders()
const denied = ref(false)

const settings = computed<ReminderSettings>(() => store.device.reminders ?? DEFAULT_REMINDERS)
const dayNames = computed(() => [1, 2, 3, 4, 5, 6, 7].map(d =>
  ({ d, label: new Date(2024, 0, d).toLocaleDateString(locale.value, { weekday: 'short' }) }))) // 1 Jan 2024 was a Monday

async function update(patch: Partial<ReminderSettings>) {
  store.setDevice({ reminders: { ...settings.value, ...patch } })
  denied.value = !(await apply()) && native && settings.value.enabled
}

function toggleDay(d: number) {
  const days = settings.value.days.includes(d) ? settings.value.days.filter(x => x !== d) : [...settings.value.days, d]
  void update({ days: days.sort() })
}
</script>

<template>
  <div class="card stack">
    <div class="row between">
      <h2>{{ t('reminder.title') }}</h2>
      <span class="chip good">{{ t('device.badge') }}</span>
    </div>
    <template v-if="native">
      <label class="toggle">
        <input type="checkbox" :checked="settings.enabled" @change="update({ enabled: ($event.target as HTMLInputElement).checked })">
        <span class="exname">{{ t('reminder.enable') }}</span>
      </label>
      <template v-if="settings.enabled">
        <div class="days" role="group" :aria-label="t('reminder.days')">
          <button v-for="day in dayNames" :key="day.d" type="button" :aria-pressed="settings.days.includes(day.d)" @click="toggleDay(day.d)">
            {{ day.label }}
          </button>
        </div>
        <div class="field">
          <label for="reminder-time">{{ t('reminder.time') }}</label>
          <input id="reminder-time" type="time" :value="settings.time" @change="update({ time: ($event.target as HTMLInputElement).value })">
        </div>
        <p class="sub">{{ t('reminder.hint') }}</p>
      </template>
      <p v-if="denied" class="error" role="alert">{{ t('reminder.denied') }}</p>
    </template>
    <p v-else class="sub">{{ t('reminder.appOnly') }}</p>
  </div>
</template>

<style scoped>
.toggle { display: flex; gap: 10px; align-items: center; cursor: pointer; min-height: 44px; }
.toggle input { width: 24px; height: 24px; accent-color: var(--accent); }
.days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.days button { min-height: 44px; border-radius: 10px; border: 2px solid var(--line); background: var(--bg); font-weight: 700; font-size: 13px; text-transform: capitalize; }
.days button[aria-pressed="true"] { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }
</style>
