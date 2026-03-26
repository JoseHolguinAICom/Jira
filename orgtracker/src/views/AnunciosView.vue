<script setup>
import { ref, computed, onMounted } from 'vue'

const anuncios  = ref([])
const productos = ref([])
const cargando  = ref(true)
const filtroEnviado = ref('todos') // 'todos' | 'enviado' | 'pendiente'

onMounted(async () => {
  const [resAnu, resProd] = await Promise.all([
    fetch('/data/anuncios.json'),
    fetch('/data/productos.json')
  ])
  anuncios.value  = await resAnu.json()
  productos.value = await resProd.json()
  cargando.value  = false
})

// Filtra por estado de envío
const anunciosFiltrados = computed(() => {
  return anuncios.value.filter(a => {
    if (filtroEnviado.value === 'enviado')   return a.enviado === true
    if (filtroEnviado.value === 'pendiente') return a.enviado === false
    return true
  })
})

// Obtiene descripción del producto — igual que en OrganizacionesView
function descProducto(codigo) {
  return productos.value.find(p => p.codigo === codigo)?.descripcion ?? codigo
}

// Formatea fecha legible — equivalente a .ToString("dd/MM/yyyy") en C#
function formatFecha(fecha) {
  if (!fecha) return '—'
  const [y, m, d] = fecha.split('-')
  return `${d}/${m}/${y}`
}

// Cuenta anuncios pendientes para el indicador visual
const pendientes = computed(() => anuncios.value.filter(a => !a.enviado).length)
</script>

<template>
  <div>

    <!-- Encabezado -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <h2 class="text-xl font-semibold text-gray-800">Anuncios</h2>
        <!-- Badge de pendientes -->
        <span v-if="pendientes > 0"
          class="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded-full">
          {{ pendientes }} pendiente{{ pendientes !== 1 ? 's' : '' }}
        </span>
      </div>
      <button class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
        + Nuevo anuncio
      </button>
    </div>

    <!-- Filtro de estado -->
    <div class="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex items-center gap-3">
      <span class="text-sm text-gray-500">Estado:</span>
      <button
        v-for="op in [{ val: 'todos', label: 'Todos' }, { val: 'pendiente', label: 'Pendientes' }, { val: 'enviado', label: 'Enviados' }]"
        :key="op.val"
        @click="filtroEnviado = op.val"
        class="text-sm px-3 py-1 rounded-full transition-colors"
        :class="filtroEnviado === op.val
          ? 'bg-blue-600 text-white'
          : 'text-gray-500 hover:bg-gray-100'"
      >
        {{ op.label }}
      </button>
      <span class="text-sm text-gray-400 ml-auto">
        {{ anunciosFiltrados.length }} anuncio{{ anunciosFiltrados.length !== 1 ? 's' : '' }}
      </span>
    </div>

    <!-- Tabla -->
    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">

      <div v-if="cargando" class="p-8 text-center text-gray-400 text-sm">
        Cargando...
      </div>

      <div v-else-if="anunciosFiltrados.length === 0" class="p-8 text-center text-gray-400 text-sm">
        No hay anuncios que coincidan con el filtro.
      </div>

      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="text-left px-4 py-3 text-gray-500 font-medium">Título</th>
            <th class="text-left px-4 py-3 text-gray-500 font-medium">Producto</th>
            <th class="text-left px-4 py-3 text-gray-500 font-medium">Fecha envío</th>
            <th class="text-left px-4 py-3 text-gray-500 font-medium">Estado</th>
            <th class="text-right px-4 py-3 text-gray-500 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="a in anunciosFiltrados" :key="a.codigo" class="hover:bg-gray-50 transition-colors">

            <td class="px-4 py-3">
              <div class="font-medium text-gray-800">{{ a.titulo }}</div>
              <div class="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{{ a.mensaje }}</div>
            </td>

            <td class="px-4 py-3">
              <span class="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                {{ descProducto(a.codProducto) }}
              </span>
            </td>

            <td class="px-4 py-3 text-gray-600">
              {{ formatFecha(a.fecEnvio) }} {{ a.hora }}
            </td>

            <td class="px-4 py-3">
              <span v-if="a.enviado"
                class="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                Enviado
              </span>
              <span v-else
                class="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded-full">
                Pendiente
              </span>
            </td>

            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-2">
                <button class="text-xs text-blue-600 hover:text-blue-800 font-medium">Ver</button>
                <button class="text-xs text-red-500 hover:text-red-700 font-medium">Eliminar</button>
              </div>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>