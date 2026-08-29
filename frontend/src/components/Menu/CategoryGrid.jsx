import React from 'react';
import { GridSkeleton, EmptyState } from './DepartmentGrid.jsx';

export default function CategoryGrid({ categories, onSelect, loading }) {
  if (loading) return <GridSkeleton count={4} />;
  if (!categories.length) return <EmptyState message="No categories under this department yet." />;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat)}
          className="rounded-2xl bg-white hover:bg-rt-surfacealt border border-rt-border hover:border-rt-orange-400 px-5 py-8 text-left transition shadow-card hover:shadow-panel"
        >
          <span className="block font-display font-semibold text-lg text-rt-text">{cat.name}</span>
          <span className="block text-xs text-rt-orange-600/60 mt-1">Tap to view items</span>
        </button>
      ))}
    </div>
  );
}