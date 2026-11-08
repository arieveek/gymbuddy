<script setup lang="ts">
import type { AgeGroup, Level, Locale } from '~/data/types'
import { LEVELS } from '~/data/levels'

const { t } = useI18n()
const text = useText()
const store = useTrainingStore()

const name = computed({ get: () => store.active?.name ?? '', set: v => store.updateAthlete({ name: v }) })
const ageGroup = computed<AgeGroup>({ get: () => store.active?.ageGroup ?? 'child', set: v => store.updateAthlete({ ageGroup: v }) })
const language = computed<Locale>({ get: () => store.active?.language ?? 'en', set: v => store.updateAthlete({ language: v }) })
const level = computed<Level>({ get: () => store.active?.level ?? 1, set: v => store.updateAthlete({ level: Number(v) as Level }) })

const adding = ref(false)
const newName = ref('')
const newAge = ref<AgeGroup>('child')
const newLang = ref<Locale>(store.active?.language ?? 'en')
function addAthlete() {
  if (!newName.value.trim()) return
  store.createAthlete({ name: newName.value, ageGroup: newAge.value, language: newLang.value })
  adding.value = false
  newName.value = ''
}
</script>

<template>
  <section class="stack" :aria-label="t('profile.title')">
    <div class="card stack">
      <h2>{{ t('profile.title') }}</h2>
      <ProfileFields v-model:name="name" v-model:age-group="ageGroup" v-model:language="language" />
      <div class="field">
        <label for="level">{{ t('profile.level') }}</label>
        <select id="level" v-model.number="level">
          <option v-for="l in LEVELS" :key="l.n" :value="l.n">{{ t('common.level', { n: l.n }) }}: {{ text(l.name) }}</option>
        </select>
        <p class="sub">{{ t('profile.levelHint') }}</p>
      </div>
    </div>

    <InjuryCard />

    <DeviceCard />

    <div class="card stack">
      <h2>{{ t('profile.athletes') }}</h2>
      <div class="segmented" style="grid-auto-flow: row">
        <button v-for="a in store.athletes" :key="a.id" type="button" :aria-pressed="a.id === store.active?.id" @click="store.setActive(a.id)">
          {{ a.name }} · {{ t('common.level', { n: a.level }) }}
        </button>
      </div>
      <form v-if="adding" class="stack" @submit.prevent="addAthlete">
        <ProfileFields v-model:name="newName" v-model:age-group="newAge" v-model:language="newLang" />
        <div class="btnrow">
          <button type="button" class="btn ghost" @click="adding = false">{{ t('common.cancel') }}</button>
          <button type="submit" class="btn" :disabled="!newName.trim()">{{ t('profile.add') }}</button>
        </div>
      </form>
      <button v-else type="button" class="btn ghost" @click="adding = true">{{ t('profile.addAthlete') }}</button>
    </div>

    <AccountCard />
  </section>
</template>
