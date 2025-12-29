
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ContactList from './components/ContactList';
import OpportunityList from './components/OpportunityList';
import CalendarView from './components/CalendarView';
import { ViewType, Contact, Opportunity, FunnelPhase } from './types';

// Mock Initial Data
const INITIAL_CONTACTS: Contact[] = [
  { id: '1', name: 'João Silva', email: 'joao@tech.com', phone: '(11) 98888-7777', city: 'São Paulo', uf: 'SP', position: 'CTO', registrationDate: '2024-01-15' },
  { id: '2', name: 'Maria Souza', email: 'maria@vendas.com', phone: '(21) 97777-6666', city: 'Rio de Janeiro', uf: 'RJ', position: 'Diretora Comercial', registrationDate: '2024-02-10' },
];

const INITIAL_OPPS: Opportunity[] = [
  { 
    id: '101', 
    contactId: '1', 
    visitDate: '2024-05-10', 
    city: 'São Paulo', 
    uf: 'SP', 
    responsible: 'Roberto Melo', 
    position: 'Gerente', 
    consultant: 'Alice Santos', 
    phase: FunnelPhase.PROPOSTA, 
    notes: 'Cliente interessado em expansão de licenças.', 
    opportunityValue: 50000, 
    lastMeetingDate: '2024-05-12', 
    proposalSent: true 
  },
  { 
    id: '102', 
    contactId: '2', 
    visitDate: '2024-05-15', 
    city: 'Rio de Janeiro', 
    uf: 'RJ', 
    responsible: 'Marcos Braz', 
    position: 'VP', 
    consultant: 'Bruno Lima', 
    phase: FunnelPhase.FECHADO, 
    notes: 'Contrato assinado em tempo recorde.', 
    opportunityValue: 120000, 
    lastMeetingDate: '2024-05-14', 
    proposalSent: true,
    closingDate: '2024-05-20',
    closedValue: 115000
  },
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('carretel_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem('carretel_opps');
    return saved ? JSON.parse(saved) : INITIAL_OPPS;
  });

  useEffect(() => {
    localStorage.setItem('carretel_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('carretel_opps', JSON.stringify(opportunities));
  }, [opportunities]);

  const addContact = (contact: Contact) => setContacts(prev => [...prev, contact]);
  const updateContact = (updated: Contact) => setContacts(prev => prev.map(c => c.id === updated.id ? updated : c));
  
  const deleteContact = (id: string) => {
    // A confirmação agora é feita no componente para melhor UX
    setContacts(prev => prev.filter(c => c.id !== id));
    setOpportunities(prev => prev.filter(o => o.contactId !== id));
  };

  const addOpportunity = (opp: Opportunity) => setOpportunities(prev => [...prev, opp]);
  const updateOpportunity = (updated: Opportunity) => setOpportunities(prev => prev.map(o => o.id === updated.id ? updated : o));
  
  const deleteOpportunity = (id: string) => {
    // A confirmação agora é feita no componente para melhor UX
    setOpportunities(prev => prev.filter(o => o.id !== id));
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard opportunities={opportunities} contacts={contacts} />;
      case 'contacts':
        return <ContactList 
          contacts={contacts} 
          onAddContact={addContact} 
          onUpdateContact={updateContact} 
          onDeleteContact={deleteContact} 
        />;
      case 'opportunities':
        return <OpportunityList 
          opportunities={opportunities} 
          contacts={contacts} 
          onAddOpportunity={addOpportunity} 
          onUpdateOpportunity={updateOpportunity}
          onDeleteOpportunity={deleteOpportunity}
        />;
      case 'calendar':
        return <CalendarView opportunities={opportunities} />;
      default:
        return <Dashboard opportunities={opportunities} contacts={contacts} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header activeView={activeView} />
        <main className="p-4 md:p-8 flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
