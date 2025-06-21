import React from 'react';
import clsx from 'clsx';

export function Button({ children, className, ...props }) {
  return (
    <button
      {...props}
      className={clsx(
        'bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors duration-200',
        className
      )}
    >
      {children}
    </button>
  );
}
