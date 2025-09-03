/**
 * LocalStorage Database Initialization
 * 
 * This file contains functions to initialize the localStorage database with mock data.
 */

import { db, withTimestamps } from '..';
import { Product, User, Payment } from './models';
import { products as mockProducts, users as mockUsers, payments as mockPayments } from '@/data/mock';

/**
 * Initialize the products collection with mock data
 */
export function initializeProducts(): void {
  // Create products collection if it doesn't exist
  db.createCollection('products');
  
  // Check if products collection is empty
  const existingProducts = db.getAll<Product>('products');
  
  if (existingProducts.length === 0) {
    // Add mock products to the collection
    mockProducts.forEach(product => {
      const productWithTimestamps: Product = withTimestamps({
        ...product,
        description: `Description for ${product.name}`,
        isActive: true
      });
      
      db.insert('products', productWithTimestamps);
    });
    
    console.log('Products collection initialized with mock data');
  }
}

/**
 * Initialize the users collection with mock data
 */
export function initializeUsers(): void {
  // Create users collection if it doesn't exist
  db.createCollection('users');
  
  // Check if users collection is empty
  const existingUsers = db.getAll<User>('users');
  
  if (existingUsers.length === 0) {
    // Add mock users to the collection
    mockUsers.forEach(user => {
      const userWithTimestamps = withTimestamps({
        ...user,
        role: user.status === 'active' ? 'admin' : 'user',
        isActive: user.status === 'active'
      });
      
      db.insert('users', userWithTimestamps);
    });
    
    console.log('Users collection initialized with mock data');
  }
}

/**
 * Initialize the payments collection with mock data
 */
export function initializePayments(): void {
  // Create payments collection if it doesn't exist
  db.createCollection('payments');
  
  // Check if payments collection is empty
  const existingPayments = db.getAll<Payment>('payments');
  
  if (existingPayments.length === 0) {
    // Add mock payments to the collection
    mockPayments.forEach(payment => {
      const paymentWithTimestamps = withTimestamps({
        items: [],
        timestamp: new Date().toISOString(),
        ...payment,
        status: 'completed'
      });
      
      db.insert('payments', paymentWithTimestamps);
    });
    
    console.log('Payments collection initialized with mock data');
  }
}

/**
 * Initialize all collections with mock data
 */
export function initializeDatabase(): void {
  initializeProducts();
  initializeUsers();
  initializePayments();
  
  console.log('Database initialized with mock data');
}