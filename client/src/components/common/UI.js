import React from 'react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size];
  return <div className={`spinner ${s} ${className}`} />;
};

export const PageSpinner = () => (
  <div className="flex items-center justify-center min-h-[40vh]">
    <Spinner size="lg" />
  </div>
);

export const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;
  const nums = Array.from({ length: pages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button disabled={page === 1} onClick={() => onPageChange(page - 1)}
        className="px-4 py-2 text-xs tracking-widest uppercase border border-gray-200 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
        Prev
      </button>
      {nums.map(n => (
        <button key={n} onClick={() => onPageChange(n)}
          className={`w-9 h-9 text-xs font-medium transition-colors ${n === page ? 'bg-black text-white' : 'border border-gray-200 hover:border-black'}`}>
          {n}
        </button>
      ))}
      <button disabled={page === pages} onClick={() => onPageChange(page + 1)}
        className="px-4 py-2 text-xs tracking-widest uppercase border border-gray-200 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
        Next
      </button>
    </div>
  );
};

export const StarRating = ({ rating, numReviews, size = 'sm' }) => {
  const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1,2,3,4,5].map(s => (
          <svg key={s} className={`${starSize} ${s <= Math.round(rating) ? 'text-accent fill-current' : 'text-gray-200 fill-current'}`} viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>
      {numReviews != null && <span className="text-xs text-gray-500">({numReviews})</span>}
    </div>
  );
};

export const StatusBadge = ({ status }) => {
  const styles = {
    pending:    'bg-yellow-50  text-yellow-700 border border-yellow-200',
    processing: 'bg-blue-50    text-blue-700   border border-blue-200',
    shipped:    'bg-purple-50  text-purple-700 border border-purple-200',
    delivered:  'bg-green-50   text-green-700  border border-green-200',
    cancelled:  'bg-red-50     text-red-700    border border-red-200',
  };
  return <span className={`status-badge ${styles[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
};

export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-500 text-sm mb-6">{description}</p>
    {action}
  </div>
);

export const SectionHeader = ({ subtitle, title, center = false }) => (
  <div className={`mb-10 ${center ? 'text-center' : ''}`}>
    {subtitle && <p className="section-subtitle mb-3">{subtitle}</p>}
    <h2 className="section-title">{title}</h2>
  </div>
);
