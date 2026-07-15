
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Opportunity, Contact, FunnelPhase } from '../types';
import { ICONS } from '../constants';

interface DashboardProps {
  opportunities: Opportunity[];
  contacts: Contact[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981'];

const Dashboard: React.FC<DashboardProps> = ({ opportunities, contacts }) => {
  const stageData = Object.values(FunnelPhase).map((phase, idx) => {
    const oppsInPhase = opportunities.filter(o => o.phase === phase);
    return {
      name: phase,
      count: oppsInPhase.length,
      value: oppsInPhase.reduce((acc, curr) => acc + (curr.closed_value || curr.opportunity_value || 0), 0),
      color: COLORS[idx % COLORS.length]
    };
  });

  const totalOpps = opportunities.length;
  const totalValue = opportunities.reduce((acc, curr) => acc + (curr.closed_value || curr.opportunity_value || 0), 0);
  const conversionRate = totalOpps > 0 
    ? (opportunities.filter(o => o.phase === FunnelPhase.FECHADO).length / totalOpps * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Oportunidades', value: totalOpps, icon: <ICONS.TrendingUp />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Valor em Pipeline', value: `R$ ${(totalValue / 1000).toFixed(1)}k`, icon: <ICONS.DollarSign />, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Taxa de Conversão', value: `${conversionRate}%`, icon: <ICONS.TrendingUp />, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Contatos Base', value: contacts.length, icon: <ICONS.TrendingUp />, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
            <div className={`${stat.bg} p-3 rounded-xl ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">Valor por Etapa do Funil</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {stageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">Distribuição de Oportunidades</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {stageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-6 text-gray-800">Oportunidades Recentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500">
                <th className="pb-3 font-medium px-4">Cidade / UF</th>
                <th className="pb-3 font-medium px-4">Consultor</th>
                <th className="pb-3 font-medium px-4">Fase</th>
                <th className="pb-3 font-medium px-4 text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.slice(0, 5).map((opp) => (
                <tr key={opp.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-sm text-gray-800 font-medium">{opp.city} - {opp.uf}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {opp.consultant || 'Não definido'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{opp.phase}</td>
                  <td className="py-4 px-4 text-sm text-gray-800 font-medium text-right">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(opp.opportunity_value || 0)}
                  </td>
                </tr>
              ))}
              {opportunities.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500 text-sm">
                    Nenhuma oportunidade encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
