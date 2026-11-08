<script setup lang="ts">
import { levelDef } from '~/data/levels'
import type { Level } from '~/data/types'

const open = defineModel<boolean>('open', { default: false })
const { t } = useI18n()
const text = useText()
const store = useTrainingStore()

const pullups = ref(0)
const hang = ref(0)
const result = ref<{ pullups: number, from: Level, to: Level } | null>(null)

watch(open, (o) => {
  if (!o) return
  result.value = null
  pullups.value = store.latestTest?.pullups ?? 0
  hang.value = store.latestTest?.hangSeconds ?? 0
})

const clamp = (v: number, max: number) => Math.max(0, Math.min(max, v))

function save() {
  const r = store.addTest(pullups.value, hang.value)
  if (r) result.value = { pullups: r.result.pullups, from: r.from, to: r.to }
}

const message = computed(() => {
  if (!result.value) return ''
  const { from, to } = result.value
  if (to > from) return t('test.up')
  if (to < from) return t('test.down')
  return t('test.same', { goal: text(levelDef(to).goal) })
})
</script>

<template>
  <UModal v-model:open="open" :title="result ? t('test.resultTitle') : t('test.title')" :description="result ? undefined : t('test.intro')">
    <template #body>
      <div v-if="!result" class="stack">
        <div class="field">
          <label id="lbl-p">{{ t('test.pullups') }}</label>
          <div class="stepper" role="group" aria-labelledby="lbl-p">
            <button type="button" :aria-label="t('test.less')" @click="pullups = clamp(pullups - 1, 50)">−</button>
            <output aria-live="polite">{{ pullups }}</output>
            <button type="button" :aria-label="t('test.more')" @click="pullups = clamp(pullups + 1, 50)">+</button>
          </div>
        </div>
        <div class="field">
          <label id="lbl-h">{{ t('test.hang') }}</label>
          <div class="stepper" role="group" aria-labelledby="lbl-h">
            <button type="button" :aria-label="t('test.less')" @click="hang = clamp(hang - 1, 180)">−</button>
            <output aria-live="polite">{{ hang }}</output>
            <button type="button" :aria-label="t('test.more')" @click="hang = clamp(hang + 1, 180)">+</button>
          </div>
        </div>
        <div class="btnrow">
          <button type="button" class="btn ghost" @click="open = false">{{ t('common.cancel') }}</button>
          <button type="button" class="btn" @click="save">{{ t('test.save') }}</button>
        </div>
      </div>
      <div v-else class="celebrate stack">
        <div class="clock pop" style="font-size: 96px">{{ result.pullups }}</div>
        <h2 class="h2">
          {{ result.to > result.from ? t('test.levelUp') + ' ' : '' }}{{ t('common.level', { n: result.to }) }}: {{ text(levelDef(result.to).name) }}
        </h2>
        <p class="sub">{{ message }}</p>
        <button type="button" class="btn" @click="open = false">{{ t('test.nice') }}</button>
      </div>
    </template>
  </UModal>
</template>
