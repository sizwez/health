
import { GoogleGenAI, Type } from "@google/genai";
import { FitnessPlan, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getLocalHealthInsights = async (province: string): Promise<{ text: string, sources: GroundingSource[] }> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Find the 3 most important recent health news or public health alerts specifically for the ${province} province in South Africa. Provide a brief summary for each.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const sources: GroundingSource[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.map((chunk: any) => ({
      title: chunk.web?.title || 'Health Source',
      uri: chunk.web?.uri
    }))
    .filter((s: any) => s.uri) || [];

  return {
    text: response.text || "Unable to fetch latest news.",
    sources
  };
};

export const findNearbyClinics = async (lat: number, lng: number): Promise<{ text: string, sources: GroundingSource[] }> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Find the nearest public and private health clinics and pharmacies to my current location. List their names and provide navigation links.",
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: { latitude: lat, longitude: lng }
        }
      }
    },
  });

  const sources: GroundingSource[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.map((chunk: any) => ({
      title: chunk.maps?.title || 'Location',
      uri: chunk.maps?.uri
    }))
    .filter((s: any) => s.uri) || [];

  return { text: response.text || "", sources };
};

export const startTriageSession = (systemInstruction: string) => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: systemInstruction + " You are an AI Triage Assistant for HealthBridge SA. Your goal is to help users decide if they need to see a doctor. Use Google Search to check for current health outbreaks in SA. ALWAYS include a disclaimer that you are not a doctor.",
      tools: [{ googleSearch: {} }]
    }
  });
};

export const generateHealthPlan = async (userGoal: string, currentLevel: string, province: string): Promise<FitnessPlan> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a health and nutrition plan for a user in ${province}, South Africa. 
    Goal: ${userGoal}
    Current Fitness Level: ${currentLevel}
    Please include local food recommendations (e.g. Pap, Biltong, Morogo).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          workout: { type: Type.ARRAY, items: { type: Type.STRING } },
          nutrition: { type: Type.ARRAY, items: { type: Type.STRING } },
          advice: { type: Type.STRING }
        },
        required: ["workout", "nutrition", "advice"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (error) {
    return {
      workout: ["Daily 30-minute walk"],
      nutrition: ["Local balanced meals"],
      advice: "Consult a professional."
    };
  }
};
