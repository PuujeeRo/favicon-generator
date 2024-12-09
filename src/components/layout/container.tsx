import React from 'react';

const Container = ({ children, }: Readonly<{ children: React.ReactNode; }>) => {
  return (
    <div className="max-w-[1024px] mx-auto p-4 font-[family-name:var(--font-geist-sans)]">
        {children}
    </div>
  );
};

export default Container;