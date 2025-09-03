/**
 * LocalStorage Database Utilities
 * 
 * Helper functions for working with the localStorage database.
 */

import { BaseModel } from './models';

/**
 * Generate a unique ID
 * @returns A unique string ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Add timestamps to a model
 * @param model The model to add timestamps to
 * @param isNew Whether this is a new model (adds createdAt) or existing (updates updatedAt)
 * @returns The model with timestamps
 */
export function withTimestamps<T extends BaseModel>(model: T, isNew = true): T {
  const now = new Date().toISOString();
  const updates: Partial<BaseModel> = { updatedAt: now };
  
  if (isNew) {
    updates.createdAt = now;
  }
  
  return { ...model, ...updates } as T;
}

/**
 * Sort an array of models by a field
 * @param models Array of models to sort
 * @param field Field to sort by
 * @param direction Sort direction ('asc' or 'desc')
 * @returns Sorted array
 */
 

/**
 * Filter an array of models by a search term across multiple fields
 * @param models Array of models to filter
 * @param searchTerm Term to search for
 * @param fields Fields to search in
 * @returns Filtered array
 */
// export function searchAcrossFields<T extends Record<any, any>>(
//   models: T[],
//   searchTerm: string,
//   fields: Array<keyof T>
// ): T[] {
//   if (!searchTerm) return models;
  
//   const term = searchTerm.toLowerCase();
  
//   return models.filter(model => {
//     return fields.some(field => {
//       const value = model[field];
//       if (value === null || value === undefined) return false;
//       return String(value).toLowerCase().includes(term);
//     });
//   });
// }

/**
 * Paginate an array of models
 * @param models Array of models to paginate
 * @param page Page number (1-based)
 * @param pageSize Number of items per page
 * @returns Object with paginated results and pagination info
 */
export function paginate<T>(
  models: T[],
  page: number = 1,
  pageSize: number = 10
): { data: T[], pagination: { total: number, page: number, pageSize: number, totalPages: number } } {
  const total = models.length;
  const totalPages = Math.ceil(total / pageSize);
  const safePageNumber = Math.max(1, Math.min(page, totalPages || 1));
  
  const startIndex = (safePageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const data = models.slice(startIndex, endIndex);
  
  return {
    data,
    pagination: {
      total,
      page: safePageNumber,
      pageSize,
      totalPages
    }
  };
}