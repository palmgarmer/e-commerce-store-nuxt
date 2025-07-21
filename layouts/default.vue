<template>
  <div class="app-layout">
    <header class="app-header">
      <nav class="navbar">
        <div class="container">
          <div class="nav-content">
            <NuxtLink to="/" class="logo">
              <h1>E-Store</h1>
            </NuxtLink>
            
            <div class="nav-menu" :class="{ 'active': mobileMenuOpen }">
              <button class="mobile-menu-close" @click="closeMobileMenu">
                ×
              </button>
              
              <NuxtLink to="/" class="nav-link" @click="closeMobileMenu">Home</NuxtLink>
              <NuxtLink to="/products" class="nav-link" @click="closeMobileMenu">Products</NuxtLink>
              <NuxtLink to="/categories" class="nav-link" @click="closeMobileMenu">Categories</NuxtLink>
              
              <div class="nav-actions">
                <NuxtLink to="/cart" class="nav-icon-link" @click="closeMobileMenu">
                  <CartIcon />
                  <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
                </NuxtLink>
                
                <div v-if="isAuthenticated" class="user-menu">
                  <button @click="toggleUserDropdown" class="user-button">
                    <img v-if="user?.image" :src="user.image" :alt="user.firstName" class="user-avatar">
                    <UserIcon v-else />
                  </button>
                  <div v-if="userDropdownOpen" class="dropdown-menu">
                    <NuxtLink to="/profile" class="dropdown-item" @click="closeDropdowns">Profile</NuxtLink>
                    <NuxtLink to="/orders" class="dropdown-item" @click="closeDropdowns">Orders</NuxtLink>
                    <NuxtLink to="/dashboard" class="dropdown-item" @click="closeDropdowns">Dashboard</NuxtLink>
                    <button @click="logout" class="dropdown-item">Logout</button>
                  </div>
                </div>
                <NuxtLink v-else to="/login" class="btn btn-primary" @click="closeMobileMenu">Login</NuxtLink>
              </div>
            </div>
            
            <button class="mobile-menu-toggle" @click="toggleMobileMenu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>
    </header>

    <main class="app-main">
      <slot />
    </main>

    <footer class="app-footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>About E-Store</h3>
            <p>Your one-stop shop for all your needs. Quality products, great prices, excellent service.</p>
          </div>
          <div class="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><NuxtLink to="/about">About Us</NuxtLink></li>
              <li><NuxtLink to="/contact">Contact</NuxtLink></li>
              <li><NuxtLink to="/terms">Terms & Conditions</NuxtLink></li>
              <li><NuxtLink to="/privacy">Privacy Policy</NuxtLink></li>
            </ul>
          </div>
          <div class="footer-section">
            <h3>Customer Service</h3>
            <ul>
              <li><NuxtLink to="/help">Help Center</NuxtLink></li>
              <li><NuxtLink to="/shipping">Shipping Info</NuxtLink></li>
              <li><NuxtLink to="/returns">Returns</NuxtLink></li>
              <li><NuxtLink to="/faq">FAQ</NuxtLink></li>
            </ul>
          </div>
          <div class="footer-section">
            <h3>Connect With Us</h3>
            <p>Follow us on social media for updates and offers!</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 E-Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const cartStore = useCartStore()
const { isAuthenticated, user } = storeToRefs(authStore)
const { itemCount: cartItemCount } = storeToRefs(cartStore)

const mobileMenuOpen = ref(false)
const userDropdownOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const toggleUserDropdown = () => {
  userDropdownOpen.value = !userDropdownOpen.value
}

const closeDropdowns = () => {
  userDropdownOpen.value = false
  mobileMenuOpen.value = false
}

const logout = async () => {
  await authStore.logout()
  closeDropdowns()
}

// Icons as components
const CartIcon = () => h('svg', { 
  width: '24', 
  height: '24', 
  viewBox: '0 0 24 24', 
  fill: 'none', 
  stroke: 'currentColor' 
}, [
  h('path', { 
    d: 'M9 2L6 6H3L5 20H19L21 6H18L15 2H9Z',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round'
  })
])

const UserIcon = () => h('svg', {
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor'
}, [
  h('circle', { cx: '12', cy: '7', r: '4', 'stroke-width': '2' }),
  h('path', { 
    d: 'M4 21V17C4 15.9 4.9 15 6 15H18C19.1 15 20 15.9 20 17V21',
    'stroke-width': '2',
    'stroke-linecap': 'round'
  })
])

// Close dropdowns on click outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.user-menu')) {
      userDropdownOpen.value = false
    }
  })
})
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: white;
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar {
  padding: 1rem 0;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-icon-link {
  position: relative;
  color: var(--text-color);
  transition: color 0.2s ease;
}

.nav-icon-link:hover {
  color: var(--primary-color);
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: var(--danger-color);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  min-width: 1.25rem;
  text-align: center;
}

.user-menu {
  position: relative;
}

.user-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.user-button:hover {
  background-color: var(--light-color);
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  min-width: 200px;
  overflow: hidden;
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  transition: background-color 0.2s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: var(--light-color);
  color: var(--primary-color);
}

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  flex-direction: column;
  gap: 0.25rem;
}

.mobile-menu-toggle span {
  display: block;
  width: 1.5rem;
  height: 2px;
  background-color: var(--text-color);
  transition: all 0.3s ease;
}

.app-main {
  flex: 1;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.app-footer {
  background-color: var(--dark-color);
  color: white;
  padding: 3rem 0 1rem;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  font-size: 1.125rem;
  margin-bottom: 1rem;
}

.footer-section ul {
  list-style: none;
}

.footer-section li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: #cbd5e1;
  transition: color 0.2s ease;
}

.footer-section a:hover {
  color: white;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #334155;
  color: #94a3b8;
}

/* Mobile Menu Bug - Intentionally broken */
@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: flex;
  }
  
  .nav-menu {
    position: fixed;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100vh;
    background-color: white;
    flex-direction: column;
    padding: 2rem;
    transition: left 0.3s ease;
  }
  
  .nav-menu.active {
    left: 0;
  }
  
  .mobile-menu-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: background-color 0.2s ease;
    color: var(--text-color);
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .mobile-menu-close:hover {
    background-color: var(--light-color);
    color: var(--primary-color);
  }
  
  .nav-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>