
import { GoogleGenAI, Type } from "@google/genai";

/**
 * Função principal para conversar com a Dona Camila
 */
export async function askDonaCamila(message: string, userName: string = "Amiga") {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: `Você é a Dona Camila, especialista em Lar Inteligente e MESTRA PADEIRA. 
        Seu tom é materno, acolhedor e focado em ECONOMIA DOMÉSTICA REALISTA. 
        O nome da pessoa usuária é ${userName}.
        
        DIRETRIZES DE COMUNICAÇÃO:
        1. Especialidade em PÃES: Sempre que falarem de pão, ensine o pulo do gato.
        2. Priorize receitas de baixo custo.
        3. Destaque o PÃO DE ÁGUA como o rei da economia.
        4. Use negrito para destacar valores e tempos.
        
        ESTRUTURA DE RESPOSTA:
        # [Nome da Receita]
        - **Categoria:** [Categoria]
        - **Custo p/ Pessoa:** R$ [Valor]
        - **Tempo de Preparo:** [X] minutos
        - **Dificuldade:** [Fácil/Médio/Difícil]
        
        **Ingredientes:**
        - [Qtd] [Ingrediente]
        
        **Modo de Preparo:**
        1. [Ação objetiva]
        
        **DICA DA DONA CAMILA:** [Conselho de ouro]`,
        temperature: 0.7,
      },
    });

    return response.text || "Puxa vida, me distraí aqui na cozinha! Pode perguntar de novo, meu bem?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ops! Parece que o pão queimou no forno. Pode repetir sua dúvida?";
  }
}

/**
 * Geração de múltiplas receitas para alimentar a Receiteca Infinita
 */
export async function searchRecipesAI(query: string, count: number = 6) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere uma lista de ${count} receitas únicas relacionadas a: "${query}".`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              nome: { type: Type.STRING },
              categoria: { type: Type.STRING },
              subcategoria: { type: Type.STRING },
              tipoPreparo: { type: Type.STRING },
              descricao: { type: Type.STRING },
              custo: { type: Type.STRING, enum: ["baixo", "médio", "alto"] },
              custoPorPorcao: { type: Type.NUMBER },
              tempoPreparo: { type: Type.STRING },
              tempoCozimento: { type: Type.STRING },
              tempoTotal: { type: Type.STRING },
              rendimento: { type: Type.STRING },
              nivel: { type: Type.STRING, enum: ["baixo", "médio", "alto"] },
              ocasiao: { type: Type.STRING },
              ingredientes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    nome: { type: Type.STRING },
                    quantidade: { type: Type.STRING }
                  },
                  required: ["nome", "quantidade"]
                }
              },
              modo_de_preparo: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["nome", "categoria", "ingredientes", "modo_de_preparo", "custo", "tempoTotal", "tempoPreparo", "tempoCozimento", "rendimento", "nivel", "ocasiao"]
          }
        },
        systemInstruction: "Você é um Chef brasileiro especializado em economia e sabor. Categorize como: Café da Manhã, Almoço, Jantar, Lanches, Sobremesas ou Bebidas."
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Infinite Recipe Error:", error);
    return [];
  }
}

export async function generateRecipeAI(prompt: string, budgetLevel: 'baixo' | 'médio' | 'alto' = 'baixo') {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere uma receita detalhada de: "${prompt}". Nível de custo: ${budgetLevel}.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nome: { type: Type.STRING },
            categoria: { type: Type.STRING },
            subcategoria: { type: Type.STRING },
            tipoPreparo: { type: Type.STRING },
            ocasiao: { type: Type.STRING },
            descricao: { type: Type.STRING },
            custo: { type: Type.STRING, enum: ["baixo", "médio", "alto"] },
            tempoPreparo: { type: Type.STRING },
            tempoCozimento: { type: Type.STRING },
            tempoTotal: { type: Type.STRING },
            rendimento: { type: Type.STRING },
            nivel: { type: Type.STRING, enum: ["baixo", "médio", "alto"] },
            ingredientes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nome: { type: Type.STRING },
                  quantidade: { type: Type.STRING }
                },
                required: ["nome", "quantidade"]
              }
            },
            modo_de_preparo: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["nome", "categoria", "ingredientes", "modo_de_preparo", "custo", "tempoTotal", "tempoPreparo", "tempoCozimento", "rendimento", "nivel", "ocasiao"]
        },
        systemInstruction: "Você é um Chef de Cozinha especialista em panificação e cozinha brasileira econômica."
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Recipe Generator Error:", error);
    return null;
  }
}

export async function getRegionalMarketPrices(cep: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Identifique a cidade do CEP ${cep} e forneça preços médios realistas.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            localidade: { type: Type.STRING },
            precos: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  item: { type: Type.STRING },
                  preco: { type: Type.STRING },
                  tendencia: { type: Type.STRING }
                }
              }
            }
          },
          required: ["localidade", "precos"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Price Error:", error);
    return null;
  }
}

export async function generateMaintenanceActivity(prompt: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere uma atividade de manutenção técnica para: "${prompt}".`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            subcategory: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            complexity: { type: Type.STRING },
            materials: { type: Type.ARRAY, items: { type: Type.STRING } },
            estimatedTime: { type: Type.STRING },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return null;
  }
}
