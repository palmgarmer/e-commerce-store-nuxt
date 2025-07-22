<template>
  <div class="products-page">
    <div class="container">
      <div class="products-header">
        <h1>Products</h1>
        <p>Discover our wide range of products</p>
      </div>

      <div class="products-controls">
        <div class="search-section">
          <h3>Search Products</h3>
          
          <div class="search-autocomplete-container" ref="searchContainer">
            <input
              v-model="searchTerm"
              type="text"
              class="form-input search-input"
              placeholder="Search product title"
              @input="handleSearchInput"
              @focus="showAutocomplete = true"
              @keydown="handleKeydown"
              @blur="handleSearchBlur"
            />
            
            <button 
              v-if="searchTerm" 
              @click="clearSearch" 
              class="clear-search-btn"
            >
              ×
            </button>
            
            <div 
              v-if="showAutocomplete && (autocomplete.length > 0 || isSearching)"
              class="autocomplete-dropdown"
            >
              <div v-if="isSearching" class="autocomplete-loading">
                <div class="loading-spinner"></div>
                <span>Searching...</span>
              </div>
              
              <div v-else-if="autocomplete.length > 0" class="autocomplete-results">
                <div
                  v-for="(suggestion, index) in autocomplete"
                  :key="index"
                  @click="selectSuggestion(suggestion)"
                  @mouseenter="highlightedIndex = index"
                  class="autocomplete-item"
                  :class="{ 'highlighted': index === highlightedIndex }"
                >
                  <div class="search-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <span class="suggestion-text" v-html="highlightMatch(suggestion, searchTerm)"></span>
                </div>
              </div>
              
              <div v-else-if="searchTerm.trim()" class="autocomplete-no-results">
                <span>No suggestions found for "{{ searchTerm }}"</span>
              </div>
            </div>
          </div>
          
          <div v-if="searchTerm" class="search-info">
            <span>Searching for: <strong>"{{ searchTerm }}"</strong></span>
            <button @click="clearSearch" class="clear-search">Clear Search</button>
          </div>
        </div>
        
        <div class="filters-section">
          <div class="filters-header">
              <h3>Filters</h3>
            <button @click="showFilters = !showFilters" class="toggle-filters-btn">
              <span class="toggle-text">{{ showFilters ? 'Hide' : 'Show' }}</span>
            </button>
          </div>
          
          <div v-if="showFilters" class="filters-content">
            <div class="filter-group">
              <h4>Category</h4>
              <div class="select-wrapper">
                <select
                  v-model="selectedCategory"
                  name="category"
                  id="category"
                  class="form-input"
                >
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
              <h4>Price Range</h4>
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
                  <small
                    >Available range: ${{ actualPriceRange.min }} - ${{
                      actualPriceRange.max
                    }}</small
                  >
                </div>
              </div>
            </div>

            <div class="filter-group">
              <h4>Brand</h4>
              <div class="filter-options-list">
                <div
                  v-for="brand in displayedBrands"
                  :key="brand"
                  class="checkbox-item"
                >
                  <input
                    type="checkbox"
                    :id="`brand-${brand}`"
                    :value="brand"
                    v-model="selectedBrands"
                  />
                  
                  <label :for="`brand-${brand}`">{{" "}}{{ brand }}</label>
                </div>
              </div>
               <button
                v-if="availableBrands.length > initialBrandLimit"
                @click="toggleBrands"
                class="see-more-btn"
              >
                {{ brandsExpanded ? 'See Less' : `See More (${availableBrands.length - initialBrandLimit})` }}
              </button>
            </div>

            <div class="filter-group">
              <h4>Sort By</h4>
              <div class="select-wrapper">
                <select
                  v-model="sortBy"
                  name="sortBy"
                  id="sortBy"
                  class="form-input"
                >
                  <option
                    v-for="option in sortOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
                <span class="select-arrow"></span>
              </div>
            </div>

            <div class="filter-group">
              <h4>Rating</h4>
              <div class="star-rating-filter" @mouseleave="hoverRating = 0">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="star"
                  @click="setRating(star)"
                  @mouseover="hoverRating = star"
                  :class="{ 'filled': star <= (hoverRating || selectedRating) }"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                </span>
              </div>
              <button v-if="selectedRating > 0" @click="clearRatingFilter" class="clear-rating-btn">
                Clear Rating
              </button>
            </div>
          </div>
        </div>

      </div>

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
import { computed, onMounted, ref, watch } from 'vue';
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
const selectedBrands = ref<string[]>([]);
const sortBy = ref<string>('');


const sortOptions = [
  { value: '', label: 'Default' },
  { value: 'price', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating: High to Low' },
  { value: 'rating-asc', label: 'Rating: Low to High' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' }
];

const priceRange = ref({
  min: null as number | null,
  max: null as number | null,
});

const actualPriceRange = ref({
  min: 0,
  max: 0,
});

const allProducts = ref<Product[]>([]);

const showFilters = ref(true);

const brandsExpanded = ref(false);
const initialBrandLimit = 3;

const selectedRating = ref(0);
const hoverRating = ref(0);

const autocomplete = ref<string[]>([]);

const showAutocomplete = ref(false)
const isSearching = ref(false)
const highlightedIndex = ref(-1)
const searchContainer = ref<HTMLElement>()

const searchAutocomplete = async (query: string) => {
  if (!query.trim()) {
    autocomplete.value = [];
    return;
  }

  try {
    const response = await searchProducts(query, { limit: 10 });
    autocomplete.value = response.products.map(p => p.title);
  } catch (err) {
    console.error("Autocomplete search failed:", err);
    autocomplete.value = [];
  }
};

const availableBrands = computed(() => {
  if (!allProducts.value.length) return [];
  const brands = new Set(
    allProducts.value
      .map((p) => p.brand)
      .filter((brand) => brand && brand.trim() !== "")
  );
  return Array.from(brands).sort();
});

const displayedBrands = computed(() => {
  if (brandsExpanded.value) {
    return availableBrands.value;
  }
  return availableBrands.value.slice(0, initialBrandLimit);
});

const toggleBrands = () => {
  brandsExpanded.value = !brandsExpanded.value;
};

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

function setRating(rating: number) {
  if (selectedRating.value === rating) {
    selectedRating.value = 0;
  } else {
    selectedRating.value = rating;
  }
}

function clearRatingFilter() {
  selectedRating.value = 0;
}

const clearSearch = () => {
  searchTerm.value = "";
  autocomplete.value = []
  hideAutocomplete()
  fetchProducts(true);
};

const clearAllFilters = () => {
  selectedCategory.value = "";
  searchTerm.value = "";
  selectedBrands.value = [];
  priceRange.value.min = null;
  priceRange.value.max = null;
  selectedRating.value = 0;
  sortBy.value = ''; 
  fetchProducts(true);
};

const calculatePopularity = (product: Product) => {
  const weights = {
    rating: 0.4,        
    reviews: 0.3,       
    sales: 0.3          
  };

  const ratingScore = (product.rating / 5) * 100; 
  
  const maxReviews = 1000;
  const reviewScore = Math.min((product.reviews.length || 0) / maxReviews * 100, 100); 

  const salesScore = (product.discountPercentage || 0) * 2; 

  const popularityScore = 
    (ratingScore * weights.rating) +
    (reviewScore * weights.reviews) +
    (salesScore * weights.sales);

  return popularityScore;
};

const sortProducts = (products: Product[]) => {
  if (!sortBy.value) return products;

  const sorted = [...products].sort((a, b) => {
    switch (sortBy.value) {
      case 'price':
        return a.price - b.price;
      
      case 'price-desc':
        return b.price - a.price;
      
      case 'rating':
        return b.rating - a.rating;
      
      case 'rating-asc':
        return a.rating - b.rating;
      
      case 'popularity':
        const aPopularity = calculatePopularity(a);
        const bPopularity = calculatePopularity(b);
        return bPopularity - aPopularity;
      
      case 'newest':
        return b.id - a.id; 
      
      default:
        return 0;
    }
  });

  return sorted;
};

const fetchProducts = async (resetPage = false) => {
  if (resetPage) {
    currentPage.value = 1;
  }
  loading.value = true;
  error.value = null;

  try {
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
        const prices = allProducts.value.map((p) => p.price);
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

    if (selectedBrands.value.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        selectedBrands.value.includes(product.brand)
      );
    }

    if (selectedRating.value > 0) {
      filteredProducts = filteredProducts.filter(product => 
        product.rating >= selectedRating.value
      );
    }

    filteredProducts = sortProducts(filteredProducts);

    totalProducts.value = filteredProducts.length;
    totalPages.value = Math.ceil(totalProducts.value / pageSize);

    if (currentPage.value > totalPages.value) {
      currentPage.value = 1;
    }
    
    const skip = (currentPage.value - 1) * pageSize;
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

let searchTimeout: ReturnType<typeof setTimeout> | null = null;
let priceTimeout: ReturnType<typeof setTimeout> | null = null;

let autocompleteTimeout: ReturnType<typeof setTimeout> | null = null

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
  }, 800);
};

const debouncedAutocomplete = () => {
  if (autocompleteTimeout) {
    clearTimeout(autocompleteTimeout)
  }
  
  autocompleteTimeout = setTimeout(async () => {
    if (searchTerm.value.trim()) {
      isSearching.value = true
      showAutocomplete.value = true
      
      try {
        await searchAutocomplete(searchTerm.value)
      } catch (error) {
        console.error('Autocomplete error:', error)
        autocomplete.value = []
      } finally {
        isSearching.value = false
      }
    }
  }, 300)
}

watch(searchTerm, () => {
  handleSearchInput()
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

watch(
  selectedBrands,
  () => {
    fetchProducts(true);
  },
  { deep: true }
);

watch(selectedRating, () => {
  fetchProducts(true);
});

watch(sortBy, () => {
  fetchProducts(true);
});

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

const handleSearchInput = () => {
  highlightedIndex.value = -1
  
  if (searchTerm.value.trim()) {
    debouncedAutocomplete()
  } else {
    autocomplete.value = []
    showAutocomplete.value = false
  }
  
  debouncedSearch()
}

const handleSearchBlur = () => {
  setTimeout(() => {
    hideAutocomplete()
  }, 150)
}

const selectSuggestion = (suggestion: string) => {
  searchTerm.value = suggestion
  hideAutocomplete()
  fetchProducts(true)
}

const hideAutocomplete = () => {
  showAutocomplete.value = false
  highlightedIndex.value = -1
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!showAutocomplete.value || autocomplete.value.length === 0) {
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, autocomplete.value.length - 1)
      break
      
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1)
      break
      
    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0 && highlightedIndex.value < autocomplete.value.length) {
        selectSuggestion(autocomplete.value[highlightedIndex.value])
      } else if (searchTerm.value.trim()) {
        hideAutocomplete()
        fetchProducts(true)
      }
      break
      
    case 'Escape':
      event.preventDefault()
      hideAutocomplete()
      break
  }
}

const highlightMatch = (text: string, query: string): string => {
  if (!query.trim()) return text
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

const handleClickOutside = (event: Event) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target as Node)) {
    hideAutocomplete()
  }
}

onMounted(() => {
  fetchProducts()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Initial load
onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.products-page {
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
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

.search-section,
.filters-section,
.products-content {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
}

.search-section,
.filters-section {
  grid-column: 1 / -1;
}

.products-content {
  padding: 3rem;
}

.products-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  margin: -1rem -1rem 1.5rem -1rem;
}

.filters-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filters-title h3 {
  margin: 0;
  color: var(--text-dark);
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.025em;
}

.filters-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding-top: 0.5rem;
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-group label,
.filter-group h4 {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-dark);
}

.toggle-filters-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-dark);
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.toggle-filters-btn:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.clear-search,
.clear-category,
.see-more-btn,
.clear-rating-btn,
.link-button {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  font-size: 0.875rem;
}

.clear-search:hover,
.clear-category:hover,
.see-more-btn:hover,
.clear-rating-btn:hover,
.link-button:hover {
  color: var(--primary-color-dark);
}

.see-more-btn,
.clear-rating-btn {
  margin-top: 0.75rem;
}

.clear-category {
  margin-top: 0.5rem;
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

.select-wrapper {
  position: relative;
}

.select-wrapper .form-input {
  appearance: none;
  padding-right: 2.5rem;
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
  border-top: 6px solid #6b7280;
  pointer-events: none;
  transition: transform 0.2s ease;
}

.select-wrapper .form-input:focus + .select-arrow {
  transform: translateY(-50%) rotate(180deg);
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

.star-rating-filter {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.star {
  cursor: pointer;
  color: #e5e7eb;
  transition: color 0.2s, transform 0.1s;
  display: inline-block;
}

.star:hover {
  transform: scale(1.1);
}

.star.filled {
  color: #f59e0b;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: var(--text-light);
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
  color: var(--text-dark);
  font-size: 0.875rem;
  font-weight: 500;
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

.search-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
  padding: 0.75rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
}

.search-info strong {
  color: #1f2937;
}

/* Search Autocomplete Styles */
.search-autocomplete-container {
  position: relative;
  width: 100%;
}

.search-input {
  padding-right: 2.5rem; /* Space for clear button */
  position: relative;
}

.clear-search-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  z-index: 10;
}

.clear-search-btn:hover {
  background-color: #f3f4f6;
  color: #374151;
}

.autocomplete-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 50;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 0.25rem;
}

.autocomplete-loading {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.autocomplete-results {
  padding: 0.5rem 0;
}

.autocomplete-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.autocomplete-item:hover,
.autocomplete-item.highlighted {
  background-color: #f8fafc;
}

.autocomplete-item .search-icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
  flex-shrink: 0;
}

.suggestion-text {
  flex: 1;
  font-size: 0.875rem;
  color: #374151;
}

.suggestion-text :deep(mark) {
  background-color: #fef3c7;
  color: #d97706;
  font-weight: 600;
  padding: 0 0.125rem;
  border-radius: 2px;
}

.autocomplete-no-results {
  padding: 1rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  font-style: italic;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .autocomplete-dropdown {
    max-height: 250px;
  }
  
  .autocomplete-item {
    padding: 0.625rem 0.875rem;
  }
  
  .suggestion-text {
    font-size: 0.8125rem;
  }
}

/* ... rest of existing styles ... */
</style>