<script setup lang="ts">
import { errorCode } from '~/stores/auth'

definePageMeta({ layout: 'bare' })
const { t, te } = useI18n()
const auth = useAuthStore()
const store = useTrainingStore()
const { sync } = useSync()
const route = useRoute()

const mode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const busy = ref(false)
const error = ref<string | null>(null)
const registered = ref(false)
const reason = computed(() => {
  const r = route.query.reason
  return r === 'not-approved' || r === 'expired' ? t(`login.reason.${r}`) : null
})

function message(code: string) {
  return te(`errors.${code}`) ? t(`errors.${code}`) : t('errors.UNKNOWN')
}

async function submit() {
  busy.value = true
  error.value = null
  try {
    if (mode.value === 'register') {
      await auth.register(email.value, password.value)
      registered.value = true
      password.value = ''
      return
    }
    await auth.login(email.value, password.value)
    // Data from another account on this device is cleared; this account's own unsynced changes are kept and uploaded.
    store.claimFor(auth.email!)
    store.queueAll()
    await sync()
    await navigateTo(store.athletes.length ? '/' : '/welcome')
  }
  catch (e) {
    error.value = message(errorCode(e))
  }
  finally {
    busy.value = false
  }
}

function switchMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  error.value = null
  registered.value = false
}
</script>

<template>
  <div class="stack">
    <header class="hero">
      <h1>GymBuddy</h1>
      <p>{{ t('welcome.tagline') }}</p>
    </header>

    <p v-if="reason" class="card sub" role="status">{{ reason }}</p>

    <div v-if="registered" class="card stack" role="status">
      <h2>{{ t('login.pendingTitle') }}</h2>
      <p style="margin: 0">{{ t('login.pendingBody') }}</p>
      <button type="button" class="btn" @click="registered = false; mode = 'login'">{{ t('login.toLoginShort') }}</button>
    </div>

    <form v-else class="card stack" @submit.prevent="submit">
      <h2>{{ mode === 'login' ? t('login.title') : t('login.registerTitle') }}</h2>
      <p class="sub">{{ mode === 'login' ? t('login.intro') : t('login.registerIntro') }}</p>
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
      <button type="button" class="btn ghost" @click="switchMode">
        {{ mode === 'login' ? t('login.toRegister') : t('login.toLogin') }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.hero { background: var(--ink); color: var(--bg); border-radius: var(--r); padding: 24px 20px; position: relative; overflow: hidden; }
.hero::after { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 5px; background: var(--accent); }
.hero h1 { font-family: var(--display); font-weight: 900; font-size: 56px; line-height: 1; text-transform: uppercase; }
.hero p { margin: 6px 0 0; opacity: .8; }
</style>
