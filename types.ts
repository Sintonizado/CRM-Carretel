
export enum FunnelPhase {
  PROSPECCAO = 'Prospecção',
  NEGOCIACAO = 'Negociação',
  PROPOSTA = 'Proposta',
  PERDIDO = 'Perdido',
  FECHADO = 'Fechado'
}

export interface Contact {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  uf: string;
  position: string;
  registration_date: string;
}

export interface Opportunity {
  id: string;
  user_id?: string;
  contact_id: string;
  visit_date: string;
  city: string;
  uf: string;
  responsible: string;
  position: string;
  consultant: string;
  phase: FunnelPhase;
  notes: string;
  opportunity_value: number;
  last_meeting_date: string;
  proposal_sent: boolean;
  closing_date?: string;
  closed_value?: number;
}

export interface Municipality {
  uf: string;
  ente: string;
  ibge: string;
  receitaEstimada: number;
  populacao: number;
  vaaf: number;
  vaat: number;
  vaar: number;
  complementacaoUniao: number;
  totalReceitas: number;
  porte: string;
}

export type ViewType = 'dashboard' | 'contacts' | 'opportunities' | 'calendar';
