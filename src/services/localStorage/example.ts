/**
 * LocalStorage Database Service - Usage Examples
 * 
 * This file contains examples of how to use the localStorage database service.
 * It is not meant to be imported in the application, but rather serves as documentation.
 */

import { db, generateId, withTimestamps, paginate } from '../';
import { Product, User, Payment, Category, Settings } from './models';

/**
 * Example: Working with Products
 */
function productExamples() {
  // Initialize products collection if it doesn't exist
  db.createCollection('products');
  
  // Add a new product
  const newProduct: Product = withTimestamps({
    id: generateId(),
    name: 'Organic Coffee',
    description: 'Premium organic coffee beans',
    price: 12.99,
    category: 'Beverages',
    stock: 50,
    isActive: true
  });
  
  db.insert('products', newProduct);
  
  // Get all products
  const allProducts = db.getAll<Product>('products');
  console.log('All products:', allProducts);
  
  // Get a product by ID
  const product = db.getById<Product>('products', newProduct.id);
  console.log('Product by ID:', product);
  
  // Update a product
  const updatedProduct = db.update<Product>('products', newProduct.id, {
    price: 14.99,
    stock: 45
  });
  console.log('Updated product:', updatedProduct);
  
  // Find products by category
  const beverages = db.find<Product>('products', p => p.category === 'Beverages');
  console.log('Beverage products:', beverages);
  
  // Search products by name
  const searchResults = db.find<Product>('products', p => 
    p.name.toLowerCase().includes('coffee') || 
    (p.description?.toLowerCase().includes('coffee') ?? false)
  );
  console.log('Search results:', searchResults);
  
  // Sort products by price
  // const sortedProducts = sortBy(allProducts, 'price', 'asc');
  // console.log('Products sorted by price:', sortedProducts);
  
  // Search across multiple fields
  // const searchedProducts = searchAcrossFields(
  //   allProducts,
  //   'organic',
  //   ['name', 'description', 'category']
  // );
  // console.log('Products containing "organic":', searchedProducts);
  
  // Paginate products
  const paginatedProducts = paginate(allProducts, 1, 10);
  console.log('Paginated products:', paginatedProducts);
  
  // Delete a product
  const deleted = db.delete<Product>('products', newProduct.id);
  console.log('Product deleted:', deleted);
}

/**
 * Example: Working with Users
 */
function userExamples() {
  // Initialize users collection
  db.createCollection('users');
  
  // Add a new user
  const newUser: User = withTimestamps({
    id: generateId(),
    name: 'John Doe',
    email: 'john@example.com',
    role: 'manager',
    isActive: true
  });
  
  db.insert('users', newUser);
  
  // Get all users
  const allUsers = db.getAll<User>('users');
  console.log('All users:', allUsers);
  
  // Find active admins
  const activeAdmins = db.find<User>('users', u => u.isActive && u.role === 'admin');
  console.log('Active admins:', activeAdmins);
}

/**
 * Example: Working with App Settings
 */
function settingsExample() {
  // Initialize settings collection
  db.createCollection('settings');
  
  // Add or update app settings
  const appSettings: Settings = {
    id: 'app_settings', // Use a fixed ID for settings
    storeName: 'My POS Store',
    currency: 'USD',
    taxRate: 7.5,
    theme: 'system'
  };
  
  db.insert('settings', appSettings);
  
  // Get app settings
  const settings = db.getById<Settings>('settings', 'app_settings');
  console.log('App settings:', settings);
  
  // Update theme
  const updatedSettings = db.update<Settings>('settings', 'app_settings', {
    theme: 'dark'
  });
  console.log('Updated settings:', updatedSettings);
}

/**
 * Example: Database Management
 */
function databaseManagementExamples() {
  // Get all collections
  const collections = db.getCollections();
  console.log('All collections:', collections);
  
  // Create a new collection
  db.createCollection('inventory');
  
  // Drop a collection
  db.dropCollection('inventory');
  
  // Clear all data (use with caution!)
  // db.clear();
}

// Run examples
// productExamples();
// userExamples();
// settingsExample();
// databaseManagementExamples();