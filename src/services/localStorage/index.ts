/**
 * LocalStorage Database Service
 * 
 * A service that provides a simple interface for working with localStorage
 * as a database with collections, CRUD operations, and querying capabilities.
 */

// Core localStorage wrapper methods
const storage = {
  /**
   * Get an item from localStorage
   * @param key The key to get
   * @returns The parsed value or null if not found
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error);
      return null;
    }
  },

  /**
   * Set an item in localStorage
   * @param key The key to set
   * @param value The value to store
   */
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error);
    }
  },

  /**
   * Remove an item from localStorage
   * @param key The key to remove
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error);
    }
  },

  /**
   * Clear all items from localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

export default storage;