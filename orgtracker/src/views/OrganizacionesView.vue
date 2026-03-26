<script setup>
import { ref, computed, onMounted } from 'vue'

// --- Estado ---
const organizaciones = ref([])   // lista completa — como List<Organizacion> en C#
const productos      = ref([])   // catálogo de productos para mostrar descripciones
const cargando       = ref(true)
const filtroPepsico  = ref(false)
const filtroProducto = ref('')
const busqueda       = ref('')

// --- Carga de datos ---
onMounted(async () => {
  // onMounted = equivalente a Page_Load en WebForms o constructor en MVC
  const [resOrgs, resProd] = await Promise.all([
    fetch('/data/organizaciones.json'),
    fetch('/data/productos.json')
  ])
  organizaciones.value = await resOrgs.json()
  productos.value      = await resProd.json()
  cargando.value = false
})

// --- Filtros computed --- equivalente a una propiedad calculada en C#
const orgsFiltradas = computed(() => {
  return organizaciones.value.filter(org => {
    const coincideBusqueda = org.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
      || org.codigo.toLowerCase().includes(busqueda.value.toLowerCase())
    const coincidePepsico  = !filtroPepsico.value || org.indPepsico
    const coincideProducto = !filtroProducto.value || org.productos.includes(filtroProducto.value)
    return coincideBusqueda && coincidePepsico && coincideProducto
  })
})

// Obtiene descripción de un producto por código
function descProducto(codigo) {
  return productos.value.find(p => p.codigo === codigo)?.descripcion ?? codigo
}
</script>

<template>
  <div>

    <!-- Encabezado de sección -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-800">Organizaciones</h2>
      <button class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
        + Nueva organización
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex flex-wrap gap-4 items-center">

      <input
        v-model="busqueda"
        type="text"
        placeholder="Buscar por nombre o código..."
        class="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64
               focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        v-model="filtroProducto"
        class="border border-gray-300 rounded-lg px-3 py-2 text-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todos los productos</option>
        <option v-for="p in productos" :key="p.codigo" :value="p.codigo">
          {{ p.descripcion }}
        </option>
      </select>

      <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
        <input type="checkbox" v-model="filtroPepsico" class="rounded" />
        Solo Pepsico
      </label>

      <span class="text-sm text-gray-400 ml-auto">
        {{ orgsFiltradas.length }} organización{{ orgsFiltradas.length !== 1 ? 'es' : '' }}
      </span>

    </div>

    <!-- Tabla -->
    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">

      <div v-if="cargando" class="p-8 text-center text-gray-400 text-sm">
        Cargando...
      </div>

      <div v-else-if="orgsFiltradas.length === 0" class="p-8 text-center text-gray-400 text-sm">
        No hay organizaciones que coincidan con los filtros.
      </div>

      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="text-left px-4 py-3 text-gray-500 font-medium">Código</th>
            <th class="text-left px-4 py-3 text-gray-500 font-medium">Nombre</th>
            <th class="text-left px-4 py-3 text-gray-500 font-medium">Pepsico</th>
            <th class="text-left px-4 py-3 text-gray-500 font-medium">Productos</th>
            <th class="text-right px-4 py-3 text-gray-500 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="org in orgsFiltradas" :key="org.codigo" class="hover:bg-gray-50 transition-colors">

            <td class="px-4 py-3 font-mono text-gray-500">{{ org.codigo }}</td>

            <td class="px-4 py-3 font-medium text-gray-800">{{ org.nombre }}</td>

            <td class="px-4 py-3">
              <span v-if="org.indPepsico"
                class="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded-full">
                Pepsico
              </span>
            </td>

            <td class="px-4 py-3">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="cod in org.productos"
                  :key="cod"
                  class="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                >
                  {{ descProducto(cod) }}
                </span>
              </div>
            </td>

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