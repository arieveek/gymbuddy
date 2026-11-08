<script setup lang="ts">
const { t, te, locale } = useI18n()
const auth = useAuthStore()
const store = useTrainingStore()
const { sync, syncing, lastError } = useSync()

const status = computed(() => {
  if (syncing.value) return t('account.syncing')
  if (lastError.value) return te(`errors.${lastError.value}`) ? t(`errors.${lastError.value}`) : t('errors.UNKNOWN')
  if (store.outbox.length) return t('account.pending', { n: store.outbox.length })
  if (store.lastSyncAt) return t('account.synced', { time: new Date(store.lastSyncAt).toLocaleString(locale.value, { dateStyle: 'medium', timeStyle: 'short' }) })
  return ''
})
</script>

<template>
  <div class="card stack">
    <h2>{{ t('account.title') }}</h2>
    <template v-if="auth.signedIn">
      <p class="exname">{{ auth.email }}</p>
      <p class="sub" aria-live="polite">{{ status }}</p>
      <div class="btnrow">
        <button type="button" class="btn ghost" @click="auth.logout()">{{ t('account.logout') }}</button>
        <button type="button" class="btn" :disabled="syncing" @click="sync()">{{ t('account.syncNow') }}</button>
      </div>
    </template>
    <template v-else>
      <p class="sub">{{ t('account.local') }}</p>
      <div class="btnrow">
        <NuxtLink to="/login" class="btn ghost">{{ t('account.login') }}</NuxtLink>
        <NuxtLink to="/login?mode=register" class="btn">{{ t('account.register') }}</NuxtLink>
      </div>
    </template>
  </div>
</template>
