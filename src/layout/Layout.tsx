import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 pt-[5%]">
      <Sidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};
