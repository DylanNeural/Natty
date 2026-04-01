import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface Place {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  rating?: number;
  url?: string;
}

export const searchHealthyPlaces = async (lat: number, lng: number): Promise<Place[]> => {
  try {
    // Step 1: Use googleMaps for grounding to find real places
    const groundingResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Trouve des restaurants healthy, des magasins bio ou des frigos connectés de nourriture saine autour de ces coordonnées : ${lat}, ${lng}.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      },
    });

    // Step 2: Ask Gemini to summarize the found places into a JSON format
    // We pass the previous response's text to maintain context
    const jsonResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { text: groundingResponse.text },
        { text: `Extrais les 5 meilleurs restaurants ou frigos trouvés ci-dessus et retourne-les sous forme de liste JSON avec id, name, latitude, longitude, address, rating. Réponds UNIQUEMENT en JSON.` }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY" as any,
          items: {
            type: "OBJECT" as any,
            properties: {
              id: { type: "STRING" as any },
              name: { type: "STRING" as any },
              latitude: { type: "NUMBER" as any },
              longitude: { type: "NUMBER" as any },
              address: { type: "STRING" as any },
              rating: { type: "NUMBER" as any }
            },
            required: ["id", "name", "latitude", "longitude", "address"]
          }
        }
      }
    });

    return JSON.parse(jsonResponse.text);
  } catch (error) {
    console.error("Error searching places:", error);
    return [];
  }
};
