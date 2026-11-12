<template>
    <main class="mx-auto max-w-6xl px-6 py-10">
      <div class="mb-8 flex gap-2">
        <div class="relative flex-1 max-w-md">
          <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Buscar productos..."
            class="h-10 w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none transition-colors"
          />
        </div>
        <button
          @click="handleSearch"
          class="h-10 px-4 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition-colors"
        >
          Buscar
        </button>
        <button
          v-if="hasSearched"
          @click="clearSearch"
          class="h-10 px-4 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          Limpiar
        </button>
      </div>

      <div v-if="loadingProducts" class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div v-for="n in 8" :key="n" class="flex flex-col gap-3">
          <div class="aspect-square w-full rounded-xl bg-neutral-200 animate-pulse"></div>
          <div class="h-3 w-1/2 rounded bg-neutral-200 animate-pulse"></div>
          <div class="h-3 w-3/4 rounded bg-neutral-200 animate-pulse"></div>
        </div>
      </div>

      <div
        v-else-if="filteredProducts.length > 0"
        class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        <article
          v-for="product in filteredProducts"
          :key="product.id"
          class="group flex flex-col cursor-pointer"
          @click="openProductDetail(product)"
        >
          <div class="relative aspect-square w-full overflow-hidden rounded-xl border border-neutral-200/70 bg-neutral-100">
            <img
              :src="product.images[0]"
              :alt="product.title"
              loading="lazy"
              class="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <span v-if="product.brand" class="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-semibold text-neutral-800 border border-neutral-200/60 shadow-xs">
              {{ product.brand }}
            </span>
          </div>

          <!-- Información minimalista -->
          <div class="mt-3.5 flex items-start justify-between gap-2">
            <div>
              <span class="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
                {{ product.category }}
              </span>
              <h2 class="mt-0.5 text-sm font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors">
                {{ product.title }}
              </h2>
              <div class="mt-1 flex items-center gap-1">
                <span v-for="star in 5" :key="star" class="text-[11px]" :class="star <= Math.round(product.rating) ? 'text-amber-400' : 'text-neutral-300'">★</span>
                <span class="text-[10px] text-neutral-400 ml-0.5">{{ product.rating?.toFixed(1) }}</span>
              </div>
            </div>
            <p class="text-sm font-medium tabular-nums text-neutral-900 shrink-0">
              ${{ product.price.toFixed(2) }}
            </p>
          </div>
        </article>
      </div>

      <div
        v-else
        class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-20 text-center bg-white"
      >
        <div class="rounded-full bg-neutral-100 p-3 mb-3 text-neutral-400">
          <i data-lucide="package-open" class="h-6 w-6"></i>
        </div>
        <p class="text-sm font-medium text-neutral-900">Sin resultados</p>
        <p class="mt-1 text-xs text-neutral-500 max-w-xs">
          No encontramos productos que coincidan con los filtros seleccionados.
        </p>
        <button
          @click="resetFilters"
          class="mt-4 rounded-lg border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          Limpiar filtros
        </button>
      </div>

      <div v-if="totalPages > 1 && !loadingProducts" class="mt-10 flex items-center justify-center gap-1">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="h-8 w-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft class="h-4 w-4" />
        </button>

        <button
          v-for="page in pagesToShow"
          :key="page"
          @click="page !== '...' && goToPage(page)"
          :class="[
            'h-8 min-w-8 px-2 rounded-lg text-xs font-medium transition-colors',
            page === currentPage ? 'bg-neutral-900 text-white' : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50',
            page === '...' ? 'cursor-default border-none' : ''
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="h-8 w-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight class="h-4 w-4" />
        </button>
      </div>
    </main>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useProductsStore } from '@/stores/products';
import { computed, onMounted, ref } from 'vue';
import { Search, ChevronLeft, ChevronRight } from 'lucide-vue-next';

const productsStore = useProductsStore();
const loadingProducts = computed(() => productsStore.loadingProducts);
const filteredProducts = computed(() => productsStore.products);
const totalPages = computed(() => Math.ceil(productsStore.total / productsStore.limit))

const searchQuery = ref('')
const hasSearched = ref(false)
const currentPage = ref(1)

const pagesToShow = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total]
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
})

const goToPage = (page) => {
  currentPage.value = page
  if (hasSearched.value) {
    productsStore.SEARCH_PRODUCTS(searchQuery.value.trim(), page)
  } else {
    productsStore.GET_PRODUCTS(page)
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSearch = () => {
  currentPage.value = 1
  productsStore.SEARCH_PRODUCTS(searchQuery.value.trim(), 1)
  hasSearched.value = true
}

const clearSearch = () => {
  searchQuery.value = ''
  hasSearched.value = false
  currentPage.value = 1
  productsStore.GET_PRODUCTS(1)
}

const router = useRouter();

const openProductDetail = (product) => {
  router.push({ name: 'product-detail', params: { id: product.id } });
}

onMounted(() => {
  productsStore.GET_PRODUCTS();
});
</script>
