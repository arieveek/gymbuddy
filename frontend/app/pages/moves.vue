<script setup lang="ts">
import { EXERCISES, MOVE_ORDER } from '~/data/exercises'
import { SOURCES } from '~/data/sources'
import { CATEGORIES, EQUIPMENT, type BodyArea, type Category, type Difficulty, type Equipment, type Exercise, type ExerciseId } from '~/data/types'
import { blockedBy } from '~/data/loads'

const { t } = useI18n()
const text = useText()
const store = useTrainingStore()

const { workout, injuries } = useTraining()
const hideBlocked = ref(false)
const blocked = (id: ExerciseId) => blockedBy(id, injuries.value)
const areaNames = (areas: BodyArea[]) => areas.map(a => t(`injury.area.${a}`).toLowerCase()).join(', ')
const query = ref('')
const category = ref<Category | null>(null)
const equipment = ref<Equipment[]>([])
const level = ref<Difficulty | null>(null)

const inPlan = computed(() => new Set(workout.value.map(s => s.ex)))
const available = computed(() => MOVE_ORDER.map(id => EXERCISES[id]).filter(e => !e.adultOnly || store.active?.ageGroup === 'adult'))

const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const filtered = computed(() => {
  const q = normalize(query.value.trim())
  return available.value.filter(e =>
    (!category.value || e.category === category.value)
    && (!level.value || e.difficulty === level.value)
    && (!equipment.value.length || e.equipment.some(x => equipment.value.includes(x)))
    && (!q || normalize(e.name.en).includes(q) || normalize(e.name.nl).includes(q))
    && (!hideBlocked.value || !blocked(e.id).length))
})
const groups = computed(() => CATEGORIES
  .map(c => ({ category: c, items: filtered.value.filter(e => e.category === c) }))
  .filter(g => g.items.length))

function toggleEquipment(x: Equipment) {
  equipment.value = equipment.value.includes(x) ? equipment.value.filter(e => e !== x) : [...equipment.value, x]
}
function clearFilters() {
  query.value = ''
  category.value = null
  equipment.value = []
  level.value = null
}

/* Detail sheet */
const openId = ref<ExerciseId | null>(null)
const open = computed({ get: () => openId.value !== null, set: (v) => { if (!v) openId.value = null } })
const caption = ref('')
const ex = computed<Exercise | null>(() => (openId.value ? EXERCISES[openId.value] : null))
</script>

<template>
  <section class="stack" :aria-label="t('nav.moves')">
    <div class="card stack">
      <h2>{{ t('moves.title') }}</h2>
      <p class="sub">{{ t('moves.intro') }}</p>
      <div class="field">
        <label for="lib-search" class="sr-only">{{ t('library.search') }}</label>
        <input id="lib-search" v-model="query" type="search" :placeholder="t('library.search')" autocomplete="off">
      </div>

      <div class="chips" role="group" :aria-label="t('library.filterCategory')">
        <button type="button" :aria-pressed="category === null" @click="category = null">{{ t('library.all') }}</button>
        <button v-for="c in CATEGORIES" :key="c" type="button" :aria-pressed="category === c" @click="category = category === c ? null : c">
          {{ t(`library.category.${c}`) }}
        </button>
      </div>
      <div class="chips" role="group" :aria-label="t('library.filterEquipment')">
        <button v-for="x in EQUIPMENT" :key="x" type="button" :aria-pressed="equipment.includes(x)" @click="toggleEquipment(x)">
          {{ t(`library.equipment.${x}`) }}
        </button>
      </div>
      <div class="chips" role="group" :aria-label="t('library.filterLevel')">
        <button v-for="n in ([1, 2, 3] as Difficulty[])" :key="n" type="button" :aria-pressed="level === n" @click="level = level === n ? null : n">
          {{ t(`library.level.${n}`) }}
        </button>
      </div>
      <label v-if="injuries.length" class="toggle">
        <input v-model="hideBlocked" type="checkbox">
        <span>{{ t('injury.hide', { areas: areaNames(injuries) }) }}</span>
      </label>
      <div class="row between">
        <span class="sub" aria-live="polite">{{ t('library.count', { n: filtered.length }) }}</span>
        <button v-if="query || category || equipment.length || level" type="button" class="btn ghost small" @click="clearFilters">{{ t('library.clear') }}</button>
      </div>
    </div>

    <p v-if="!groups.length" class="card sub">{{ t('library.empty') }}</p>

    <div v-for="g in groups" :key="g.category" class="card stack">
      <h2>{{ t(`library.category.${g.category}`) }} <span class="sub">· {{ g.items.length }}</span></h2>
      <ul class="exlist">
        <ExerciseRow v-for="e in g.items" :id="e.id" :key="e.id">
          <template #badges>
            <span class="dots" :aria-label="t(`library.level.${e.difficulty}`)">
              <i v-for="n in 3" :key="n" :class="{ on: n <= e.difficulty }" />
            </span>
            <span v-if="inPlan.has(e.id)" class="chip good">{{ t('library.inPlan') }}</span>
            <span v-if="e.coachFirst" class="chip">{{ t('library.coachFirst') }}</span>
            <span v-if="blocked(e.id).length" class="chip warn">{{ t('injury.notNow', { areas: areaNames(blocked(e.id)) }) }}</span>
          </template>
          <button class="btn ghost small" :aria-label="t('moves.howTo', { name: text(e.name) })" @click="openId = e.id">
            {{ t('moves.how') }}
          </button>
        </ExerciseRow>
      </ul>
    </div>

    <UModal v-model:open="open" :title="ex ? text(ex.name) : ''" :description="ex?.why ? text(ex.why) : undefined">
      <template #body>
        <div v-if="openId && ex" class="stack">
          <p v-if="blocked(openId).length" class="safety" role="alert">
            <b>{{ t('injury.notNow', { areas: areaNames(blocked(openId)) }) }}</b> {{ t('injury.detail') }}
          </p>
          <ExerciseAnimation :id="openId" @caption="caption = $event" />
          <p class="target" aria-live="off">{{ caption }}</p>
          <div class="badges">
            <span class="chip">{{ t(`library.level.${ex.difficulty}`) }}</span>
            <span v-for="x in ex.equipment" :key="x" class="chip good">{{ t(`library.equipment.${x}`) }}</span>
            <span v-if="ex.coachFirst" class="chip">{{ t('library.coachFirst') }}</span>
          </div>
          <ol class="cues">
            <li v-for="(c, k) in ex.cues" :key="k">{{ text(c) }}</li>
          </ol>
          <p v-if="ex.tempo" class="sub">{{ text(ex.tempo) }}</p>
          <p v-if="ex.safety" class="safety" role="note"><b>{{ t('library.safety') }}</b> {{ text(ex.safety) }}</p>
          <div v-if="ex.easier || ex.harder" class="btnrow">
            <button v-if="ex.easier" type="button" class="btn ghost small" @click="openId = ex.easier!">← {{ text(EXERCISES[ex.easier].name) }}</button>
            <span v-else />
            <button v-if="ex.harder" type="button" class="btn ghost small" @click="openId = ex.harder!">{{ text(EXERCISES[ex.harder].name) }} →</button>
          </div>
          <div class="stack" style="gap: 4px">
            <p class="sub"><b>{{ t('library.sources') }}</b></p>
            <ul class="sources">
              <li v-for="s in ex.sources" :key="s"><a :href="SOURCES[s].url" target="_blank" rel="noopener">{{ SOURCES[s].name }}</a></li>
              <li v-if="ex.commonPractice" class="sub">{{ t('library.commonPractice') }}</li>
            </ul>
          </div>
          <button class="btn" @click="open = false">{{ t('moves.gotIt') }}</button>
        </div>
      </template>
    </UModal>
  </section>
</template>

<style scoped>
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chips button { min-height: 40px; padding: 6px 12px; border-radius: 999px; border: 2px solid var(--line); background: var(--bg); font-weight: 600; font-size: 14px; }
.chips button[aria-pressed="true"] { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }
.dots { display: inline-flex; gap: 3px; vertical-align: middle; }
.dots i { width: 8px; height: 8px; border-radius: 50%; border: 2px solid var(--muted); }
.dots i.on { background: var(--accent); border-color: var(--accent); }
.badges { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.safety { margin: 0; padding: 10px 12px; border-radius: 10px; background: var(--accent-soft); font-size: 15px; }
.sources { margin: 0; padding-left: 18px; font-size: 14px; display: flex; flex-direction: column; gap: 4px; }
.sources a { color: var(--accent); }
.chip.warn { background: var(--warn); color: var(--bg); }
.toggle { display: flex; gap: 10px; align-items: center; font-weight: 600; font-size: 15px; min-height: 40px; }
.toggle input { width: 22px; height: 22px; accent-color: var(--accent); }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
</style>
