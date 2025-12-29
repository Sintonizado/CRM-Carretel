
import React from 'react';
import { ICONS, NAVIGATION } from '../constants';
import { ViewType } from '../types';

interface HeaderProps {
  activeView: ViewType;
}

const Header: React.FC<HeaderProps> = ({ activeView }) => {
  const currentNav = NAVIGATION.find(n => n.id === activeView);

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="text-indigo-600">
          {currentNav?.icon}
        </div>
        <h2 className="text-lg font-semibold text-gray-800">
          {currentNav?.name}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden sm:block">
          <input 
            type="text" 
            placeholder="Pesquisar..." 
            className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
          />
          <ICONS.Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>
        
        <button className="relative p-2 text-gray-400 hover:text-indigo-600 transition-colors">
          <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
