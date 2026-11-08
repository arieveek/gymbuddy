<script setup lang="ts">
import { errorCode } from '~/stores/auth'
import { formatDate } from '~/utils/date'

interface Account {
  id: string
  email: string
  role: 'user' | 'admin'
  status: 'pending' | 'approved' | 'blocked'
  createdAt: string
  approvedAt: string | null
  athletes: number
}

definePageMeta({ layout: 'bare' })
const { t, te, locale } = useI18n()
const { $api } = useNuxtApp()
const store = useTrainingStore()

const accounts = ref<Account[]>([])
const loading = ref(true)
const busyId = ref<string | null>(null)
const error = ref<string | null>(null)

const groups = computed(() => (['pending', 'approved', 'blocked'] as const).map(status => ({
  status,
  items: accounts.value.filter(a => a.status === status)
})))

const message = (e: unknown) => {
  const code = errorCode(e)
  return te(`errors.${code}`) ? t(`errors.${code}`) : t('errors.UNKNOWN')
}

async function load() {
  loading.value = true
  error.value = null
  try {
    accounts.value = await $api<Account[]>('/admin/users')
  }
  catch (e) {
    error.value = message(e)
  }
  finally {
    loading.value = false
  }
}

async function act(a: Account, action: 'approve' | 'block' | 'delete') {
  if (action === 'block' && !window.confirm(t('admin.confirmBlock', { email: a.email }))) return
  if (action === 'delete' && !window.confirm(t(a.status === 'pending' ? 'admin.confirmReject' : 'admin.confirmDelete', { email: a.email }))) return
  busyId.value = a.id
  error.value = null
  try {
    if (action === 'delete') {
      await $api(`/admin/users/${a.id}`, { method: 'DELETE' })
      accounts.value = accounts.value.filter(x => x.id !== a.id)
    }
    else {
      const updated = await $api<Account>(`/admin/users/${a.id}/${action}`, { method: 'POST' })
      accounts.value = accounts.value.map(x => (x.id === a.id ? updated : x))
    }
  }
  catch (e) {
    error.value = message(e)
  }
  finally {
    busyId.value = null
  }
}

onMounted(load)
</script>

<template>
  <div class="stack">
    <div class="row between">
      <NuxtLink :to="store.athletes.length ? '/profile' : '/welcome'" class="btn ghost small">{{ t('common.back') }}</NuxtLink>
      <button type="button" class="btn ghost small" :disabled="loading" @click="load">{{ t('admin.refresh') }}</button>
    </div>
    <h1 class="h2" style="font-size: 40px">{{ t('admin.title') }}</h1>
    <p class="sub">{{ t('admin.intro') }}</p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="loading" class="sub">{{ t('admin.loading') }}</p>

    <section v-for="g in groups" v-else :key="g.status" class="card stack" :aria-label="t(`admin.group.${g.status}`)">
      <div class="row between">
        <h2>{{ t(`admin.group.${g.status}`) }}</h2>
        <span class="chip" :class="{ good: g.status === 'approved' }">{{ g.items.length }}</span>
      </div>
      <p v-if="!g.items.length" class="sub">{{ t(`admin.empty.${g.status}`) }}</p>
      <ul class="accounts">
        <li v-for="a in g.items" :key="a.id">
          <div>
            <div class="exname">
              {{ a.email }}
              <span v-if="a.role === 'admin'" class="chip">{{ t('admin.adminBadge') }}</span>
            </div>
            <div class="sub">
              {{ t('admin.registered', { date: formatDate(a.createdAt.slice(0, 10), locale, { day: 'numeric', month: 'short', year: 'numeric' }) }) }}
              · {{ t('admin.athletes', { n: a.athletes }) }}
            </div>
          </div>
          <div v-if="a.role !== 'admin'" class="actions">
            <button v-if="a.status !== 'approved'" type="button" class="btn small" :disabled="busyId === a.id" @click="act(a, 'approve')">
              {{ t('admin.approve') }}
            </button>
            <button v-if="a.status === 'approved'" type="button" class="btn ghost small" :disabled="busyId === a.id" @click="act(a, 'block')">
              {{ t('admin.block') }}
            </button>
            <button type="button" class="btn ghost small" :disabled="busyId === a.id" @click="act(a, 'delete')">
              {{ a.status === 'pending' ? t('admin.reject') : t('admin.delete') }}
            </button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.accounts { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.accounts li { display: flex; flex-wrap: wrap; gap: 10px; justify-content: space-between; align-items: center; padding: 12px 0; border-top: 1px solid var(--line); }
.accounts li:first-child { border-top: 0; }
.exname { word-break: break-all; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.actions { display: flex; gap: 8px; flex-wrap: wrap; }
</style>
