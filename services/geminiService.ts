
import { GoogleGenAI } from "@google/genai";
import { FreightDataState } from "../types";

export const analyzeFreightPerformance = async (data: FreightDataState) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const totalRevenue = data.trips.reduce((acc, t) => acc + (t.revenue || 0), 0);
    const totalCosts = data.costs.reduce((acc, c) => acc + (c.amount || 0), 0);
    const netProfit = totalRevenue - totalCosts;

    // Detectar se os dados enviados são filtrados (IA foca no contexto)
    const distinctDestinations = [...new Set(data.trips.map(t => t.destination))];
    const isFiltered = distinctDestinations.length === 1;
    const targetDest = isFiltered ? distinctDestinations[0] : "Malha Logística Geral";

    const prompt = `
      CONTEXTO: Você está analisando o desempenho de: ${targetDest}.
      
      DADOS FINANCEIROS ATUAIS:
      - Faturamento: R$${totalRevenue}
      - Custos Totais: R$${totalCosts}
      - Lucro Líquido: R$${netProfit}
      - Margem: ${((netProfit/totalRevenue)*100).toFixed(1)}%

      DETALHAMENTO DE VIAGENS:
      ${data.trips.map(t => `- De ${t.origin} para ${t.destination}: R$${t.revenue} (${t.cargoWeight}kg)`).join('\n')}

      TAREFA:
      1. Se for uma rota específica (${targetDest}), use o Google Maps para sugerir pontos de descanso e postos de combustível com bom custo-benefício nesse trajeto.
      2. Se for a visão geral, identifique qual região está sendo mais custosa.
      3. Dê uma recomendação técnica baseada em geolocalização.
      
      Responda em Português do Brasil com tom executivo e direto. Use Markdown.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        temperature: 0.3,
      }
    });

    let groundingText = "";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
        groundingText = "\n\n### Referências Geográficas Sugeridas:\n" + chunks
            .filter((c: any) => c.maps)
            .map((c: any) => `- [${c.maps.title}](${c.maps.uri})`)
            .join('\n');
    }

    return (response.text || "Análise indisponível no momento.") + groundingText;
  } catch (error) {
    console.error("Erro na análise Gemini:", error);
    return "Erro ao gerar insights geográficos. Tente novamente em instantes.";
  }
};
