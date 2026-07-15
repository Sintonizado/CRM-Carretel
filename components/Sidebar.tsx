
import React from 'react';
import { NAVIGATION } from '../constants';
import { ViewType } from '../types';
import { LogOut, X } from 'lucide-react';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onLogout, isOpen, onClose }) => {
  return (
    <aside className={`
      fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl">C</div>
          <h1 className="text-xl font-bold tracking-tight">Carretel</h1>
        </div>
        <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-white">
          <X size={24} />
        </button>
      </div>
      
      <nav className="flex-1 mt-4 px-4 space-y-2">
        {NAVIGATION.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as ViewType)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === item.id 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-4">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all font-medium"
        >
          <LogOut size={20} />
          Sair
        </button>
        <div className="text-center">
          <p className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">
            Versão 1.1.0
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
