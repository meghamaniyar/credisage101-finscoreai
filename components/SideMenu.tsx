import React from 'react';
import { X, LayoutDashboard, PlusCircle, TrendingUp, CheckCircle, HelpCircle, User } from 'lucide-react';
import { UserProfile } from '../types';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onNavigate: (sectionId: string) => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, user, onNavigate }) => {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-[300px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-6 bg-[#6200EE] text-white flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-1">
               <div className="bg-white/20 p-2 rounded-full border border-white/20">
                 <User size={20} className="text-white" />
               </div>
               <h2 className="text-xl font-bold">{user.name || 'Guest User'}</h2>
            </div>
            <p className="text-xs text-blue-100 opacity-80 pl-11">Verified Profile</p>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 m-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
          <p className="text-slate-500 text-sm mb-1">Current Status</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#6200EE]">{user.cibilScore || '---'}</span>
            <span className="text-sm font-medium text-slate-600">CIBIL Score</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto px-4 space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-2">Main Menu</p>
          
          <button 
            onClick={() => onNavigate('new-loan')}
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-emerald-50 text-emerald-800 font-medium hover:bg-emerald-100 transition-colors text-left border border-emerald-100"
          >
            <PlusCircle size={20} className="text-emerald-600" />
            <div>
              <span className="block font-bold">New Personal Loan</span>
              <span className="text-xs opacity-70">Apply for a new loan</span>
            </div>
          </button>

          <button 
            onClick={() => onNavigate('ai-insights')}
            className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition-colors text-left"
          >
            <div className="bg-slate-100 p-2 rounded-lg">
              <TrendingUp size={18} className="text-slate-600" />
            </div>
            <div>
              <span className="block font-bold">Credit Score Insights</span>
              <span className="text-xs text-slate-500">View your score analysis</span>
            </div>
          </button>

          <button 
            onClick={() => onNavigate('active-loans')}
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-[#6200EE] text-white font-medium shadow-lg shadow-indigo-200 text-left"
          >
             <div className="bg-white/20 p-2 rounded-lg">
               <LayoutDashboard size={18} className="text-white" />
             </div>
             <div>
               <span className="block font-bold">My Loan Dashboard</span>
               <span className="text-xs opacity-80">Manage all your loans</span>
             </div>
          </button>

          <button 
            onClick={() => onNavigate('ai-insights')}
            className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition-colors text-left"
          >
            <div className="bg-slate-100 p-2 rounded-lg">
              <CheckCircle size={18} className="text-slate-600" />
            </div>
            <div>
              <span className="block font-bold">Improvement Plan</span>
              <span className="text-xs text-slate-500">Personalized action steps</span>
            </div>
          </button>
        </div>

        {/* Footer (Compact) */}
        <div className="p-3 mt-auto border-t border-slate-100">
          <div className="flex items-center gap-3 mb-2 p-2">
             <div className="bg-orange-100 p-1.5 rounded-lg">
               <HelpCircle size={16} className="text-orange-600" />
             </div>
             <div>
               <span className="font-bold text-slate-800 text-sm block">Need Help?</span>
               <span className="text-[10px] text-slate-500">Chat with AI Support</span>
             </div>
          </div>
          <button onClick={onClose} className="w-full py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
            Close Menu
          </button>
        </div>
      </div>
    </>
  );
};