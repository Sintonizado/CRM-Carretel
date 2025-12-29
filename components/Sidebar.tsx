
import React from 'react';
import { NAVIGATION } from '../constants';
import { ViewType } from '../types';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col sticky top-0 h-screen transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl">C</div>
        <h1 className="text-xl font-bold tracking-tight">Carretel</h1>
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

      <div className="p-6 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">
          Versão 1.0.2
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
