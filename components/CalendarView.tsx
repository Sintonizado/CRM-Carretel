
import React from 'react';
import { Opportunity } from '../types';

interface CalendarViewProps {
  opportunities: Opportunity[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ opportunities }) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth }, (_, i) => null);

  const getDayActivities = (day: number) => {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return opportunities.filter(o => o.visitDate === dayStr || o.lastMeetingDate === dayStr);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agenda Comercial</h1>
          <p className="text-gray-500 mt-1">{monthNames[month]} de {year}</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">&larr;</button>
          <button className="px-4 py-2 border border-gray-200 rounded-lg font-medium">Hoje</button>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">&rarr;</button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 h-[600px]">
          {[...padding, ...days].map((day, idx) => {
            if (day === null) return <div key={`p-${idx}`} className="border-r border-b border-gray-50 p-2 bg-gray-50/20"></div>;
            
            const activities = getDayActivities(day);
            return (
              <div key={day} className="border-r border-b border-gray-50 p-3 hover:bg-gray-50/50 transition-colors group relative">
                <span className={`text-sm font-medium ${day === now.getDate() ? 'bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-full' : 'text-gray-400'}`}>
                  {day}
                </span>
                <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px]">
                  {activities.map(act => (
                    <div 
                      key={act.id} 
                      className="text-[10px] p-1 px-2 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 truncate cursor-pointer hover:bg-indigo-100 transition-colors"
                      title={act.notes}
                    >
                      {act.consultant} - {act.phase}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100">
        <h4 className="font-bold text-gray-800 mb-4">Próximos Compromissos</h4>
        <div className="space-y-4">
          {opportunities.filter(o => new Date(o.visitDate) >= new Date()).slice(0, 3).map(opp => (
            <div key={opp.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 text-white flex flex-col items-center justify-center text-xs">
                <span className="font-bold">{opp.visitDate.split('-')[2]}</span>
                <span className="opacity-75">{monthNames[parseInt(opp.visitDate.split('-')[1])-1].substring(0,3)}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Visita em {opp.city}</p>
                <p className="text-xs text-gray-500">Consultor: {opp.consultant}</p>
              </div>
            </div>
          ))}
          {opportunities.filter(o => new Date(o.visitDate) >= new Date()).length === 0 && (
            <p className="text-sm text-gray-500 italic">Nenhuma atividade futura registrada.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
