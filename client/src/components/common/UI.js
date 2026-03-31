import React from 'react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const s = { sm: 'w-5 h-5 border-2', md: 'w-9 h-9 border-2', lg: 'w-14 h-14 border-[3px]' }[size];
  return (
    <div
      className={`animate-spin rounded-full ${className}`}
      style={{
        width: size === 'sm' ? 20 : size === 'md' ? 36 : 56,
        height: size === 'sm' ? 20 : size === 'md' ? 36 : 56,
        border: '2px solid #efefef',
        borderTopColor: '#0a0a0a',
      }}
    />
  );
};

export const PageSpinner = () => (
  <div className="flex items-center justify-center" style={{ minHeight: '35vh' }}>
    <Spinner size="lg" />
  </div>
);

export const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;
  const nums = Array.from({ length: pages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-1.5 mt-12 flex-wrap">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-4 py-2 text-[10px] tracking-widest uppercase border border-gray-200 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ← Prev
      </button>
      {nums.map(n => (
        <button
          key={n}
          onClick={() => onPageChange(n)}
          className="w-9 h-9 text-xs font-medium transition-all duration-200"
          style={{
            background: n === page ? '#0a0a0a' : 'transparent',
            color: n === page ? '#fafafa' : '#0a0a0a',
            border: n === page ? '1px solid #0a0a0a' : '1px solid #dcdcdc',
          }}
        >
          {n}
        </button>
      ))}
      <button
        disabled={page === pages}
        onClick={() => onPageChange(page + 1)}
        className="px-4 py-2 text-[10px] tracking-widest uppercase border border-gray-200 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Next →
      </button>
    </div>
  );
};

export const StarRating = ({ rating, numReviews, size = 'sm' }) => {
  const w = size === 'sm' ? 14 : 18;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1,2,3,4,5].map(s => (
          <svg key={s} width={w} height={w} viewBox="0 0 20 20" fill={s <= Math.round(rating) ? '#c9a96e' : '#efefef'}>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>
      {numReviews != null && <span className="text-xs text-gray-400">({numReviews})</span>}
    </div>
  );
};

export const StatusBadge = ({ status }) => {
  const styles = {
    pending:    { background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a' },
    processing: { background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' },
    shipped:    { background: '#f5f3ff', color: '#5b21b6', border: '1px solid #ddd6fe' },
    delivered:  { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' },
    cancelled:  { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' },
  };
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 text-[9px] font-bold tracking-[0.18em] uppercase"
      style={styles[status] || { background: '#f7f7f7', color: '#525252', border: '1px solid #dcdcdc' }}
    >
      {status}
    </span>
  );
};

export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center px-4">
    <div className="text-5xl mb-5">{icon}</div>
    <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-500 text-sm mb-8 max-w-xs">{description}</p>
    {action}
  </div>
);

export const SectionHeader = ({ subtitle, title, center = false }) => (
  <div className={`mb-10 sm:mb-14 ${center ? 'text-center' : ''}`}>
    {subtitle && <p className="section-subtitle mb-3">{subtitle}</p>}
    <h2 className="section-title">{title}</h2>
  </div>
);
