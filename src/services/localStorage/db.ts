/**
 * LocalStorage Database Service
 * 
 * A service that provides a database-like interface for working with localStorage.
 * It supports collections, CRUD operations, and basic querying capabilities.
 */

import storage from './index';

// Type for any object with an id
export interface WithId {
  id: string | number;
}

// Database configuration type
export interface DbConfig {
  name: string;
  version: number;
}

// Default database configuration
const DEFAULT_CONFIG: DbConfig = {
  name: 'posAdminDb',
  version: 1
};

/**
 * LocalStorage Database class
 */
class LocalStorageDb {
  private config: DbConfig;
  private prefix: string;

  /**
   * Create a new LocalStorageDb instance
   * @param config Optional database configuration
   */
  constructor(config: Partial<DbConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.prefix = `${this.config.name}_v${this.config.version}`;
    this.initializeDb();
  }

  /**
   * Initialize the database
   */
  private initializeDb(): void {
    const dbInfo = storage.get<DbConfig>(`${this.prefix}_info`);
    
    if (!dbInfo) {
      // First time initialization
      storage.set(`${this.prefix}_info`, this.config);
      storage.set(`${this.prefix}_collections`, []);
    }
  }

  /**
   * Get the list of collections in the database
   * @returns Array of collection names
   */
  getCollections(): string[] {
    return storage.get<string[]>(`${this.prefix}_collections`) || [];
  }

  /**
   * Create a new collection
   * @param name Collection name
   * @returns True if collection was created, false if it already exists
   */
  createCollection(name: string): boolean {
    const collections = this.getCollections();
    
    if (collections.includes(name)) {
      return false;
    }
    
    collections.push(name);
    storage.set(`${this.prefix}_collections`, collections);
    storage.set(`${this.prefix}_${name}`, []);
    return true;
  }

  /**
   * Drop a collection
   * @param name Collection name
   * @returns True if collection was dropped, false if it doesn't exist
   */
  dropCollection(name: string): boolean {
    const collections = this.getCollections();
    
    if (!collections.includes(name)) {
      return false;
    }
    
    const updatedCollections = collections.filter(c => c !== name);
    storage.set(`${this.prefix}_collections`, updatedCollections);
    storage.remove(`${this.prefix}_${name}`);
    return true;
  }

  /**
   * Get all items from a collection
   * @param collection Collection name
   * @returns Array of items or empty array if collection doesn't exist
   */
  getAll<T>(collection: string): T[] {
    return storage.get<T[]>(`${this.prefix}_${collection}`) || [];
  }

  /**
   * Get an item by id from a collection
   * @param collection Collection name
   * @param id Item id
   * @returns The item or null if not found
   */
  getById<T extends WithId>(collection: string, id: string | number): T | null {
    const items = this.getAll<T>(collection);
    return items.find(item => item.id === id) || null;
  }

  /**
   * Insert an item into a collection
   * @param collection Collection name
   * @param item Item to insert
   * @returns The inserted item
   */
  insert<T extends WithId>(collection: string, item: T): T {
    const collections = this.getCollections();
    
    if (!collections.includes(collection)) {
      this.createCollection(collection);
    }
    
    const items = this.getAll<T>(collection);
    
    // Check if item with same id already exists
    const existingIndex = items.findIndex(i => i.id === item.id);
    
    if (existingIndex >= 0) {
      // Update existing item
      items[existingIndex] = item;
    } else {
      // Add new item
      items.push(item);
    }
    
    storage.set(`${this.prefix}_${collection}`, items);
    return item;
  }

  /**
   * Update an item in a collection
   * @param collection Collection name
   * @param id Item id
   * @param updates Partial updates to apply
   * @returns The updated item or null if not found
   */
  update<T extends WithId>(collection: string, id: string | number, updates: Partial<T>): T | null {
    const items = this.getAll<T>(collection);
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      return null;
    }
    
    const updatedItem = { ...items[index], ...updates } as T;
    items[index] = updatedItem;
    storage.set(`${this.prefix}_${collection}`, items);
    return updatedItem;
  }

  /**
   * Delete an item from a collection
   * @param collection Collection name
   * @param id Item id
   * @returns True if item was deleted, false if not found
   */
  delete<T extends WithId>(collection: string, id: string | number): boolean {
    const items = this.getAll<T>(collection);
    const filteredItems = items.filter(item => item.id !== id);
    
    if (filteredItems.length === items.length) {
      return false;
    }
    
    storage.set(`${this.prefix}_${collection}`, filteredItems);
    return true;
  }

  /**
   * Find items in a collection that match a query
   * @param collection Collection name
   * @param query Function that returns true for matching items
   * @returns Array of matching items
   */
  find<T>(collection: string, query: (item: T) => boolean): T[] {
    const items = this.getAll<T>(collection);
    return items.filter(query);
  }

  /**
   * Clear all data in the database
   */
  clear(): void {
    const collections = this.getCollections();
    
    // Remove all collections
    collections.forEach(collection => {
      storage.remove(`${this.prefix}_${collection}`);
    });
    
    // Reset collections list
    storage.set(`${this.prefix}_collections`, []);
  }
}

// Create and export a default instance
const db = new LocalStorageDb();
export default db;

// Also export the class for custom instances
export { LocalStorageDb };