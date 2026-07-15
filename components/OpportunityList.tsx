
import React, { useState, useEffect } from 'react';
import { Opportunity, Contact, FunnelPhase } from '../types';
import { ICONS, BRAZIL_STATES } from '../constants';
import { Trash2, Pencil, X, Eye, MapPin } from 'lucide-react';

interface OpportunityListProps {
  opportunities: Opportunity[];
  contacts: Contact[];
  searchTerm: string;
  onAddOpportunity: (opp: Opportunity) => void;
  onUpdateOpportunity: (opp: Opportunity) => void;
  onDeleteOpportunity: (id: string) => void;
  onAddContact?: (contact: Contact) => Promise<Contact | null | void>;
  initialEditId?: string | null;
  onClearInitialEdit?: () => void;
}

const OpportunityList: React.FC<OpportunityListProps> = ({ 
  opportunities, 
  contacts, 
  searchTerm,
  onAddOpportunity, 
  onUpdateOpportunity, 
  onDeleteOpportunity,
  onAddContact,
  initialEditId,
  onClearInitialEdit
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingContact, setIsCreatingContact] = useState(false);
  const [newContactForm, setNewContactForm] = useState<Partial<Contact>>({
    name: '', email: '', phone: '', city: '', uf: 'SP', position: '', registration_date: new Date().toISOString().split('T')[0]
  });
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [formData, setFormData] = useState<Partial<Opportunity>>({
    contact_id: '',
    visit_date: new Date().toISOString().split('T')[0],
    city: '',
    uf: 'SP',
    responsible: '',
    position: '',
    consultant: '',
    phase: FunnelPhase.PROSPECCAO,
    notes: '',
    opportunity_value: '' as unknown as number,
    last_meeting_date: new Date().toISOString().split('T')[0],
    proposal_sent: false
  });

  // Detecta se uma oportunidade foi clicada na agenda
  useEffect(() => {
    if (initialEditId) {
      const opp = opportunities.find(o => o.id === initialEditId);
      if (opp) {
        setEditingOpp(opp);
        setIsModalOpen(true);
      }
      if (onClearInitialEdit) onClearInitialEdit();
    }
  }, [initialEditId, opportunities, onClearInitialEdit]);

  useEffect(() => {
    if (editingOpp) {
      setFormData(editingOpp);
      setIsModalOpen(true);
    } else {
      setFormData({
        contact_id: '',
        visit_date: new Date().toISOString().split('T')[0],
        city: '',
        uf: 'SP',
        responsible: '',
        position: '',
        consultant: '',
        phase: FunnelPhase.PROSPECCAO,
        notes: '',
        opportunity_value: '' as unknown as number,
        last_meeting_date: new Date().toISOString().split('T')[0],
        proposal_sent: false
      });
    }
  }, [editingOpp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.contact_id) {
      alert("Por favor, selecione um contato.");
      return;
    }

    if (editingOpp) {
      await onUpdateOpportunity({ ...editingOpp, ...formData } as Opportunity);
    } else {
      await onAddOpportunity(formData as Opportunity);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOpp(null);
    setIsCreatingContact(false);
  };

  const handleCreateContact = async () => {
    if (!newContactForm.name || !onAddContact) return;
    const newContact = await onAddContact(newContactForm as Contact);
    if (newContact) {
      setFormData({ ...formData, contact_id: newContact.id });
      setIsCreatingContact(false);
      setNewContactForm({ name: '', email: '', phone: '', city: '', uf: 'SP', position: '', registration_date: new Date().toISOString().split('T')[0] });
    }
  };

  const getContactName = (id: string) => contacts.find(c => c.id === id)?.name || 'Contato Excluído';

  const filteredOpps = opportunities.filter(opp => {
    const search = searchTerm.toLowerCase();
    const contactName = getContactName(opp.contact_id).toLowerCase();
    return (
      contactName.includes(search) ||
      opp.city.toLowerCase().includes(search) ||
      opp.responsible.toLowerCase().includes(search) ||
      opp.consultant.toLowerCase().includes(search)
    );
  });

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
        {filteredOpps.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100 italic">
            Nenhuma oportunidade encontrada.
          </div>
        ) : (
          filteredOpps.map((opp) => (
            <div key={opp.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  opp.phase === FunnelPhase.FECHADO ? 'bg-green-100 text-green-700' :
                  opp.phase === FunnelPhase.PERDIDO ? 'bg-red-100 text-red-700' :
                  'bg-indigo-100 text-indigo-700'
                }`}>
                  {opp.phase}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => setEditingOpp(opp)} className="p-1.5 text-gray-400 hover:text-indigo-600"><Pencil size={14}/></button>
                   <button onClick={() => {if(confirm('Excluir?')) onDeleteOpportunity(opp.id)}} className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 size={14}/></button>
                </div>
              </div>
              
              <h3 className="font-bold text-lg text-gray-800 mb-1">{getContactName(opp.contact_id)}</h3>
              <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                <MapPin size={14} />
                {opp.city}, {opp.uf}
              </p>
              
              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Valor Estimado:</span>
                  <span className="text-gray-900 font-bold">R$ {opp.opportunity_value?.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Consultor:</span>
                  <span className="text-gray-700 font-medium">{opp.consultant}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-end">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-full">
            <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-bold text-gray-900">
                {editingOpp ? 'Editar Oportunidade' : 'Registrar Oportunidade'}
              </h3>
              <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={28} />
              </button>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Contato Responsável</label>
                    {isCreatingContact ? (
                      <div className="p-4 border rounded-xl bg-gray-50 space-y-3">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-sm text-gray-800">Novo Contato</h4>
                          <button type="button" onClick={() => setIsCreatingContact(false)} className="text-xs text-gray-500 hover:text-gray-700">Cancelar</button>
                        </div>
                        <input type="text" placeholder="Nome *" required className="w-full px-3 py-2 border rounded-lg text-sm" value={newContactForm.name} onChange={e => setNewContactForm({...newContactForm, name: e.target.value})} />
                        <input type="text" placeholder="Cargo" className="w-full px-3 py-2 border rounded-lg text-sm" value={newContactForm.position} onChange={e => setNewContactForm({...newContactForm, position: e.target.value})} />
                        <input type="email" placeholder="Email" className="w-full px-3 py-2 border rounded-lg text-sm" value={newContactForm.email} onChange={e => setNewContactForm({...newContactForm, email: e.target.value})} />
                        <input type="text" placeholder="Telefone" className="w-full px-3 py-2 border rounded-lg text-sm" value={newContactForm.phone} onChange={e => setNewContactForm({...newContactForm, phone: e.target.value})} />
                        <div className="flex gap-2">
                           <input type="text" placeholder="Cidade" className="w-full px-3 py-2 border rounded-lg text-sm" value={newContactForm.city} onChange={e => setNewContactForm({...newContactForm, city: e.target.value})} />
                           <input type="text" placeholder="UF" className="w-16 px-3 py-2 border rounded-lg text-sm" value={newContactForm.uf} onChange={e => setNewContactForm({...newContactForm, uf: e.target.value})} />
                        </div>
                        <button type="button" onClick={handleCreateContact} className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                          Salvar Contato
                        </button>
                      </div>
                    ) : (
                      <select 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
                        value={formData.contact_id}
                        onChange={e => {
                          if (e.target.value === 'NEW') {
                            setIsCreatingContact(true);
                            setFormData({...formData, contact_id: ''});
                          } else {
                            setFormData({...formData, contact_id: e.target.value});
                          }
                        }}
                      >
                        <option value="">Selecione um contato...</option>
                        <option value="NEW" className="font-bold text-indigo-600">+ Adicionar Novo Contato</option>
                        {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    )}
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
                    <label className="text-sm font-semibold text-gray-700">UF</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.uf}
                      onChange={e => setFormData({...formData, uf: e.target.value})}
                    >
                      {BRAZIL_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Consultor</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.consultant}
                      onChange={e => setFormData({...formData, consultant: e.target.value})}
                      placeholder="Nome do consultor"
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
                    <label className="text-sm font-semibold text-gray-700">Valor Oportunidade (R$)</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.opportunity_value === undefined ? '' : formData.opportunity_value}
                      onChange={e => setFormData({...formData, opportunity_value: e.target.value === '' ? ('' as unknown as number) : Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Data Visita</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.visit_date}
                      onChange={e => setFormData({...formData, visit_date: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Anotações</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-100 mt-4">
                  <button 
                    type="button" 
                    onClick={closeModal}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-colors"
                  >
                    {editingOpp ? 'Salvar Alterações' : 'Criar Oportunidade'}
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
