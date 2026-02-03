import React from 'react';
import { BadgeIndianRupee, Menu } from 'lucide-react';

interface NavbarProps {
  showMenuTrigger?: boolean;
  onMenuClick?: () => void;
  onLogoClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ showMenuTrigger = false, onMenuClick, onLogoClick }) => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {showMenuTrigger && (
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-700"
          >
            <Menu size={24} />
          </button>
        )}
        <div className="flex items-center gap-2 cursor-pointer" onClick={onLogoClick}>
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <BadgeIndianRupee className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">FinScore<span className="text-blue-600">AI</span></span>
        </div>
      </div>
      
      <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
        <a href="#" className="hover:text-blue-600 transition-colors">How it Works</a>
        <a href="#" className="hover:text-blue-600 transition-colors">Stories</a>
        <a href="#" className="hover:text-blue-600 transition-colors">Partners</a>
      </div>
    </nav>
  );
};