<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Estado del formulario — equivalente a propiedades de un ViewModel en MVC
const correo = ref('')
const clave  = ref('')
const error  = ref('')
const cargando = ref(false)

// Convierte un string a hash SHA-256 (nativo del navegador, sin librerías)
async function hashSHA256(texto) {
  const encoder = new TextEncoder()
  const data = encoder.encode(texto)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function iniciarSesion() {
  error.value = ''
  cargando.value = true

  try {
    // Lee config.json desde public/data/ — equivalente a leer un archivo de configuración
    const res = await fetch('/data/config.json')
    const config = await res.json()

    const hashIngresado = await hashSHA256(clave.value)

    // Busca usuario que coincida — como un .FirstOrDefault() en LINQ
    const usuario = config.usuarios.find(
      u => u.correo === correo.value && u.clave === hashIngresado
    )

    if (usuario) {
      // Guarda sesión en localStorage — equivalente a Session["user"] en ASP.NET
      localStorage.setItem('orgtracker_user', JSON.stringify({ correo: usuario.correo }))
      router.push('/organizaciones')
    } else {
      error.value = 'Correo o contraseña incorrectos.'
    }
  } catch (e) {
    error.value = 'No se pudo cargar la configuración.'
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-sm p-8">

      <!-- Encabezado -->
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-semibold text-gray-800">OrgTracker</h1>
        <p class="text-sm text-gray-500 mt-1">Ingresa tus credenciales</p>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="iniciarSesion" class="space-y-5">

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            v-model="correo"
            type="email"
            required
            placeholder="admin@orgtracker.com"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            v-model="clave"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Mensaje de error -->
        <p v-if="error" class="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          {{ error }}
        </p>

        <button
          type="submit"
          :disabled="cargando"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
                 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {{ cargando ? 'Verificando...' : 'Ingresar' }}
        </button>

      </form>
    </div>
  </div>
</template>