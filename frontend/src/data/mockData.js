// Mock data mirrors the exact shape expected from the RTPOS backend endpoints.
// Swap VITE_USE_MOCK_DATA=false once the real endpoints (see README) are live.

export const mockCashiers = [
  { cashierCode: 'CASHIER', username: 'cashier01', password: '1234', name: 'S. Perera' },
  { cashierCode: 'CASHIER02', username: 'cashier02', password: '1234', name: 'N. Fernando' }
];

export const mockDepartments = [
  { id: 'DEP01', code: '10', name: 'Rice & Curry', icon: '🍛' },
  { id: 'DEP02', code: '20', name: 'Kottu', icon: '🥘' },
  { id: 'DEP03', code: '30', name: 'Short Eats', icon: '🥟' },
  { id: 'DEP04', code: '40', name: 'Beverages', icon: '🥤' },
  { id: 'DEP05', code: '50', name: 'Desserts', icon: '🍮' },
  { id: 'DEP06', code: '60', name: 'BBQ & Grill', icon: '🍢' }
];

export const mockCategories = {
  DEP01: [
    { id: 'CAT01', name: 'Rice Packets' },
    { id: 'CAT02', name: 'Fried Rice' },
    { id: 'CAT03', name: 'Curries' }
  ],
  DEP02: [
    { id: 'CAT04', name: 'Chicken Kottu' },
    { id: 'CAT05', name: 'Cheese Kottu' },
    { id: 'CAT06', name: 'Veg Kottu' }
  ],
  DEP03: [
    { id: 'CAT07', name: 'Rolls' },
    { id: 'CAT08', name: 'Patties' }
  ],
  DEP04: [
    { id: 'CAT09', name: 'Soft Drinks' },
    { id: 'CAT10', name: 'Fresh Juice' },
    { id: 'CAT11', name: 'Hot Beverages' }
  ],
  DEP05: [{ id: 'CAT12', name: 'Sweets' }],
  DEP06: [{ id: 'CAT13', name: 'Grilled Items' }]
};

export const mockProducts = {
  CAT01: [
    { pCode: '1002540', name: 'Chicken Rice Packet', price: 650.0, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=300&h=300&fit=crop' },
    { pCode: '1002541', name: 'Egg Rice Packet', price: 450.0, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&h=300&fit=crop' },
    ],
  CAT02: [
    { pCode: '1002560', name: 'Chicken Fried Rice', price: 750.0, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=300&h=300&fit=crop' },
    { pCode: '1002561', name: 'Seafood Fried Rice', price: 950.0, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300&h=300&fit=crop' }
  ],
  CAT03: [
    { pCode: '1002570', name: 'Dhal Curry', price: 150.0, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=300&fit=crop' },
    { pCode: '1002571', name: 'Chicken Curry', price: 450.0, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300&h=300&fit=crop' }
  ],
  CAT04: [
    { pCode: '1002600', name: 'Chicken Kottu (Reg)', price: 700.0, image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=300&h=300&fit=crop' },
    { pCode: '1002601', name: 'Chicken Kottu (Large)', price: 950.0, image: 'https://images.unsplash.com/photo-1626200926749-e77bfd4a3b4d?w=300&h=300&fit=crop' }
  ],
  CAT05: [{ pCode: '1002610', name: 'Cheese Kottu', price: 1050.0, image: 'https://images.unsplash.com/photo-1600628421066-f6bda6a7ba75?w=300&h=300&fit=crop' }],
  CAT06: [{ pCode: '1002620', name: 'Vegetable Kottu', price: 600.0, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop' }],
  CAT07: [{ pCode: '1002700', name: 'Chicken Roll', price: 120.0, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=300&fit=crop' }],
  CAT08: [{ pCode: '1002710', name: 'Fish Patty', price: 100.0, image: 'https://images.unsplash.com/photo-1619894991209-9f9694be045f?w=300&h=300&fit=crop' }],
  CAT09: [
    { pCode: '1002800', name: 'Coca Cola 400ml', price: 180.0, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=300&fit=crop' },
    { pCode: '1002801', name: 'Sprite 400ml', price: 180.0, image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=300&h=300&fit=crop' }
  ],
  CAT10: [{ pCode: '1002810', name: 'Fresh Lime Juice', price: 250.0, image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=300&h=300&fit=crop' }],
  CAT11: [{ pCode: '1002820', name: 'Milk Tea', price: 150.0, image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300&h=300&fit=crop' }],
  CAT12: [{ pCode: '1002900', name: 'Watalappan', price: 250.0, image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=300&h=300&fit=crop' }],
  CAT13: [{ pCode: '1003000', name: 'Chicken BBQ Skewer', price: 350.0, image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=300&h=300&fit=crop' }]
};

export const mockTables = [
  { number: 1, capacity: 2, status: 'available' },
  { number: 2, capacity: 4, status: 'available' },
  { number: 3, capacity: 4, status: 'occupied' },
  { number: 4, capacity: 2, status: 'available' },
  { number: 5, capacity: 6, status: 'available' },
  { number: 6, capacity: 4, status: 'occupied' },
  { number: 7, capacity: 2, status: 'available' },
  { number: 8, capacity: 4, status: 'available' },
  { number: 9, capacity: 8, status: 'available' },
  { number: 10, capacity: 4, status: 'occupied' },
  { number: 11, capacity: 2, status: 'available' },
  { number: 12, capacity: 6, status: 'available' }
];
