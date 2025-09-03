/**
 * LocalStorage Database Models
 * 
 * Type definitions for data models used in the application.
 * These models define the structure of data stored in localStorage.
 */

/**
 * Base model interface with required id field
 */
export interface BaseModel {
  id: string | number;
  createdAt?: Date | string | number;
  updatedAt?: Date | string | number;
}

/**
 * Product model
 */
export interface Product extends BaseModel {
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  sku?: string;
  isActive: boolean;
}

/**
 * User model
 */
export interface User extends BaseModel {
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier';
  isActive: boolean;
  lastLogin?: Date | string | number;
}

/**
 * Payment model
 */
export interface Payment extends BaseModel {
  amount: number;
  method: 'cash' | 'card' | 'mobile';
  status: 'pending' | 'completed' | 'failed';
  customerId?: string | number;
  items: Array<{
    productId: string | number;
    quantity: number;
    price: number;
  }>;
  timestamp: Date | string | number;
  reference?: string;
}

/**
 * Category model
 */
export interface Category extends BaseModel {
  name: string;
  description?: string;
  parentId?: string | number;
  isActive: boolean;
}

/**
 * Settings model
 */
export interface Settings extends BaseModel {
  storeName: string;
  address?: string;
  phone?: string;
  email?: string;
  currency: string;
  taxRate: number;
  theme: 'light' | 'dark' | 'system';
}