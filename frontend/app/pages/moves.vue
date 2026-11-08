<script setup lang="ts">
import { EXERCISES, MOVE_ORDER } from '~/data/exercises'
import type { ExerciseId } from '~/data/types'

const { t } = useI18n()
const text = useText()
const store = useTrainingStore()

const moves = computed(() => MOVE_ORDER.filter(id => !EXERCISES[id].adultOnly || store.active?.ageGroup === 'adult'))
const openId = ref<ExerciseId | null>(null)
const open = computed({ get: () => openId.value !== null, set: (v) => { if (!v) openId.value = null } })
const caption = ref('')
const ex = computed(() => (openId.value ? EXERCISES[openId.value] : null))
</script>

<template>
  <section class="card stack" :aria-label="t('nav.moves')">
    <h2>{{ t('moves.title') }}</h2>
    <p class="sub">{{ t('moves.intro') }}</p>
    <ul class="exlist">
      <ExerciseRow v-for="id in moves" :id="id" :key="id">
        <button class="btn ghost small" :aria-label="t('moves.howTo', { name: text(EXERCISES[id].name) })" @click="openId = id">
          {{ t('moves.how') }}
        </button>
      </ExerciseRow>
    </ul>

    <UModal v-model:open="open" :title="ex ? text(ex.name) : ''" :description="ex?.why ? text(ex.why) : undefined">
      <template #body>
        <div v-if="openId && ex" class="stack">
          <ExerciseAnimation :id="openId" @caption="caption = $event" />
          <p class="target" aria-live="off">{{ caption }}</p>
          <ol class="cues">
            <li v-for="(c, k) in ex.cues" :key="k">{{ text(c) }}</li>
          </ol>
          <button class="btn" @click="open = false">{{ t('moves.gotIt') }}</button>
        </div>
      </template>
    </UModal>
  </section>
</template>
