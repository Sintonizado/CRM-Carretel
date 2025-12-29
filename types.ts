
export enum FunnelPhase {
  PROSPECCAO = 'Prospecção',
  NEGOCIACAO = 'Negociação',
  PROPOSTA = 'Proposta',
  PERDIDO = 'Perdido',
  FECHADO = 'Fechado'
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  uf: string;
  position: string;
  registrationDate: string;
}

export interface Opportunity {
  id: string;
  contactId: string;
  visitDate: string;
  city: string;
  uf: string;
  responsible: string;
  position: string;
  consultant: string;
  phase: FunnelPhase;
  notes: string;
  opportunityValue: number;
  lastMeetingDate: string;
  proposalSent: boolean;
  closingDate?: string;
  closedValue?: number;
}

export type ViewType = 'dashboard' | 'contacts' | 'opportunities' | 'calendar';
