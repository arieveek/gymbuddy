<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="card stack">
    <h2>{{ t('account.title') }}</h2>
    <p class="sub">{{ t('account.local') }}</p>
  </div>
</template>
