
import React, { useState, useEffect } from 'react';
import { Opportunity, Contact, FunnelPhase } from '../types';
import { ICONS, BRAZIL_STATES } from '../constants';
import { Trash2, Pencil, X, Eye } from 'lucide-react';

interface OpportunityListProps {
  opportunities: Opportunity[];
  contacts: Contact[];
  onAddOpportunity: (opp: Opportunity) => void;
  onUpdateOpportunity: (opp: Opportunity) => void;
  onDeleteOpportunity: (id: string) => void;
}

const OpportunityList: React.FC<OpportunityListProps> = ({ 
  opportunities, 
  contacts, 
  onAddOpportunity, 
  onUpdateOpportunity, 
  onDeleteOpportunity 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [formData, setFormData] = useState<Partial<Opportunity>>({
    contactId: '',
    visitDate: new Date().toISOString().split('T')[0],
    city: '',
    uf: 'SP',
    responsible: '',
    position: '',
    consultant: '',
    phase: FunnelPhase.PROSPECCAO,
    notes: '',
    opportunityValue: 0,
    lastMeetingDate: new Date().toISOString().split('T')[0],
    proposalSent: false,
    closingDate: '',
    closedValue: 0
  });

  useEffect(() => {
    if (editingOpp) {
      setFormData(editingOpp);
      setIsModalOpen(true);
    } else {
      setFormData({
        contactId: '',
        visitDate: new Date().toISOString().split('T')[0],
        city: '',
        uf: 'SP',
        responsible: '',
        position: '',
        consultant: '',
        phase: FunnelPhase.PROSPECCAO,
        notes: '',
        opportunityValue: 0,
        lastMeetingDate: new Date().toISOString().split('T')[0],
        proposalSent: false,
        closingDate: '',
        closedValue: 0
      });
    }
  }, [editingOpp]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOpp) {
      onUpdateOpportunity({ ...editingOpp, ...formData } as Opportunity);
    } else {
      const newOpp: Opportunity = {
        ...formData as Opportunity,
        id: Math.random().toString(36).substr(2, 9),
        opportunityValue: Number(formData.opportunityValue)
      };
      onAddOpportunity(newOpp);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOpp(null);
  };

  const handleDeleteFromModal = () => {
    if (editingOpp) {
      if (window.confirm("Deseja realmente excluir esta oportunidade? Esta ação não pode ser desfeita.")) {
        onDeleteOpportunity(editingOpp.id);
        closeModal();
      }
    }
  };

  const getContactName = (id: string) => contacts.find(c => c.id === id)?.name || 'Contato Excluído';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipeline de Negócios</h1>
          <p className="text-gray-500 mt-1">Acompanhe suas oportunidades de venda em tempo real.</p>
        </div>
        <button 
          onClick={() => { setEditingOpp(null); setIsModalOpen(true); }}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
        >
          <ICONS.PlusCircle size={20} />
          Nova Oportunidade
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {opportunities.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100 italic">
            Nenhuma oportunidade ativa no pipeline.
          </div>
        ) : (
          opportunities.map((opp) => (
            <div key={opp.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  opp.phase === FunnelPhase.FECHADO ? 'bg-green-100 text-green-700' :
                  opp.phase === FunnelPhase.PERDIDO ? 'bg-red-100 text-red-700' :
                  'bg-indigo-100 text-indigo-700'
                }`}>
                  {opp.phase}
                </span>
              </div>
              
              <h3 className="font-bold text-lg text-gray-800 mb-1">{getContactName(opp.contactId)}</h3>
              <p className="text-sm text-gray-500 mb-4">{opp.city}, {opp.uf}</p>
              
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Valor Estimado:</span>
                  <span className="text-gray-900 font-bold">R$ {opp.opportunityValue.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Consultor:</span>
                  <span className="text-gray-700 font-medium">{opp.consultant}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs text-gray-400 italic truncate max-w-[140px]">
                  {opp.notes || 'Sem anotações...'}
                </span>
                <button 
                  onClick={() => setEditingOpp(opp)}
                  className="flex items-center gap-1.5 text-indigo-600 font-semibold text-sm hover:underline"
                >
                  <Eye size={16} />
                  Detalhes
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl my-8 animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingOpp ? `Oportunidade: ${getContactName(editingOpp.contactId)}` : 'Registrar Oportunidade'}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X size={28} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Contato Associado</label>
                    <select 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.contactId}
                      onChange={e => setFormData({...formData, contactId: e.target.value})}
                    >
                      <option value="">Selecione um contato...</option>
                      {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Data Visita</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.visitDate}
                      onChange={e => setFormData({...formData, visitDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Fase do Funil</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.phase}
                      onChange={e => setFormData({...formData, phase: e.target.value as FunnelPhase})}
                    >
                      {Object.values(FunnelPhase).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Cidade</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Responsável Cliente</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.responsible}
                      onChange={e => setFormData({...formData, responsible: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Consultor Interno</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.consultant}
                      onChange={e => setFormData({...formData, consultant: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Valor Oportunidade (R$)</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.opportunityValue}
                      onChange={e => setFormData({...formData, opportunityValue: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Última Reunião</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.lastMeetingDate}
                      onChange={e => setFormData({...formData, lastMeetingDate: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center space-x-3 pt-8">
                    <input 
                      type="checkbox" 
                      id="propSent"
                      className="w-5 h-5 accent-indigo-600 rounded"
                      checked={formData.proposalSent}
                      onChange={e => setFormData({...formData, proposalSent: e.target.checked})}
                    />
                    <label htmlFor="propSent" className="text-sm font-semibold text-gray-700">Proposta Enviada</label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Anotações e Histórico</label>
                  <textarea 
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Descreva as interações, feedbacks e próximos passos..."
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                  />
                </div>

                {(formData.phase === FunnelPhase.FECHADO || formData.phase === FunnelPhase.PERDIDO) && (
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl border ${
                    formData.phase === FunnelPhase.FECHADO ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
                  }`}>
                    <div className="space-y-2">
                      <label className={`text-sm font-semibold ${formData.phase === FunnelPhase.FECHADO ? 'text-green-800' : 'text-red-800'}`}>
                        Data do Fechamento/Perda
                      </label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.closingDate || ''}
                        onChange={e => setFormData({...formData, closingDate: e.target.value})}
                      />
                    </div>
                    {formData.phase === FunnelPhase.FECHADO && (
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-green-800">Valor Final (R$)</label>
                        <input 
                          type="number" 
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                          value={formData.closedValue || 0}
                          onChange={e => setFormData({...formData, closedValue: Number(e.target.value)})}
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-4 pt-4 border-t border-gray-100 mt-4">
                  {editingOpp && (
                    <button 
                      type="button" 
                      onClick={handleDeleteFromModal}
                      className="px-5 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center"
                      title="Excluir Oportunidade"
                    >
                      <Trash2 size={22} />
                    </button>
                  )}
                  
                  <button 
                    type="button" 
                    onClick={closeModal}
                    className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="flex-[2] py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                  >
                    {editingOpp ? 'Atualizar Oportunidade' : 'Criar Oportunidade'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunityList;
