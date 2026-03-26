<script setup>
import { ref, computed, onMounted } from 'vue'

const productos  = ref([])
const cargando   = ref(true)
const busqueda   = ref('')

onMounted(async () => {
  const res = await fetch('/data/productos.json')
  productos.value = await res.json()
  cargando.value = false
})

// Filtra por descripción o código — como .Where() en LINQ
const productosFiltrados = computed(() => {
  return productos.value.filter(p =>
    p.descripcion.toLowerCase().includes(busqueda.value.toLowerCase()) ||
    p.codigo.toLowerCase().includes(busqueda.value.toLowerCase())
  )
})
</script>

<template>
  <div>

    <!-- Encabezado -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-800">Productos</h2>
      <button class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
        + Nuevo producto
      </button>
    </div>

    <!-- Filtro -->
    <div class="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex items-center gap-4">
      <input
        v-model="busqueda"
        type="text"
        placeholder="Buscar por nombre o código..."
        class="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64
               focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <span class="text-sm text-gray-400 ml-auto">
        {{ productosFiltrados.length }} producto{{ productosFiltrados.length !== 1 ? 's' : '' }}
      </span>
    </div>

    <!-- Tabla -->
    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">

      <div v-if="cargando" class="p-8 text-center text-gray-400 text-sm">
        Cargando...
      </div>

      <div v-else-if="productosFiltrados.length === 0" class="p-8 text-center text-gray-400 text-sm">
        No hay productos que coincidan con la búsqueda.
      </div>

      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="text-left px-4 py-3 text-gray-500 font-medium">Código</th>
            <th class="text-left px-4 py-3 text-gray-500 font-medium">Descripción</th>
            <th class="text-right px-4 py-3 text-gray-500 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="p in productosFiltrados" :key="p.codigo" class="hover:bg-gray-50 transition-colors">
            <td class="px-4 py-3 font-mono text-gray-500">{{ p.codigo }}</td>
            <td class="px-4 py-3 font-medium text-gray-800">{{ p.descripcion }}</td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-2">
                <button class="text-xs text-blue-600 hover:text-blue-800 font-medium">Editar</button>
                <button class="text-xs text-red-500 hover:text-red-700 font-medium">Eliminar</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>