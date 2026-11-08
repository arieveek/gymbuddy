<script setup lang="ts">
import { restAdvised, type Readiness } from '~/utils/plan'
import { todayISO } from '~/utils/date'

/** Quick check before a workout: how he feels and whether he already had club training today. Kept on this phone. */
const open = defineModel<boolean>('open', { default: false })
const { t } = useI18n()
const store = useTrainingStore()

const readiness = ref<Readiness | null>(null)
const club = ref<boolean | null>(null)
watch(open, (o) => {
  if (!o) return
  const today = store.device.checkin?.date === todayISO() ? store.device.checkin : null
  readiness.value = today?.readiness ?? null
  club.value = today?.club ?? null
})

const answered = computed(() => readiness.value !== null && club.value !== null)
const advice = computed(() => {
  if (!answered.value) return null
  if (restAdvised({ readiness: readiness.value!, clubToday: club.value! })) return 'rest'
  return readiness.value === 'fit' && !club.value ? 'normal' : 'lighter'
})

function save(rest: boolean, asReadiness?: Readiness) {
  store.setDevice({ checkin: { date: todayISO(), readiness: asReadiness ?? readiness.value!, club: club.value!, rest } })
}

async function start(lightAnyway = false) {
  save(false, lightAnyway ? 'tired' : undefined)
  open.value = false
  await navigateTo('/workout')
}

function rest() {
  save(true)
  open.value = false
}

const moods: { value: Readiness, icon: string }[] = [
  { value: 'fit', icon: '😀' },
  { value: 'tired', icon: '😐' },
  { value: 'sore', icon: '😩' }
]
</script>

<template>
  <UModal v-model:open="open" :title="t('checkin.title')" :description="t('checkin.intro')">
    <template #body>
      <div class="stack">
        <fieldset class="field" style="border: 0; padding: 0; margin: 0">
          <legend>{{ t('checkin.feel') }}</legend>
          <div class="moods">
            <button v-for="m in moods" :key="m.value" type="button" :aria-pressed="readiness === m.value" @click="readiness = m.value">
              <span class="emoji" aria-hidden="true">{{ m.icon }}</span>
              <span>{{ t(`checkin.mood.${m.value}`) }}</span>
            </button>
          </div>
        </fieldset>
        <fieldset class="field" style="border: 0; padding: 0; margin: 0">
          <legend>{{ t('checkin.club') }}</legend>
          <div class="segmented">
            <button type="button" :aria-pressed="club === true" @click="club = true">{{ t('checkin.yes') }}</button>
            <button type="button" :aria-pressed="club === false" @click="club = false">{{ t('checkin.no') }}</button>
          </div>
        </fieldset>

        <template v-if="advice === 'rest'">
          <p class="advice" role="status"><b>{{ t('checkin.restTitle') }}</b> {{ t('checkin.restBody') }}</p>
          <button type="button" class="btn" @click="rest">{{ t('checkin.restButton') }}</button>
          <button type="button" class="btn ghost" @click="start(true)">{{ t('checkin.lightAnyway') }}</button>
        </template>
        <template v-else-if="advice">
          <p v-if="advice === 'lighter'" class="advice" role="status">{{ t('checkin.lighter') }}</p>
          <button type="button" class="btn big" @click="start()">{{ t('today.start') }}</button>
        </template>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.moods { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.moods button { min-height: 76px; border-radius: 12px; border: 2px solid var(--line); background: var(--bg); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; font-weight: 600; font-size: 14px; }
.moods button[aria-pressed="true"] { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
.emoji { font-size: 28px; line-height: 1; }
.advice { margin: 0; padding: 10px 12px; border-radius: 10px; background: var(--accent-soft); font-size: 15px; }
</style>
