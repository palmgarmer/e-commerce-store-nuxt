<template>
  <div class="products-page">
    <div class="container">
      <div class="products-header">
        <h1>Products</h1>
        <p>Discover our wide range of products</p>
      </div>

      <div class="products-controls">
        <div class="search-section" style="grid-column: 1 / -1">
          <h3>Search Products</h3>
          <input
            v-model="searchTerm"
            type="text"
            class="form-input"
            placeholder="Search product title"
          />
          <button v-if="searchTerm" @click="clearSearch" class="clear-search">
            Clear Search
          </button>
        </div>

        <div class="filters-section">
          <!-- <div class="filters-section">
          <div class="filters-placeholder">
            <h3>🎛️ Filters Missing</h3>
            <p>Implement the following filters:</p>
            <ul>
              //<li>Category filter (dropdown)</li>
              //<li>Price range filter (slider or inputs)</li>
              <li>Brand filter (checkbox list)</li>
              <li>Rating filter (star rating)</li>
              <li>Sort options (price, rating, popularity)</li>
            </ul>
          </div> -->
          <h3>Filter</h3>
          <div class="filter-group">
            <label for="category">Category</label>
            <div class="select-wrapper">
              <select v-model="selectedCategory" name="category" id="category" class="form-input">
                <option value="">All Categories</option>
                <option
                  v-for="category in categories"
                  :key="getCategoryKey(category)"
                  :value="getCategoryValue(category)"
                >
                  {{ getCategoryLabel(category) }}
                </option>
              </select>
              <span class="select-arrow"></span>
            </div>
          </div>

          <div class="filter-group">
            <label>Price Range</label>
            <div class="price-range-container">
              <div class="price-input-group">
                <input
                  v-model.number="priceRange.min"
                  type="number"
                  class="form-input price-input"
                  placeholder="Min Price"
                  :min="0"
                />
                <span class="price-separator">-</span>
                <input
                  v-model.number="priceRange.max"
                  type="number"
                  class="form-input price-input"
                  placeholder="Max Price"
                  :min="0"
                />
              </div>
              <div class="price-range-info">
                <!-- <small>Available range: ${{ actualPriceRange.min }} - ${{ actualPriceRange.max }}</small> -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Filters Display -->
      <!-- <div v-if="selectedCategory || searchTerm" class="active-filters">
        <h4>Active Filters:</h4>
        <div class="filter-tags">
          <span v-if="selectedCategory" class="filter-tag">
            Category: {{ selectedCategory }}
            <button @click="clearCategory" class="remove-filter">×</button>
          </span>
          <span v-if="searchTerm" class="filter-tag">
            Search: "{{ searchTerm }}"
            <button @click="clearSearch" class="remove-filter">×</button>
          </span>
        </div>
      </div> -->

      <div class="products-content">
        <div class="products-header-info">
          <h2>Products</h2>
          <div class="results-info">
            <span v-if="!loading">
              {{ totalProducts }} products found
              <span v-if="selectedCategory"> in {{ selectedCategory }}</span>
              <span v-if="searchTerm"> for "{{ searchTerm }}"</span>
            </span>
          </div>
        </div>

        <div v-if="loading" class="loading-container">
          <div class="spinner"></div>
          <p>Loading products...</p>
        </div>

        <div v-else-if="error" class="alert alert-error">
          {{ error }}
        </div>

        <div v-else-if="products.length === 0" class="no-results">
          <h3>No products found</h3>
          <p v-if="selectedCategory || searchTerm">
            Try adjusting your filters or
            <button @click="clearAllFilters" class="link-button">
              clear all filters
            </button>
          </p>
          <p v-else>No products available at the moment.</p>
        </div>

        <div v-else class="products-grid">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
          />
        </div>

        <div v-if="totalPages > 1" class="pagination-container">
          <div class="pagination">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="pagination-btn"
            >
              Previous
            </button>

            <div class="pagination-numbers">
              <button
                v-if="currentPage > 3"
                @click="goToPage(1)"
                class="pagination-number"
              >
                1
              </button>

              <span v-if="currentPage > 4" class="pagination-ellipsis"
                >...</span
              >

              <button
                v-for="page in getVisiblePages()"
                :key="page"
                @click="goToPage(page)"
                :class="['pagination-number', { active: page === currentPage }]"
              >
                {{ page }}
              </button>

              <span
                v-if="currentPage < totalPages - 3"
                class="pagination-ellipsis"
                >...</span
              >

              <button
                v-if="currentPage < totalPages - 2"
                @click="goToPage(totalPages)"
                class="pagination-number"
              >
                {{ totalPages }}
              </button>
            </div>

            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="pagination-btn"
            >
              Next
            </button>
          </div>

          <div class="pagination-info">
            Page {{ currentPage }} of {{ totalPages }} ({{
              (currentPage - 1) * pageSize + 1
            }}-{{ Math.min(currentPage * pageSize, totalProducts) }} of
            {{ totalProducts }})
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "~/types";

const { getAllProducts, getCategories, searchProducts, getProductsByCategory } =
  useProducts();
const products = ref<Product[]>([]);
const categories = ref<string[]>([]);
const loading = ref(false);
const error = ref(null);

const currentPage = ref(1);
const pageSize = 20;
const totalPages = ref(1);
const totalProducts = ref(0);

const searchTerm = ref("");
const selectedCategory = ref("");

const priceRange = ref({
  min: null as number | null,
  max: null as number | null,
});

// To store the actual min/max price of all available products
const actualPriceRange = ref({
  min: 0,
  max: 0,
});

const allProducts = ref<Product[]>([]); // Cache for client-side filtering

const isPriceFilterActive = computed(() => {
  return (
    (priceRange.value.min !== null &&
      priceRange.value.min !== actualPriceRange.value.min) ||
    (priceRange.value.max !== null &&
      priceRange.value.max !== actualPriceRange.value.max)
  );
});

const getCategoryKey = (category: any) => {
  return typeof category === "object" ? category.id || category.name : category;
};

const getCategoryValue = (category: any) => {
  return typeof category === "object" ? category.slug : String(category);
};

const getCategoryLabel = (category: any) => {
  return typeof category === "object" ? category.name : String(category);
};

const clearSearch = () => {
  searchTerm.value = "";
  fetchProducts(true);
};

const clearAllFilters = () => {
  selectedCategory.value = "";
  searchTerm.value = "";
  priceRange.value.min = null;
  priceRange.value.max = null;
  fetchProducts(true);
};

const fetchProducts = async (resetPage = false) => {
  if (resetPage) {
    currentPage.value = 1;
  }
  loading.value = true;
  error.value = null;

  try {
    const skip = (currentPage.value - 1) * pageSize;
    let response;
    let allFetchedProducts: Product[] = [];

    const fetchParams: any = {
      limit: 1000,
      skip: 0,
    };

    if (categories.value.length === 0) {
      const categoriesData = await getCategories();
      categories.value = categoriesData;
    }

    if (selectedCategory.value && searchTerm.value.trim()) {
      response = await getProductsByCategory(
        selectedCategory.value,
        fetchParams
      );
      if (response.products) {
        allFetchedProducts = response.products.filter((product) =>
          product.title.toLowerCase().includes(searchTerm.value.toLowerCase())
        );
      }
    } else if (selectedCategory.value && !searchTerm.value.trim()) {
      response = await getProductsByCategory(
        selectedCategory.value,
        fetchParams
      );
      allFetchedProducts = response.products || [];
    } else if (!selectedCategory.value && searchTerm.value.trim()) {
      response = await searchProducts(searchTerm.value, fetchParams);
      allFetchedProducts = response.products || [];
    } else {
      if (allProducts.value.length === 0) {
        response = await getAllProducts(fetchParams);
        allProducts.value = response.products || [];
        const prices = allProducts.value.map(p => p.price);
        actualPriceRange.value.min = Math.min(...prices);
        actualPriceRange.value.max = Math.max(...prices);
      }
      allFetchedProducts = allProducts.value;
    }

    let filteredProducts = allFetchedProducts;
    if (isPriceFilterActive.value) {
      filteredProducts = allFetchedProducts.filter((product) => {
        const price = product.price;
        const minCheck =
          priceRange.value.min === null || price >= priceRange.value.min;
        const maxCheck =
          priceRange.value.max === null || price <= priceRange.value.max;
        return minCheck && maxCheck;
      });
    }

    totalPages.value = Math.ceil(totalProducts.value / pageSize);
    products.value = filteredProducts.slice(skip, skip + pageSize);

  } catch (err) {
    console.error("Failed to load products:", err);
    products.value = [];
    totalProducts.value = 0;
    totalPages.value = 0;
  } finally {
    loading.value = false;
  }
};

// Debounced
let searchTimeout: ReturnType<typeof setTimeout> | null = null;
let priceTimeout: ReturnType<typeof setTimeout> | null = null;

const debouncedSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(() => {
    fetchProducts(true);
  }, 500);
};

const debouncedPriceFilter = () => {
  if (priceTimeout) {
    clearTimeout(priceTimeout);
  }
  priceTimeout = setTimeout(() => {
    fetchProducts(true);
  }, 800); // Longer debounce for price inputs
};

watch(searchTerm, () => {
  debouncedSearch();
});

watch(selectedCategory, () => {
  fetchProducts(true);
});

watch(
  priceRange,
  () => {
    debouncedPriceFilter();
  },
  { deep: true }
);

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchProducts();
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchProducts();
  }
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page;
    fetchProducts();
  }
};

const getVisiblePages = () => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
};

// Clear category filter
// const clearCategory = () => {
//   selectedCategory.value = "";
// };

// Initial load
onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.products-page {
  padding: 2rem 0;
}

.products-header {
  text-align: center;
  margin-bottom: 3rem;
}

.products-header h1 {
  margin-bottom: 0.5rem;
}

.products-header p {
  color: var(--text-light);
}

.products-header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.results-info {
  color: var(--text-light);
  font-size: 0.9rem;
}

.products-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.search-section,
.filters-section {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  grid-column: 1 / -1;
}

.search-placeholder,
.filters-placeholder {
  background-color: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: var(--border-radius);
  padding: 1.5rem;
}

.search-placeholder h3,
.filters-placeholder h3 {
  color: #92400e;
  margin-bottom: 1rem;
}

.search-placeholder p,
.filters-placeholder p {
  color: #92400e;
  margin-bottom: 1rem;
}

.search-placeholder ul,
.filters-placeholder ul {
  color: #92400e;
  margin-left: 1.5rem;
}

.search-placeholder li,
.filters-placeholder li {
  margin-bottom: 0.5rem;
}

.search-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: #f3f4f6;
  border-radius: 4px;
  font-size: 0.875rem;
}

.clear-search {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.875rem;
}

.clear-search:hover {
  color: var(--primary-color-dark);
}

.products-content {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 3rem;
  box-shadow: var(--shadow-sm);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.products-grid-placeholder {
  background-color: #dbeafe;
  border: 1px solid #3b82f6;
  border-radius: var(--border-radius);
  padding: 2rem;
  text-align: center;
}

.products-grid-placeholder h3 {
  color: #1e40af;
  margin-bottom: 1rem;
}

.products-grid-placeholder p {
  color: #1e40af;
  margin-bottom: 1rem;
}

.products-grid-placeholder ul {
  color: #1e40af;
  margin-left: 1.5rem;
  text-align: left;
}

.products-grid-placeholder li {
  margin-bottom: 0.5rem;
}

.price-range-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.price-input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-input {
  flex: 1;
  min-width: 100px;
}

.price-separator {
  color: var(--text-light);
  font-weight: 500;
}

.price-range-info {
  color: var(--text-light);
  font-size: 0.8rem;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: var(--text-light);
}

.link-button {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  text-decoration: underline;
}

.pagination-container {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-number {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-number:hover {
  background-color: #f5f5f5;
}

.pagination-number.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.pagination-ellipsis {
  padding: 0 0.5rem;
  color: var(--text-light);
}

.pagination-info {
  color: var(--text-light);
  font-size: 0.9rem;
  text-align: center;
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  gap: 1rem;
}

.loading-container p {
  color: var(--text-light);
}

.active-filters {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-bottom: 2rem;
}

.active-filters h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-dark);
  font-size: 0.9rem;
}

.filter-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-tag {
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.remove-filter {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.remove-filter:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.clear-category {
  margin-top: 0.5rem;
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.875rem;
}

.clear-category:hover {
  color: var(--primary-color-dark);
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  background-color: #fff;
  color: var(--text-dark);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-dark);
}

.select-wrapper {
  position: relative;
}

.select-wrapper .form-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  padding-right: 2.5rem; /* Make space for the arrow */
  cursor: pointer;
}

.select-arrow {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #6b7280; /* Arrow color */
  pointer-events: none;
  transition: transform 0.2s ease;
}

.select-wrapper .form-input:focus + .select-arrow {
  transform: translateY(-50%) rotate(180deg);
}

@media (max-width: 768px) {
  .products-header-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .pagination {
    flex-wrap: wrap;
    justify-content: center;
  }

  .pagination-numbers {
    order: -1;
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .products-controls {
    grid-template-columns: 1fr;
  }
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
