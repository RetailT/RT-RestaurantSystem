import axios from 'axios';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';
export const USE_MOCK_DATA = String(process.env.REACT_APP_USE_MOCK_DATA).toLowerCase() === 'true';

export const TERMINAL_INFO = {
  companyCode: process.env.REACT_APP_COMPANY_CODE || '01',
  unitNo: process.env.REACT_APP_UNIT_NO || '1',
  printerType: process.env.REACT_APP_PRINTER_TYPE || 'Pos Printer',
  measurement: process.env.REACT_APP_MEASUREMENT || 'Default'
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('rtpos_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      sessionStorage.removeItem('rtpos_token');
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

export default api;