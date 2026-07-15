
import { Municipality } from "../types";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1YGVTiiWwESHYwNyXsy-NxP8_RCbEi1ADhIiCsnhucp4/export?format=csv&gid=0";

const parseBRNumber = (val: string): number => {
  if (!val) return 0;
  // Remove símbolos de moeda, pontos de milhar e troca vírgula por ponto
  const clean = val.replace(/[R$\s.]/g, '').replace(',', '.');
  return parseFloat(clean) || 0;
};

export const DataService = {
  fetchMunicipalities: async (): Promise<Municipality[]> => {
    try {
      const response = await fetch(SHEET_URL);
      const csvText = await response.text();
      
      // Split por linhas, ignorando a primeira (header)
      const lines = csvText.split(/\r?\n/).slice(1);
      
      return lines.map(line => {
        // Regex para lidar com campos que podem conter vírgulas dentro de aspas
        const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        
        if (cols.length < 10) return null;

        return {
          uf: cols[0]?.replace(/"/g, '').trim(),
          ente: cols[1]?.replace(/"/g, '').trim(),
          ibge: cols[2]?.replace(/"/g, '').trim(),
          receitaEstimada: parseBRNumber(cols[3]),
          populacao: parseBRNumber(cols[4]),
          vaaf: parseBRNumber(cols[5]),
          vaat: parseBRNumber(cols[6]),
          vaar: parseBRNumber(cols[7]),
          complementacaoUniao: parseBRNumber(cols[8]),
          totalReceitas: parseBRNumber(cols[9]),
          porte: cols[10]?.replace(/"/g, '').trim() || 'N/A'
        };
      }).filter(item => item !== null) as Municipality[];
    } catch (error) {
      console.error("Erro ao carregar dados dos municípios:", error);
      return [];
    }
  }
};
