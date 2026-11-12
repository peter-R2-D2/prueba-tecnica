# Prueba Técnica — Catálogo de Productos

Aplicación web para explorar un catálogo de productos con búsqueda y paginación, construida con Vue 3 + Vite.

---

## Instalación y ejecución

Requisitos previos: Node.js `^22.18.0` o `>=24.12.0`

```sh
# 1. Instalar dependencias
npm install

# 2. Levantar el servidor de desarrollo
npm run dev
```

La app queda disponible en `http://localhost:5173`

```sh
# Otros comandos útiles
npm run build      # build para producción
npm run preview    # previsualizar el build
npm run lint       # correr el linter
```

---

## Decisiones técnicas

- **Pinia como store**: centralicé toda la lógica de fetching en el store (`products.js`) para que los componentes solo se preocupen de mostrar datos. Así si mañana cambia la API, solo toco un archivo.

- **Paginación en el servidor**: en vez de traer todos los productos y paginar en el frontend, le paso `limit` y `skip` directo a la API. Más eficiente y escala mejor.

- **Búsqueda via API**: usé el endpoint `/products/search?q=` de dummyjson en lugar de filtrar localmente, así el buscador también respeta la paginación correctamente.

- **Tailwind CSS v4**: para los estilos, sin configuración extra. Va directo en el `<style>` del `App.vue` con `@import "tailwindcss"`.

- **lucide-vue-next**: para los íconos, es liviano y tiene buena integración con Vue 3.

---

## Mejoras a futuro

- **Filtros por categoría y precio**: agregarle un panel lateral o un dropdown para filtrar por categoría, rango de precio o rating. La API de dummyjson ya soporta `/products/category/:name`.

- **Carrito de compras**: el botón "Añadir al carrito" en el detalle del producto está ahí pero sin funcionalidad. Implementaría un store de carrito con Pinia y un slide-over para verlo.

- **Skeleton más preciso**: el skeleton de carga actual es genérico. Lo mejoraría para que coincida exactamente con el layout de las cards.

- **Tests**: agregaría tests unitarios para el store (lógica de paginación, búsqueda) y tests e2e con Playwright para los flujos principales.

- **Manejo de errores visible**: ahora los errores solo se loguean en consola. Lo ideal sería mostrarle algo al usuario cuando falla una petición, tipo un toast o un estado de error en la UI.
