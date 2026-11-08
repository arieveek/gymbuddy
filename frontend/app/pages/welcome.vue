<script setup lang="ts">
import type { AgeGroup, Locale } from '~/data/types'
import { deviceLocale } from '~/utils/locale'

definePageMeta({ layout: 'bare' })
const { t, setLocale } = useI18n()
const store = useTrainingStore()
const logout = useLogout()

const name = ref('')
const ageGroup = ref<AgeGroup>('child')
const language = ref<Locale>(deviceLocale())
watch(language, l => setLocale(l))

function create() {
  if (!name.value.trim()) return
  store.createAthlete({ name: name.value, ageGroup: ageGroup.value, language: language.value })
  navigateTo('/')
}
</script>

<template>
  <div class="stack">
    <header class="hero">
      <h1>GymBuddy</h1>
      <p>{{ t('welcome.tagline') }}</p>
    </header>
    <form class="card stack" @submit.prevent="create">
      <h2>{{ t('welcome.title') }}</h2>
      <ProfileFields v-model:name="name" v-model:age-group="ageGroup" v-model:language="language" />
      <button class="btn big" type="submit" :disabled="!name.trim()">{{ t('welcome.start') }}</button>
      <p class="note">{{ t('welcome.private') }}</p>
    </form>
    <button type="button" class="btn ghost" @click="logout()">{{ t('account.logout') }}</button>
  </div>
</template>

<style scoped>
.hero { background: var(--ink); color: var(--bg); border-radius: var(--r); padding: 24px 20px; position: relative; overflow: hidden; }
.hero::after { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 5px; background: var(--accent); }
.hero h1 { font-family: var(--display); font-weight: 900; font-size: 56px; line-height: 1; text-transform: uppercase; }
.hero p { margin: 6px 0 0; opacity: .8; }
</style>
