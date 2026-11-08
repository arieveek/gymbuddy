<script setup lang="ts">
import type { AgeGroup, Locale } from '~/data/types'

const name = defineModel<string>('name', { required: true })
const ageGroup = defineModel<AgeGroup>('ageGroup', { required: true })
const language = defineModel<Locale>('language', { required: true })
const { t } = useI18n()
const uid = useId()
</script>

<template>
  <div class="stack">
    <div class="field">
      <label :for="`${uid}-name`">{{ t('profile.name') }}</label>
      <input :id="`${uid}-name`" v-model="name" type="text" maxlength="30" autocomplete="off" :placeholder="t('profile.namePlaceholder')">
      <p class="sub">{{ t('profile.nameHint') }}</p>
    </div>
    <fieldset class="field" style="border: 0; padding: 0; margin: 0">
      <legend>{{ t('profile.ageGroup') }}</legend>
      <div class="segmented">
        <button type="button" :aria-pressed="ageGroup === 'child'" @click="ageGroup = 'child'">{{ t('profile.child') }}</button>
        <button type="button" :aria-pressed="ageGroup === 'adult'" @click="ageGroup = 'adult'">{{ t('profile.adult') }}</button>
      </div>
    </fieldset>
    <fieldset class="field" style="border: 0; padding: 0; margin: 0">
      <legend>{{ t('profile.language') }}</legend>
      <div class="segmented">
        <button type="button" lang="nl" :aria-pressed="language === 'nl'" @click="language = 'nl'">Nederlands</button>
        <button type="button" lang="en" :aria-pressed="language === 'en'" @click="language = 'en'">English</button>
      </div>
    </fieldset>
  </div>
</template>
