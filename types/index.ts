// User types
export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  token?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  token: string
  refreshToken: string
}

// Product types
export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
  reviews: Review[]
}

export interface Review {
  id: number
  comment: string
  date: string
  rating: number
  reviewerEmail: string
  reviewerName: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

// Cart types
export interface CartItem {
  id: number
  product: Product
  quantity: number
}

export interface Cart {
  id: number
  products: {
    id: number
    title: string
    price: number
    quantity: number
    total: number
    discountPercentage: number
    discountedPrice: number
  }[]
  total: number
  discountedTotal: number
  userId: number
  totalProducts: number
  totalQuantity: number
}

// Category type
export interface Category {
  slug: string
  name: string
  url: string
}

// Order types
export interface Order {
  id: string
  userId: number
  products: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  shippingAddress: Address
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

// API Error type
export interface ApiError {
  message: string
  status?: number
}

// Pagination
export interface PaginationParams {
  limit?: number
  skip?: number
  select?: string
}

// Search params
export interface SearchParams extends PaginationParams {
  q: string
}

// Filter params
export interface FilterParams extends PaginationParams {
  category?: string
  minPrice?: number
  maxPrice?: number
  brand?: string
}