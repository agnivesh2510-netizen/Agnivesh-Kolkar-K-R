import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AnalysisResult {
  title: string;
  category: string;
  urgency: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  location: string;
  nextActions: {
    title: string;
    detail: string;
  }[];
}

export async function analyzeComplaint(text: string): Promise<AnalysisResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this civic complaint and provide a structured report. 
    Complaint: "${text}"`,
    config: {
      systemInstruction: "You are an AI civic infrastructure analyst. Categorize the complaint, assess its urgency, and suggest next actions. Categories should be simple like 'Infrastructure', 'Maintenance', 'Safety', etc. Urgency must be one of: 'Critical', 'High', 'Medium', 'Low'. Provide 3 strategic next actions.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          category: { type: Type.STRING },
          urgency: { 
            type: Type.STRING,
            enum: ['Critical', 'High', 'Medium', 'Low']
          },
          description: { type: Type.STRING },
          location: { type: Type.STRING },
          nextActions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                detail: { type: Type.STRING }
              },
              required: ["title", "detail"]
            }
          }
        },
        required: ["title", "category", "urgency", "description", "location", "nextActions"]
      }
    }
  });

  const result = JSON.parse(response.text || "{}");
  return result as AnalysisResult;
}
