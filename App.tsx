
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ContactList from './components/ContactList';
import OpportunityList from './components/OpportunityList';
import CalendarView from './components/CalendarView';
import Login from './components/Login';
import { ViewType, Contact, Opportunity } from './types';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchData();
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchData();
      else {
        setContacts([]);
        setOpportunities([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [contactsRes, oppsRes] = await Promise.all([
        supabase.from('contacts').select('*').order('name'),
        supabase.from('opportunities').select('*').order('created_at', { ascending: false })
      ]);

      if (contactsRes.error) throw contactsRes.error;
      if (oppsRes.error) throw oppsRes.error;

      if (contactsRes.data) setContacts(contactsRes.data);
      if (oppsRes.data) setOpportunities(oppsRes.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Deseja realmente sair?')) {
      await supabase.auth.signOut();
    }
  };

  const handleOpenOpportunityFromCalendar = (id: string) => {
    setSelectedOppId(id);
    setActiveView('opportunities');
  };

  const addContact = async (contact: Contact) => {
    try {
      const { id, ...contactData } = contact;
      const cleanData = { ...contactData, user_id: session.user.id };
      const { data, error } = await supabase.from('contacts').insert([cleanData]).select();
      if (error) throw error;
      if (data) {
        setContacts(prev => [...prev, data[0]]);
        return data[0];
      }
    } catch (error) {
      console.error('Erro ao adicionar contato:', error);
      alert('Erro ao salvar contato: ' + (error as any).message);
    }
  };

  const updateContact = async (updated: Contact) => {
    try {
      const { error } = await supabase.from('contacts').update(updated).eq('id', updated.id);
      if (error) throw error;
      setContacts(prev => prev.map(c => c.id === updated.id ? updated : c));
    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
      alert('Erro ao atualizar contato.');
    }
  };

  const deleteContact = async (id: string) => {
    if (!id) return;
    try {
      console.log('Tentando excluir contato:', id);
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Atualiza estado local apenas se deletar no banco com sucesso
      setContacts(prev => prev.filter(c => c.id !== id));
      setOpportunities(prev => prev.filter(o => o.contact_id !== id));
      console.log('Contato excluído com sucesso');
    } catch (error: any) {
      console.error('Erro ao deletar contato:', error);
      alert(`Não foi possível excluir o contato. Motivo: ${error.message || 'Erro desconhecido'}`);
    }
  };

  const addOpportunity = async (opp: Opportunity) => {
    try {
      const { id, ...oppData } = opp;
      const cleanData = { ...oppData, user_id: session.user.id };
      const { data, error } = await supabase.from('opportunities').insert([cleanData]).select();
      if (error) throw error;
      if (data) setOpportunities(prev => [data[0], ...prev]);
    } catch (error) {
      console.error('Erro ao adicionar oportunidade:', error);
      alert('Erro ao salvar oportunidade.');
    }
  };

  const updateOpportunity = async (updated: Opportunity) => {
    try {
      const { error } = await supabase.from('opportunities').update(updated).eq('id', updated.id);
      if (error) throw error;
      setOpportunities(prev => prev.map(o => o.id === updated.id ? updated : o));
    } catch (error) {
      console.error('Erro ao atualizar oportunidade:', error);
      alert('Erro ao atualizar oportunidade.');
    }
  };

  const deleteOpportunity = async (id: string) => {
    if (!id) return;
    try {
      console.log('Tentando excluir oportunidade:', id);
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setOpportunities(prev => prev.filter(o => o.id !== id));
      console.log('Oportunidade excluída com sucesso');
    } catch (error: any) {
      console.error('Erro ao deletar oportunidade:', error);
      alert(`Não foi possível excluir a oportunidade. Motivo: ${error.message || 'Erro desconhecido'}`);
    }
  };

  if (!session && !loading) return <Login onLogin={() => {}} />;
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard opportunities={opportunities} contacts={contacts} />;
      case 'contacts':
        return <ContactList contacts={contacts} searchTerm={searchTerm} onAddContact={addContact} onUpdateContact={updateContact} onDeleteContact={deleteContact} />;
      case 'opportunities':
        return (
          <OpportunityList 
            opportunities={opportunities} 
            contacts={contacts} 
            searchTerm={searchTerm}
            onAddOpportunity={addOpportunity} 
            onUpdateOpportunity={updateOpportunity}
            onDeleteOpportunity={deleteOpportunity}
            onAddContact={addContact}
            initialEditId={selectedOppId}
            onClearInitialEdit={() => setSelectedOppId(null)}
          />
        );
      case 'calendar':
        return <CalendarView opportunities={opportunities} onSelectOpportunity={handleOpenOpportunityFromCalendar} />;
      default:
        return <Dashboard opportunities={opportunities} contacts={contacts} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeView={activeView} setActiveView={(view) => { setActiveView(view); setIsSidebarOpen(false); }} onLogout={handleLogout} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
      <div className="flex-1 flex flex-col min-w-0">
        <Header activeView={activeView} searchTerm={searchTerm} onSearchChange={setSearchTerm} onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-4 md:p-8 flex-1 overflow-y-auto">{renderView()}</main>
      </div>
    </div>
  );
};

export default App;
