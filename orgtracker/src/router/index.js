import { createRouter, createWebHashHistory } from 'vue-router'

import LoginView        from '@/views/LoginView.vue'
import OrganizacionesView from '@/views/OrganizacionesView.vue'
import ProductosView    from '@/views/ProductosView.vue'
import AnunciosView     from '@/views/AnunciosView.vue'

// Guard de autenticación
// Equivalente a [Authorize] en ASP.NET — se ejecuta antes de entrar a la ruta
function requireAuth(to, from, next) {
  const sesion = localStorage.getItem('orgtracker_user')
  if (!sesion) {
    next('/login')   // redirige si no hay sesión
  } else {
    next()           // deja pasar
  }
}

const routes = [
  { path: '/',               redirect: '/organizaciones' },
  { path: '/login',          component: LoginView },
  { path: '/organizaciones', component: OrganizacionesView, beforeEnter: requireAuth },
  { path: '/productos',      component: ProductosView,      beforeEnter: requireAuth },
  { path: '/anuncios',       component: AnunciosView,       beforeEnter: requireAuth },
]

const router = createRouter({
  history: createWebHashHistory(), // URLs con # → funciona en GitHub Pages sin servidor
  routes
})

export default router