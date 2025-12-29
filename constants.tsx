
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar as CalendarIcon,
  TrendingUp,
  DollarSign,
  PlusCircle,
  MoreVertical,
  Search,
  Filter
} from 'lucide-react';

export const NAVIGATION = [
  { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'contacts', name: 'Contatos', icon: <Users size={20} /> },
  { id: 'opportunities', name: 'Oportunidades', icon: <Briefcase size={20} /> },
  { id: 'calendar', name: 'Agenda', icon: <CalendarIcon size={20} /> },
];

export const BRAZIL_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const FUNNEL_PHASES = [
  'Prospecção', 'Negociação', 'Proposta', 'Perdido', 'Fechado'
];

export const ICONS = {
  TrendingUp,
  DollarSign,
  PlusCircle,
  MoreVertical,
  Search,
  Filter
};
