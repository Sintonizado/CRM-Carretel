
import React from 'react';
import { ICONS, NAVIGATION } from '../constants';
import { ViewType } from '../types';
import { Menu } from 'lucide-react';

interface HeaderProps {
  activeView: ViewType;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, searchTerm, onSearchChange, onMenuClick }) => {
  const currentNav = NAVIGATION.find(n => n.id === activeView);

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="text-indigo-600 hidden xs:block">
          {currentNav?.icon}
        </div>
        <h2 className="text-base md:text-lg font-bold text-gray-800 truncate">
          {currentNav?.name}
        </h2>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Pesquisar..." 
            className="pl-9 pr-3 py-2 bg-gray-100 border-none rounded-full text-xs md:text-sm focus:ring-2 focus:ring-indigo-500 w-32 xs:w-40 sm:w-64 transition-all"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <ICONS.Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
        </div>
      </div>
    </header>
  );
};

export default Header;
