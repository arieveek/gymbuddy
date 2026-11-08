<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const tabs = [
  { to: '/', key: 'today', icon: 'i-lucide-calendar-check' },
  { to: '/moves', key: 'moves', icon: 'i-lucide-list' },
  { to: '/progress', key: 'progress', icon: 'i-lucide-trending-up' },
  { to: '/tips', key: 'tips', icon: 'i-lucide-info' }
] as const
</script>

<template>
  <nav class="tabs" :aria-label="t('nav.label')">
    <div class="in">
      <NuxtLink v-for="tab in tabs" :key="tab.to" :to="tab.to" :aria-current="route.path === tab.to ? 'page' : undefined">
        <UIcon :name="tab.icon" class="icon" />
        {{ t(`nav.${tab.key}`) }}
      </NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
.tabs { position: fixed; left: 0; right: 0; bottom: 0; background: var(--surface); border-top: 1px solid var(--line); display: flex; justify-content: center; padding-bottom: env(safe-area-inset-bottom); z-index: 10; }
.in { display: grid; grid-template-columns: repeat(4, 1fr); width: 100%; max-width: 720px; }
a { padding: 10px 4px 12px; display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 12px; font-weight: 600; color: var(--muted); text-decoration: none; min-height: 56px; }
a[aria-current="page"] { color: var(--accent); }
.icon { width: 24px; height: 24px; }
</style>
