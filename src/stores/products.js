import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductsStore = defineStore('products', () => {
  // States
  const loadingProducts = ref(false)
  const products = ref([])
  const loadingProduct = ref(false)
  const product = ref(null)
  const searchQuery = ref('')
  const total = ref(0)
  const limit = 12

  // Actions
  async function GET_PRODUCTS(page = 1) {
    try {
      loadingProducts.value = true
      const skip = (page - 1) * limit
      const response = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`)
      const data = await response.json()
      products.value = data.products
      total.value = data.total
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      loadingProducts.value = false
    }
  }

  async function SEARCH_PRODUCTS(query, page = 1) {
    try {
      loadingProducts.value = true
      const skip = (page - 1) * limit
      const response = await fetch(`https://dummyjson.com/products/search?q=${query}&limit=${limit}&skip=${skip}`)
      const data = await response.json()
      products.value = data.products
      total.value = data.total
    } catch (error) {
      console.error('Error searching products:', error)
    } finally {
      loadingProducts.value = false
    }
  }

  async function GET_PRODUCT_BY_ID(id) {
    try {
      loadingProduct.value = true;
      const response = await fetch(`https://dummyjson.com/products/${id}`);
      const data = await response.json();
      console.log('Fetched product by ID:', data);
      product.value = data;
    } catch (error) {
      console.error('Error fetching product by ID:', error)
    } finally {
      loadingProduct.value = false;
    }
  }

  function CLEAR_PRODUCT() {
    product.value = null
  }

  return { loadingProducts, products, total, limit, loadingProduct, product, searchQuery, GET_PRODUCTS, SEARCH_PRODUCTS, GET_PRODUCT_BY_ID, CLEAR_PRODUCT }
})
