import React from 'react';

export default function DepartmentGrid({ departments, onSelect, loading }) {
  if (loading) {
    return <GridSkeleton count={6} />;
  }

  if (!departments.length) {
    return <EmptyState message="No departments configured on the POS yet." />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
      {departments.map((dept) => (
        <button
          key={dept.id}
          onClick={() => onSelect(dept)}
          className="group relative aspect-square rounded-2xl bg-white hover:bg-rt-surfacealt border border-rt-border hover:border-rt-orange-400 flex flex-col items-center justify-center gap-3 transition shadow-card hover:shadow-panel"
        >
          <span className="text-4xl">{dept.icon || '🍽️'}</span>
          <span className="font-display font-semibold text-rt-text text-center px-2">{dept.name}</span>
          <span className="absolute inset-x-0 bottom-0 h-1 rounded-b-2xl bg-rt-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform" />
        </button>
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-square rounded-2xl bg-rt-surfacealt/70 border border-rt-border animate-pulse" />
      ))}
    </div>
  );
}

export function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 text-rt-muted">
      <span className="text-4xl mb-3">🍽️</span>
      <p>{message}</p>
    </div>
  );
}