
import { GoogleGenAI } from "@google/genai";
import { Opportunity } from "../types";

const GeminiService = {
  getFunnelInsights: async (opportunities: Opportunity[]): Promise<string> => {
    try {
      // Create instance right before making the call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      
      const summary = opportunities.map(o => ({
        fase: o.phase,
        valor: o.opportunityValue,
        consultor: o.consultant,
        proposta: o.proposalSent
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analise esses dados de um CRM comercial: ${JSON.stringify(summary)}. 
        Forneça um resumo estratégico curto em 3 pontos: 
        1. Saúde atual do pipeline. 
        2. Gargalos identificados. 
        3. Uma recomendação prática para o time de vendas.
        Responda em Português do Brasil com tom profissional.`,
      });

      return response.text || "Não foi possível gerar insights no momento.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Erro ao conectar com a IA. Verifique sua chave de API.";
    }
  }
};

export default GeminiService;
