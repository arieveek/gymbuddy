<script setup lang="ts">
import { EXERCISES } from '~/data/exercises'
import type { ExerciseId } from '~/data/types'

const props = defineProps<{ id: ExerciseId }>()
const text = useText()
const ex = computed(() => EXERCISES[props.id])
</script>

<template>
  <li>
    <div class="thumb"><ExerciseAnimation :id="id" :animate="false" :label="text(ex.name)" /></div>
    <div>
      <div class="exname">{{ text(ex.name) }}</div>
      <div class="sub">{{ text(ex.tempo ?? ex.why) }}</div>
    </div>
    <slot />
  </li>
</template>

<style scoped>
.thumb { width: 64px; height: 64px; }
.thumb :deep(svg) { width: 64px; height: 64px; }
</style>
