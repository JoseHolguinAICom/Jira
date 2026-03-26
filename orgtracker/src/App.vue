<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route  = useRoute()

// Lee el usuario de la sesión — equivalente a User.Identity en ASP.NET
const usuario = computed(() => {
  const data = localStorage.getItem('orgtracker_user')
  return data ? JSON.parse(data) : null
})

// Muestra el layout solo si hay sesión activa
const mostrarLayout = computed(() => !!usuario.value)

// Items del menú — equivalente a los links en _Layout.cshtml
const menuItems = [
  { label: 'Organizaciones', path: '/organizaciones', icon: '🏢' },
  { label: 'Productos',      path: '/productos',      icon: '📦' },
  { label: 'Anuncios',       path: '/anuncios',       icon: '📣' },
]

function cerrarSesion() {
  localStorage.removeItem('orgtracker_user')
  router.push('/login')
}

// Detecta si una ruta está activa — para resaltar el item del menú
function esActivo(path) {
  return route.path === path
}
</script>

<template>
  <!-- Sin sesión: solo muestra la vista (login) -->
  <router-view v-if="!mostrarLayout" />

  <!-- Con sesión: muestra el layout completo -->
  <div v-else class="min-h-screen flex flex-col bg-gray-50">

    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <span class="text-lg font-semibold text-gray-800">OrgTracker</span>
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-500">{{ usuario.correo }}</span>
        <button
          @click="cerrarSesion"
          class="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </header>

    <!-- Cuerpo: sidebar + contenido -->
    <div class="flex flex-1">

      <!-- Sidebar -->
      <aside class="w-56 bg-white border-r border-gray-200 py-6">
        <nav class="space-y-1 px-3">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
            :class="esActivo(item.path)
              ? 'bg-blue-50 text-blue-700 font-medium'
              : 'text-gray-600 hover:bg-gray-100'"
          >
            <span>{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </router-link>
        </nav>
      </aside>

      <!-- Área de contenido -->
      <main class="flex-1 p-6">
        <router-view />
      </main>

    </div>
  </div>
</template>