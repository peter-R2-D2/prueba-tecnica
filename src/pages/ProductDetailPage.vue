<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { ArrowLeft, Loader2, ShoppingBag } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const productStore = useProductsStore()

const product = computed(() => productStore.product)
const loading = computed(() => productStore.loadingProduct)

const fetchProductDetails = async () => {
  const paramId = route.params.id
  await productStore.GET_PRODUCT_BY_ID(paramId)
}

const goBack = () => {
  productStore.CLEAR_PRODUCT()
  router.push({ name: 'home' })
}

onMounted(() => {
  fetchProductDetails()
})
</script>

<template>
  <main class="mx-auto max-w-4xl px-6 py-10">
    <!-- Botón para regresar -->
    <button
      @click="goBack"
      class="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-neutral-900 mb-8 transition-colors"
    >
      <ArrowLeft class="h-4 w-4" />
      <span>Volver al catálogo</span>
    </button>

    <!-- Estado de Carga -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-24">
      <Loader2 class="h-6 w-6 animate-spin text-neutral-400" />
      <p class="mt-3 text-xs text-neutral-500">Cargando detalles del producto...</p>
    </div>

    <!-- Estado de Error -->
    <div v-else-if="!product" class="rounded-2xl border border-dashed border-neutral-200 py-20 text-center">
      <p class="text-sm font-medium text-neutral-900">Producto no encontrado</p>
      <p class="mt-1 text-xs text-neutral-500">El ID especificado no corresponde a ningun artículo activo.</p>
    </div>

    <!-- Detalle del Producto -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
      <!-- Imagen -->
      <div class="aspect-square w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
        <img :src="product.images[0]" :alt="product.name" class="h-full w-full object-cover" />
      </div>

      <!-- Información -->
      <div class="flex flex-col justify-between h-full">
        <div>
          <span class="text-xs font-medium uppercase tracking-wider text-neutral-400">
            {{ product.category }}
          </span>
          <h1 class="mt-1 text-2xl font-medium tracking-tight text-neutral-900">
            {{ product.title }}
          </h1>
          <p class="mt-3 text-xl font-medium tabular-nums text-neutral-900">
            ${{ Number(product.price).toFixed(2) }}
          </p>
          <div class="mt-2 flex items-center gap-1">
            <span v-for="star in 5" :key="star" class="text-sm" :class="star <= Math.round(product.rating) ? 'text-amber-400' : 'text-neutral-300'">★</span>
            <span class="text-xs text-neutral-500 ml-1">{{ product.rating?.toFixed(1) }} / 5</span>
          </div>

          <div class="mt-6 border-t border-neutral-200 pt-6">
            <h3 class="text-xs font-medium text-neutral-900 uppercase tracking-wider">Descripción</h3>
            <p class="mt-2 text-sm text-neutral-600 leading-relaxed">
              {{ product.description }}
            </p>
          </div>
        </div>

        <div class="mt-10 pt-6 border-t border-neutral-200">
          <button
            class="w-full inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors"
          >
            <ShoppingBag class="h-4 w-4" />
            <span>Añadir al carrito</span>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
