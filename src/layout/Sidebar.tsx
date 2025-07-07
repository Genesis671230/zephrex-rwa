import React from 'react';
import { NavLink } from 'react-router-dom';
import { TrendingUp, Briefcase, ShoppingCart, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { icon: Briefcase, label: 'Portfolio', href: '/investor/dashboard' },
];

 const Sidebar = () => {
  return (
    <div className="w-64  bg-white border-r border-gray-200 min-h-screen">
      {/* <div className="p-6">
        <div className="text-xl font-bold text-gray-900">YOUR LOGO</div>
      </div> */}
      
      <nav className="mt-8">
        {navigationItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors",
                isActive && "bg-gray-900 text-white hover:bg-gray-900 hover:text-white"
              )
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
export default Sidebar;