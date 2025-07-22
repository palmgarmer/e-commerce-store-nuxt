# E-Commerce Store - Developer Assessment

This is a **Nuxt 3 e-commerce application** that is **80% complete**. Your task is to complete the remaining 20% to demonstrate your frontend development skills.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎯 Your Tasks (20% to Complete)

Use the provided public API endpoints from DummyJSON – no need to set up a backend.

### 1. **Product Catalog Page** (Main Task - `/pages/products/index.vue`)
**Location**: `/pages/products/index.vue`

**Current State**: Placeholder with implementation hints

**Requirements**:
- [x] Implement product grid with responsive design
- [x] Add search functionality with debouncing
- [x] Create category filter (dropdown)
- [x] Add price range filter (slider or inputs)
- [x] Implement brand filter (checkbox list)
- [x] Add rating filter (star rating)
- [x] Create sort options (price, rating, popularity)
- [x] Add pagination or infinite scroll
- [x] Implement grid/list view toggle
- [x] Add loading states and error handling
- [x] Make responsive for mobile devices

**API Endpoints to Use**:
- `GET /products` - Get all products
- `GET /products/search?q=query` - Search products
- `GET /products/categories` - Get categories
- `GET /products/category/[category]` - Get products by category

### 2. **Bug Fixes**

#### [x] Cart Calculation Bug
**Location**: `/stores/cart.ts` (line 18-22)

**Issue**: Cart total calculation is incorrect
```typescript
// Bug: Should multiply by quantity, but we're adding it instead
const itemTotal = item.product.price + item.quantity
```

**Fix**: Change to proper multiplication:
```typescript
const itemTotal = item.product.price * item.quantity
```

#### [x] Mobile Navigation Bug
**Location**: `/layouts/default.vue` (line 229)

**Issue**: Mobile menu doesn't open when hamburger is clicked

**Fix**: The CSS class selector is missing the `.active` state

### 3. **Missing Features**

#### Payment Integration
**Location**: `/pages/checkout.vue`

**Requirements**:
- [ ] Implement credit card form with validation
- [ ] Add payment method selection
- [ ] Create card number formatting
- [ ] Add expiry date and CVV validation
- [ ] Implement billing address form

#### Order Review
**Location**: `/pages/checkout.vue`

**Requirements**:
- [ ] Create order summary with all items
- [ ] Add shipping information review
- [ ] Show payment method summary
- [ ] Add terms and conditions checkbox
- [ ] Implement place order functionality

## 📁 Project Structure

```
/
├── assets/css/          # Global styles
├── components/          # Reusable components
│   └── ProductCard.vue  # Product card component (already complete)
├── composables/         # Composable functions
│   ├── useApi.ts       # API utilities
│   └── useProducts.ts  # Product-related API calls
├── layouts/            # Layout components
│   ├── default.vue     # Main layout
│   ├── auth.vue        # Authentication layout
│   └── dashboard.vue   # Dashboard layout
├── middleware/         # Route middleware
│   ├── auth.ts         # Authentication middleware
│   └── guest.ts        # Guest middleware
├── pages/              # Page components
│   ├── products/
│   │   ├── index.vue   # 🚧 INCOMPLETE - Main task
│   │   └── [id].vue    # Product detail page
│   ├── checkout.vue    # 🚧 INCOMPLETE - Payment section
│   └── ...
├── stores/             # Pinia stores
│   ├── auth.ts         # Authentication store
│   └── cart.ts         # 🐛 HAS BUG - Cart calculation
└── types/              # TypeScript definitions
    └── index.ts        # Type definitions
```

## 🔧 Available Composables

### `useProducts()`
```typescript
const { 
  getAllProducts,      // Get all products with pagination
  getProduct,          // Get single product by ID
  getProductsByCategory, // Get products by category
  searchProducts,      // Search products by query
  getCategories,       // Get all categories
  getFeaturedProducts  // Get featured products
} = useProducts()
```

### `useApi()`
```typescript
const api = useApi()
await api.get('/products')
await api.post('/products', data)
```

## 🎨 Design System

### CSS Variables
```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #64748b;
  --success-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --dark-color: #1e293b;
  --light-color: #f8fafc;
  --border-color: #e2e8f0;
  --text-color: #334155;
  --text-light: #64748b;
}
```

### Utility Classes
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`
- `.form-input`, `.form-label`, `.form-group`
- `.card`, `.card-header`, `.card-body`
- `.grid`, `.grid-cols-1`, `.grid-cols-2`, etc.
- `.alert`, `.alert-success`, `.alert-error`
- `.spinner`, `.loading-container`

## 🌐 API Documentation (DummyJSON)

### Authentication
```bash
POST /auth/login
{
  "username": "emilys",
  "password": "emilyspass"
}
```

### Products
```bash
GET /products                    # Get all products
GET /products?limit=10&skip=0    # Pagination
GET /products/search?q=phone     # Search
GET /products/categories         # Get categories
GET /products/category/smartphones # Get by category
GET /products/1                  # Get single product
```

### Demo Users
Optional – only needed if you want to explore auth-protected routes.
- **Username**: `emilys` / **Password**: `emilyspass`
- **Username**: `michaelw` / **Password**: `michaelwpass`

## ✅ Completion Criteria

### Product Catalog (70 points)
- [ ] Products load and display correctly (15 points)
- [ ] Search functionality works (15 points)
- [ ] Filters work (category, price, brand, rating) (20 points)
- [ ] Pagination/infinite scroll (10 points)
- [ ] Grid/list view toggle (5 points)
- [ ] Responsive design (5 points)

### Bug Fixes (20 points)
- [ ] Cart calculation fixed (10 points)
- [ ] Mobile navigation fixed (10 points)

### Code Quality (10 points)
- [ ] Clean, readable code (5 points)
- [ ] Proper TypeScript usage (3 points)
- [ ] Good component structure (2 points)

## 🎯 Bonus Points (Optional - only if you have extra time and want to explore additional features)
- [x] Add loading animations
- [x] Implement advanced search (autocomplete, suggestions)
- [ ] Add product comparison feature
- [ ] Create wishlist functionality
- [ ] Add product reviews/ratings
- [ ] Implement advanced filtering (multiple selections)

## 📋 Testing Your Implementation

1. **Products Page**: Navigate to `/products` and verify all features work
2. **Search**: Test search functionality with various queries
3. **Filters**: Test each filter type and combinations
4. **Cart**: Add products and verify correct total calculation
5. **Mobile**: Test responsive design and navigation
6. **Authentication**: Login and test protected routes

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Review the existing code structure
3. Use the TypeScript types in `/types/index.ts`
4. Refer to the Nuxt 3 documentation

## 📤 Submission Instructions

When you're done:
- Push your solution to a public GitHub repository **OR**
- Zip the project folder and send it to us via email

Please make sure your name is included in the repo name or ZIP file.

## 🏆 Good Luck!

This assessment tests real-world frontend development skills including:
- Vue 3 Composition API
- Nuxt 3 framework
- TypeScript
- API integration
- State management (Pinia)
- Responsive design
- Bug fixing
- Code organization

Take your time and focus on code quality. We'd rather see a well-implemented subset of features than a rushed implementation of everything.