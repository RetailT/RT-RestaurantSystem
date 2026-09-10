import React from 'react';

export default function Breadcrumb({ department, category, onGoHome, onGoDepartment }) {
  const baseTab =
    'inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap';
  const activeTab = 'bg-rt-orange-500 text-black shadow-glow';
  const inactiveTab = 'bg-rt-surfacealt text-rt-muted hover:text-rt-orange-600 hover:bg-rt-surfacehover';

  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      <button onClick={onGoHome} className={`${baseTab} ${!department ? activeTab : inactiveTab}`}>
        MAIN MENU
      </button>

      {department && (
        <>
          <span className="text-rt-muted/40">/</span>
          <button onClick={onGoDepartment} className={`${baseTab} ${!category ? activeTab : inactiveTab}`}>
            {department.name}
          </button>
        </>
      )}

      {category && (
        <>
          <span className="text-rt-muted/40">/</span>
          <span className={`${baseTab} ${activeTab}`}>{category.name}</span>
        </>
      )}
    </div>
  );
}