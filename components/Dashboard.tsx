
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Opportunity, Contact, FunnelPhase } from '../types';
import { ICONS } from '../constants';
import GeminiService from '../services/geminiService';

interface DashboardProps {
  opportunities: Opportunity[];
  contacts: Contact[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981'];

const Dashboard: React.FC<DashboardProps> = ({ opportunities, contacts }) => {
  const [insights, setInsights] = React.useState<string>("");
  const [loadingAI, setLoadingAI] = React.useState(false);

  // Group by Stage
  const stageData = Object.values(FunnelPhase).map((phase, idx) => {
    const oppsInPhase = opportunities.filter(o => o.phase === phase);
    return {
      name: phase,
      count: oppsInPhase.length,
      value: oppsInPhase.reduce((acc, curr) => acc + (curr.closedValue || curr.opportunityValue), 0),
      color: COLORS[idx % COLORS.length]
    };
  });

  // Calculate stats
  const totalOpps = opportunities.length;
  const totalValue = opportunities.reduce((acc, curr) => acc + (curr.closedValue || curr.opportunityValue), 0);
  const conversionRate = totalOpps > 0 
    ? (opportunities.filter(o => o.phase === FunnelPhase.FECHADO).length / totalOpps * 100).toFixed(1)
    : 0;

  const handleGetInsights = async () => {
    setLoadingAI(true);
    try {
      const summary = await GeminiService.getFunnelInsights(opportunities);
      setInsights(summary);
    } catch (err) {
      setInsights("Erro ao gerar insights automáticos.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Oportunidades', value: totalOpps, icon: <ICONS.TrendingUp />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Valor em Pipeline', value: `R$ ${(totalValue / 1000).toFixed(1)}k`, icon: <ICONS.DollarSign />, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Taxa de Conversão', value: `${conversionRate}%`, icon: <ICONS.TrendingUp />, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Contatos Base', value: contacts.length, icon: <ICONS.TrendingUp />, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Funnel Bar Chart */}
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

        {/* Quantity Pie Chart */}
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

      {/* AI Insights Section */}
      <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-2xl font-bold mb-4">Insights de IA Carretel</h3>
          <p className="text-indigo-200 mb-6 leading-relaxed">
            Nossa IA analisa seu pipeline comercial para sugerir ações imediatas e prever gargalos no fechamento.
          </p>
          <button 
            onClick={handleGetInsights}
            disabled={loadingAI}
            className="px-6 py-3 bg-white text-indigo-900 font-semibold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg disabled:opacity-50"
          >
            {loadingAI ? 'Analisando dados...' : 'Gerar Relatório Estratégico'}
          </button>

          {insights && (
            <div className="mt-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 animate-in slide-in-from-bottom-4 duration-500">
              <div className="whitespace-pre-wrap text-indigo-50 leading-relaxed font-light">
                {insights}
              </div>
            </div>
          )}
        </div>
        
        {/* Abstract Background Design */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Dashboard;
