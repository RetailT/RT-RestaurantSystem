import React from 'react';

export default function Breadcrumb({ department, category, onGoHome, onGoDepartment }) {
  return (
    <div className="flex items-center gap-2 text-sm mb-4 flex-wrap">
      <button
        onClick={onGoHome}
        className={`font-semibold transition ${
          !department ? 'text-rt-orange-600' : 'text-rt-muted hover:text-rt-orange-600'
        }`}
      >
        Main Menu
      </button>
      {department && (
        <>
          <span className="text-rt-muted/40">/</span>
          <button
            onClick={onGoDepartment}
            className={`font-semibold transition ${
              !category ? 'text-rt-orange-600' : 'text-rt-muted hover:text-rt-orange-600'
            }`}
          >
            {department.name}
          </button>
        </>
      )}
      {category && (
        <>
          <span className="text-rt-muted/40">/</span>
          <span className="text-rt-orange-600 font-semibold">{category.name}</span>
        </>
      )}
    </div>
  );
}