<script setup lang="ts">
import { errorCode } from '~/stores/auth'

definePageMeta({ layout: 'bare' })
const { t, te } = useI18n()
const auth = useAuthStore()
const store = useTrainingStore()
const { sync } = useSync()
const route = useRoute()

const mode = ref<'login' | 'register'>(route.query.mode === 'register' ? 'register' : 'login')
const email = ref('')
const password = ref('')
const busy = ref(false)
const error = ref<string | null>(null)

async function submit() {
  busy.value = true
  error.value = null
  try {
    await (mode.value === 'login' ? auth.login(email.value, password.value) : auth.register(email.value, password.value))
    // Everything already on this device goes up; whatever the account has comes down.
    store.queueAll()
    await sync()
    await navigateTo(store.athletes.length ? '/' : '/welcome')
  }
  catch (e) {
    const code = errorCode(e)
    error.value = te(`errors.${code}`) ? t(`errors.${code}`) : t('errors.UNKNOWN')
  }
  finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="stack">
    <div class="row between">
      <NuxtLink :to="store.athletes.length ? '/profile' : '/welcome'" class="btn ghost small">{{ t('common.back') }}</NuxtLink>
    </div>
    <form class="card stack" @submit.prevent="submit">
      <h2>{{ mode === 'login' ? t('login.title') : t('login.registerTitle') }}</h2>
      <p class="sub">{{ t('login.intro') }}</p>
      <div class="field">
        <label for="email">{{ t('login.email') }}</label>
        <input id="email" v-model="email" type="email" autocomplete="email" required>
      </div>
      <div class="field">
        <label for="password">{{ t('login.password') }}</label>
        <input
          id="password" v-model="password" type="password" required
          :minlength="mode === 'register' ? 8 : undefined"
          :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
        >
        <p v-if="mode === 'register'" class="sub">{{ t('login.passwordHint') }}</p>
      </div>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <button class="btn big" type="submit" :disabled="busy">
        {{ busy ? t('login.busy') : mode === 'login' ? t('login.submit') : t('login.registerSubmit') }}
      </button>
      <button type="button" class="btn ghost" @click="mode = mode === 'login' ? 'register' : 'login'; error = null">
        {{ mode === 'login' ? t('login.toRegister') : t('login.toLogin') }}
      </button>
    </form>
  </div>
</template>
