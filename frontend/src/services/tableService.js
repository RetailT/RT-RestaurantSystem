import api, { USE_MOCK_DATA } from '../config/api.js';
import { mockTables } from '../data/mockData.js';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Expected real endpoint: GET /tables
 * Returns dine-in table numbers with live availability, e.g.:
 *   [{ number, capacity, status: 'available' | 'occupied' }]
 */
export async function getTables() {
  if (USE_MOCK_DATA) {
    await delay(200);
    return mockTables;
  }
  const { data } = await api.get('/tables');
  return data;
}
