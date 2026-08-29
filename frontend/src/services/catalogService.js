import api, { USE_MOCK_DATA } from '../config/api.js';
import { mockDepartments, mockCategories, mockProducts } from '../data/mockData.js';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Expected real endpoint: GET /departments
 * Returns restaurant departments configured in the POS, e.g.:
 *   [{ id, code, name, icon }]
 */
export async function getDepartments() {
  if (USE_MOCK_DATA) {
    await delay(250);
    return mockDepartments;
  }
  const { data } = await api.get('/departments');
  return data;
}

/**
 * Expected real endpoint: GET /departments/:departmentId/categories
 * Returns categories under a department, e.g. Rice, Kottu, Beverages.
 */
export async function getCategories(departmentId) {
  if (USE_MOCK_DATA) {
    await delay(200);
    return mockCategories[departmentId] || [];
  }
  const { data } = await api.get(`/departments/${departmentId}/categories`);
  return data;
}

/**
 * Expected real endpoint: GET /categories/:categoryId/products
 * Returns products in a category, including an image URL, e.g.:
 *   [{ pCode, name, price, image }]
 */
export async function getProducts(categoryId) {
  if (USE_MOCK_DATA) {
    await delay(200);
    return mockProducts[categoryId] || [];
  }
  const { data } = await api.get(`/categories/${categoryId}/products`);
  return data;
}
