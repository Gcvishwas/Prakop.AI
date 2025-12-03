import { GoogleGenAI } from "@google/genai";

const GEN_KEY = import.meta.env.VITE_GEN_KEY;
export const safetySettings = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_LOW_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_LOW_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_LOW_AND_ABOVE",
  },
];
export const ai = new GoogleGenAI({ apiKey: GEN_KEY });

export const MODEL_NAME = "gemini-2.5-flash";
