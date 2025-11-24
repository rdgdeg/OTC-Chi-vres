import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// We no longer import mockData directly. The data will be passed from the React Component.

const getSystemInstruction = (data: any) => {
  // Construct context string from dynamic data
  const contextData = JSON.stringify({
    musees: data.museums?.map((m: any) => ({ nom: m.name, description: m.description, adresse: m.address })),
    restaurants: data.restaurants?.map((r: any) => ({ nom: r.name, type: r.tags.join(', '), description: r.description })),
    hebergements: data.accommodation?.map((h: any) => ({ nom: h.name, type: h.type, description: h.description })),
    commerces: data.merchants?.map((c: any) => ({ nom: c.name, description: c.description })),
    evenements: data.events?.map((e: any) => ({ titre: e.title, date: e.date, description: e.description })),
    balades: data.walks?.map((w: any) => ({ nom: w.name, distance: w.distance, difficulte: w.difficulty })),
    history: "Chièvres est connue pour la Tour de Gavre, la Chapelle de la Ladrerie, le jeu de Crossage (soule), et la bière Mader (ou l'Aviateur). Il y a aussi une base aérienne importante (Chièvres Air Base)."
  });

  return `
    Tu es "ChievresBot", un assistant touristique expert et chaleureux pour la ville de Chièvres, Belgique.
    Ton but est d'aider les visiteurs à planifier leur séjour.
    
    Voici les données EN TEMPS RÉEL du site web de l'Office du Tourisme :
    ${contextData}

    Règles :
    1. Sois poli, accueillant et enthousiaste.
    2. Réponds en français.
    3. Utilise UNIQUEMENT les informations fournies dans le contexte JSON ci-dessus. Si un commerce ou un lieu n'est pas dans la liste, dis poliment que tu n'as pas l'information.
    4. Sois concis mais informatif.
    5. Si on te demande "Que faire ?", propose un mix de musées et de balades.
  `;
};

let aiClient: GoogleGenAI | null = null;

export const initGemini = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is not set in environment variables.");
    return;
  }
  aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Now accepts 'contextData' which allows the AI to know about CMS updates
export const sendMessageToGemini = async (message: string, contextData: any): Promise<string> => {
  if (!aiClient) {
    initGemini();
  }
  
  if (!aiClient) {
    return "Désolé, je ne peux pas me connecter au service d'IA pour le moment (Clé API manquante).";
  }

  try {
    const response: GenerateContentResponse = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: getSystemInstruction(contextData),
      }
    });
    
    return response.text || "Désolé, je n'ai pas pu générer de réponse.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Une erreur est survenue lors de la communication avec l'assistant.";
  }
};

export const generateMuseumImage = async (museumName: string, description: string): Promise<string | null> => {
  if (!aiClient) {
    initGemini();
  }

  if (!aiClient) {
    console.error("API Key missing for image generation");
    return null;
  }

  try {
    const prompt = `A high quality, photorealistic, touristic photography of: ${museumName} in Chièvres, Belgium. Context: ${description}. Bright sunny day, architectural detail, inviting atmosphere.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      }
    });

    // Extract image from response parts
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    return null;
  }
};