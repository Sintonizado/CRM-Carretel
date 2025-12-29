
import React, { useState, useEffect } from 'react';
import { Contact } from '../types';
import { ICONS, BRAZIL_STATES } from '../constants';
import { Pencil, Trash2, X } from 'lucide-react';

interface ContactListProps {
  contacts: Contact[];
  onAddContact: (contact: Contact) => void;
  onUpdateContact: (contact: Contact) => void;
  onDeleteContact: (id: string) => void;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, onAddContact, onUpdateContact, onDeleteContact }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState<Partial<Contact>>({
    name: '',
    email: '',
    phone: '',
    city: '',
    uf: 'SP',
    position: '',
    registrationDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (editingContact) {
      setFormData(editingContact);
      setIsModalOpen(true);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        uf: 'SP',
        position: '',
        registrationDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [editingContact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingContact) {
      onUpdateContact({ ...editingContact, ...formData } as Contact);
    } else {
      const newContact: Contact = {
        ...formData as Contact,
        id: Math.random().toString(36).substr(2, 9)
      };
      onAddContact(newContact);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
  };

  const handleDeleteFromModal = () => {
    if (editingContact) {
      if (window.confirm(`Tem certeza que deseja excluir "${editingContact.name}"? Todas as oportunidades vinculadas também serão removidas.`)) {
        onDeleteContact(editingContact.id);
        closeModal();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Base de Contatos</h1>
          <p className="text-gray-500 mt-1">Gerencie seus relacionamentos e conexões comerciais.</p>
        </div>
        <button 
          onClick={() => { setEditingContact(null); setIsModalOpen(true); }}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
        >
          <ICONS.PlusCircle size={20} />
          Novo Contato
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cargo</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                    Nenhum contato cadastrado.
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">
                          {contact.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{contact.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{contact.position}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{contact.email}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setEditingContact(contact)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingContact ? 'Editar Contato' : 'Registrar Novo Contato'}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Nome Completo</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">E-mail</label>
                    <input 
                      required
                      type="email" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Telefone</label>
                    <input 
                      required
                      type="tel" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Cargo</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={formData.position}
                      onChange={e => setFormData({...formData, position: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Cidade</label>
                    <input 
                      required
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">UF</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={formData.uf}
                      onChange={e => setFormData({...formData, uf: e.target.value})}
                    >
                      {BRAZIL_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-50 mt-4">
                  {editingContact && (
                    <button 
                      type="button" 
                      onClick={handleDeleteFromModal}
                      className="px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center"
                      title="Excluir Contato"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                  
                  <button 
                    type="button" 
                    onClick={closeModal}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  
                  <button 
                    type="submit" 
                    className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                  >
                    {editingContact ? 'Salvar Alterações' : 'Salvar Contato'}
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

export default ContactList;
