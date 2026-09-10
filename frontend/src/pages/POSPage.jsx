import React, { useEffect, useState } from 'react';
import Header from '../components/Layout/Header.jsx';
import Breadcrumb from '../components/Menu/Breadcrumb.jsx';
import DepartmentGrid from '../components/Menu/DepartmentGrid.jsx';
import CategoryGrid from '../components/Menu/CategoryGrid.jsx';
import ProductGrid from '../components/Menu/ProductGrid.jsx';
import OrderPanel from '../components/Order/OrderPanel.jsx';
import { getDepartments, getCategories, getProducts } from '../services/catalogService.js';
import { useOrder } from '../context/OrderContext.jsx';
import ScrollNav from '../components/Common/ScrollNav.jsx';

export default function POSPage() {
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [activeDepartment, setActiveDepartment] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const { addItem, refreshInvoiceNo } = useOrder();

  useEffect(() => {
    refreshInvoiceNo();
    getDepartments()
      .then(setDepartments)
      .finally(() => setLoadingDepartments(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goHome() {
    setActiveDepartment(null);
    setActiveCategory(null);
  }

  function goDepartment() {
    setActiveCategory(null);
  }

  function handleSelectDepartment(dept) {
    setActiveDepartment(dept);
    setActiveCategory(null);
    setLoadingCategories(true);
    getCategories(dept.id)
      .then(setCategories)
      .finally(() => setLoadingCategories(false));
  }

  function handleSelectCategory(cat) {
    setActiveCategory(cat);
    setLoadingProducts(true);
    getProducts(cat.id)
      .then(setProducts)
      .finally(() => setLoadingProducts(false));
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

        <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4">
          <section className="flex-1 min-w-0">
            <Breadcrumb
              department={activeDepartment}
              category={activeCategory}
              onGoHome={goHome}
              onGoDepartment={goDepartment}
            />

            {!activeDepartment && (
              <DepartmentGrid
                departments={departments}
                onSelect={handleSelectDepartment}
                loading={loadingDepartments}
              />
            )}

            {activeDepartment && !activeCategory && (
              <CategoryGrid categories={categories} onSelect={handleSelectCategory} loading={loadingCategories} />
            )}

            {activeDepartment && activeCategory && (
              <ProductGrid products={products} onAdd={addItem} loading={loadingProducts} />
            )}
          </section>

          <OrderPanel />
        </main>
      <ScrollNav />
    </div>
  );
}
