import React from 'react';
import { formatMoney } from '../../utils/format.js';
import { GridSkeleton, EmptyState } from './DepartmentGrid.jsx';

export default function ProductGrid({ products, onAdd, loading }) {
  if (loading) return <GridSkeleton count={8} />;
  if (!products.length) return <EmptyState message="No products found in this category." />;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.pCode} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}

function ProductCard({ product, onAdd }) {
  return (
    <button
      onClick={() => onAdd(product)}
      className="group text-left rounded-2xl overflow-hidden bg-rt-card hover:bg-rt-cardhover border border-rt-border hover:border-rt-orange-500/60 transition shadow-panel flex flex-col"
    >
      <div className="aspect-square w-full overflow-hidden bg-rt-black/40">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <span className="font-semibold text-white text-sm leading-snug line-clamp-2">{product.name}</span>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-rt-orange-400 font-display font-bold">Rs. {formatMoney(product.price)}</span>
          <span className="rounded-full bg-rt-orange-500 text-black text-lg font-bold w-7 h-7 flex items-center justify-center group-hover:scale-110 transition">
            +
          </span>
        </div>
      </div>
    </button>
  );
}
