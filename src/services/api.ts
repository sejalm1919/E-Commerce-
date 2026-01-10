import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

// Products API
export const productsApi = {
  getAll: (params?: { page?: number; size?: number; category?: string; sort?: string; search?: string }) =>
    api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Cart API
export const cartApi = {
  get: () => api.get('/cart'),
  addItem: (data: { productId: string; quantity: number }) =>
    api.post('/cart/add-item', data),
  removeItem: (itemId: string) => api.delete(`/cart/${itemId}`),
  checkout: (data: any) => api.post('/cart/checkout', data),
};

// Orders API
export const ordersApi = {
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders', data),
  cancel: (id: string) => api.put(`/orders/${id}/cancel`),
};

// Wishlist API
export const wishlistApi = {
  get: () => api.get('/wishlist'),
  add: (productId: string) => api.post(`/wishlist/add/${productId}`),
  remove: (productId: string) => api.delete(`/wishlist/${productId}`),
};

// Admin API
export const adminApi = {
  getProducts: () => api.get('/admin/products'),
  getOrders: () => api.get('/admin/orders'),
  getAnalytics: () => api.get('/admin/analytics'),
};
