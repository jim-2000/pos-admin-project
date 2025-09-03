# LocalStorage Database Service

A lightweight database service that uses the browser's localStorage for data persistence. This service provides a simple interface for working with localStorage as a database with collections, CRUD operations, and querying capabilities.

## Features

- **Collection-based storage**: Organize data into collections similar to a NoSQL database
- **CRUD operations**: Create, read, update, and delete operations for data management
- **Querying capabilities**: Find, filter, sort, and paginate data
- **Type safety**: TypeScript interfaces for data models
- **Automatic timestamps**: Track when records are created and updated
- **Utility functions**: Helper functions for common operations

## Usage

### Basic Usage

```typescript
import { db, generateId } from '@/services';
import { Product } from '@/services/localStorage/models';

// Create a collection
db.createCollection('products');

// Add a product
const product: Product = {
  id: generateId(),
  name: 'Organic Coffee',
  price: 12.99,
  category: 'Beverages',
  stock: 50,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

db.insert('products', product);

// Get all products
const allProducts = db.getAll<Product>('products');

// Get a product by ID
const singleProduct = db.getById<Product>('products', product.id);

// Update a product
db.update<Product>('products', product.id, { price: 14.99, stock: 45 });

// Delete a product
db.delete<Product>('products', product.id);
```

### Advanced Usage

```typescript
import { db, sortBy, searchAcrossFields, paginate } from '@/services';
import { Product } from '@/services/localStorage/models';

// Get all products
const allProducts = db.getAll<Product>('products');

// Find products by category
const beverages = db.find<Product>('products', p => p.category === 'Beverages');

// Sort products by price
const sortedProducts = sortBy(allProducts, 'price', 'asc');

// Search across multiple fields
const searchResults = searchAcrossFields(
  allProducts,
  'organic',
  ['name', 'description', 'category']
);

// Paginate products
const paginatedProducts = paginate(allProducts, 1, 10);
```

### Custom Database Instance

```typescript
import { LocalStorageDb } from '@/services';

// Create a custom database instance
const customDb = new LocalStorageDb({
  name: 'customDb',
  version: 1
});

// Use the custom instance
customDb.createCollection('items');
customDb.insert('items', { id: '1', name: 'Item 1' });
```

## API Reference

### Core Storage Methods

- `storage.get<T>(key: string): T | null` - Get an item from localStorage
- `storage.set<T>(key: string, value: T): void` - Set an item in localStorage
- `storage.remove(key: string): void` - Remove an item from localStorage
- `storage.clear(): void` - Clear all items from localStorage

### Database Methods

- `db.getCollections(): string[]` - Get all collections
- `db.createCollection(name: string): boolean` - Create a new collection
- `db.dropCollection(name: string): boolean` - Drop a collection
- `db.getAll<T>(collection: string): T[]` - Get all items from a collection
- `db.getById<T>(collection: string, id: string | number): T | null` - Get an item by ID
- `db.insert<T>(collection: string, item: T): T` - Insert an item
- `db.update<T>(collection: string, id: string | number, updates: Partial<T>): T | null` - Update an item
- `db.delete<T>(collection: string, id: string | number): boolean` - Delete an item
- `db.find<T>(collection: string, query: (item: T) => boolean): T[]` - Find items by query
- `db.clear(): void` - Clear all data

### Utility Functions

- `generateId(): string` - Generate a unique ID
- `withTimestamps<T>(model: T, isNew?: boolean): T` - Add timestamps to a model
- `sortBy<T>(models: T[], field: keyof T, direction?: 'asc' | 'desc'): T[]` - Sort models by field
- `searchAcrossFields<T>(models: T[], searchTerm: string, fields: Array<keyof T>): T[]` - Search across fields
- `paginate<T>(models: T[], page?: number, pageSize?: number): { data: T[], pagination: {...} }` - Paginate models

## Data Models

The service includes TypeScript interfaces for common data models:

- `BaseModel` - Base model with ID and timestamps
- `Product` - Product model
- `User` - User model
- `Payment` - Payment model
- `Category` - Category model
- `Settings` - Settings model

You can extend these models or create your own as needed.