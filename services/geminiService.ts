import { GoogleGenAI, Chat, Type, GenerateContentResponse, Part } from "@google/genai";
import { Language } from '../types';

let ai: GoogleGenAI | null = null;

const getAiInstance = (): GoogleGenAI => {
    if (!ai) {
        const apiKey = (globalThis as any).process?.env?.API_KEY;
        if (!apiKey) {
            throw new Error("API key is not configured. The app cannot contact the AI service.");
        }
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
};


const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const diseaseAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    isPlantHealthy: { type: Type.BOOLEAN, description: "Is the plant in the image healthy?" },
    diseaseName: { type: Type.STRING, description: "The common name of the identified disease. Should be 'N/A' if the plant is healthy." },
    description: { type: Type.STRING, description: "A brief, easy-to-understand description of the disease or the plant's condition." },
    solution: {
      type: Type.OBJECT,
      properties: {
        recommendedProduct: { type: Type.STRING, description: "Name of a suitable, commonly available insecticide or fungicide. 'N/A' if healthy." },
        dosage: { type: Type.STRING, description: "Recommended dosage, e.g., '10ml per 15 liters of water'. 'N/A' if healthy." },
        applicationAdvice: { type: Type.STRING, description: "Clear, step-by-step instructions on how to apply the product." }
      }
    },
    generalAdvice: { type: Type.STRING, description: "Any other general advice for the farmer regarding this issue or for maintaining plant health." }
  },
  required: ["isPlantHealthy", "diseaseName", "description", "solution", "generalAdvice"]
};

const pesticideAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    productName: { type: Type.STRING, description: "The brand name of the pesticide product." },
    activeIngredients: { type: Type.STRING, description: "List of active chemical ingredients." },
    targetPestsAndDiseases: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of pests, diseases, or weeds this product is effective against." },
    usage: {
      type: Type.OBJECT,
      properties: {
        dosage: { type: Type.STRING, description: "Recommended dosage, e.g., '10ml per 15 liters of water'." },
        applicationMethod: { type: Type.STRING, description: "Instructions on how and when to apply the product." },
        precautions: { type: Type.STRING, description: "Safety precautions to take while handling and applying the product." }
      }
    }
  },
  required: ["productName", "activeIngredients", "targetPestsAndDiseases", "usage"]
};


const getPrompt = (type: 'disease' | 'pesticide', lang: Language, question?: string) => {
    const prompts = {
        en: {
            disease: `You are an expert agricultural scientist. Analyze this image of a plant. Identify any diseases or pests. If a user asks a question, consider it. Here is the user's question: "${question || 'None'}". Provide a detailed solution. If the image is not a plant, is unclear, or no disease is visible, state that clearly. Format the response strictly according to the provided JSON schema.`,
            pesticide: `You are an agricultural chemical expert. Analyze this image of a pesticide product. Identify its name, active ingredients, what pests/diseases it's used for, the recommended dosage, and how to apply it safely. If the image is not a pesticide, state that clearly. Format the response strictly according to the provided JSON schema. Respond in English.`
        },
        hi: {
            disease: `आप एक विशेषज्ञ कृषि वैज्ञानिक हैं। पौधे की इस छवि का विश्लेषण करें। किसी भी बीमारी या कीट की पहचान करें। यदि उपयोगकर्ता कोई प्रश्न पूछता है, तो उस पर विचार करें। यहाँ उपयोगकर्ता का प्रश्न है: "${question || 'कोई नहीं'}"। एक विस्तृत समाधान प्रदान करें। यदि छवि एक पौधे की नहीं है, अस्पष्ट है, या कोई बीमारी दिखाई नहीं दे रही है, तो यह स्पष्ट रूप से बताएं। प्रतिक्रिया को दिए गए JSON स्कीमा के अनुसार सख्ती से प्रारूपित करें।`,
            pesticide: `आप एक कृषि रसायन विशेषज्ञ हैं। कीटनाशक उत्पाद की इस छवि का विश्लेषण करें। इसके नाम, सक्रिय अवयवों, यह किन कीटों/रोगों के लिए उपयोग किया जाता है, अनुशंसित खुराक और इसे सुरक्षित रूप से कैसे लागू किया जाए, इसकी पहचान करें। यदि छवि कीटनाशक की नहीं है, तो यह स्पष्ट रूप से बताएं। प्रतिक्रिया को दिए गए JSON स्कीमा के अनुसार सख्ती से प्रारूपित करें। हिंदी में जवाब दें।`
        }
    };
    return prompts[lang][type];
}


export const analyzeCropDisease = async (image: File, question: string, lang: Language) => {
  const localAi = getAiInstance();
  const imagePart = await fileToGenerativePart(image);
  const textPart = { text: getPrompt('disease', lang, question) };

  const response: GenerateContentResponse = await localAi.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [imagePart, textPart] },
    config: {
        responseMimeType: "application/json",
        responseSchema: diseaseAnalysisSchema,
    }
  });

  try {
    const jsonString = response.text.trim();
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Failed to parse Gemini response:", e);
    throw new Error("The AI returned an unexpected response. Please try again with a clearer image.");
  }
};


export const analyzePesticide = async (image: File, lang: Language) => {
    const localAi = getAiInstance();
    const imagePart = await fileToGenerativePart(image);
    const textPart = { text: getPrompt('pesticide', lang) };

    const response: GenerateContentResponse = await localAi.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: pesticideAnalysisSchema,
        }
    });

    try {
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("Failed to parse Gemini response:", e);
        throw new Error("The AI returned an unexpected response. Please try again with a clearer image.");
    }
};


export const startChat = (language: Language): Chat => {
    const localAi = getAiInstance();
    const systemInstruction = language === 'hi' 
        ? "आप 'किसान मित्र' हैं, भारत में किसानों के लिए एक मैत्रीपूर्ण और जानकार एआई सहायक। आपका लक्ष्य कृषि, फसल प्रबंधन, कीट नियंत्रण और सरकारी योजनाओं पर सहायक, संक्षिप्त और आसानी से समझ में आने वाली सलाह प्रदान करना है। हमेशा उत्साहजनक और सहायक बने रहें। अपने उत्तर संक्षिप्त और सटीक रखें। केवल हिंदी में उत्तर दें।"
        : "You are 'Kisan Mitra', a friendly and knowledgeable AI assistant for farmers in India. Your goal is to provide helpful, concise, and easy-to-understand advice on agriculture, crop management, pest control, and government schemes. Always be encouraging and supportive. Keep your answers brief and to the point. Respond only in English.";

    return localAi.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        },
    });
};

export const streamChatResponse = async (chat: Chat, newMessage: string, image?: File) => {
    const parts: Part[] = [{ text: newMessage }];
    if (image) {
        const imagePart = await fileToGenerativePart(image);
        // Add a default prompt if the user message is empty but an image is present
        if (!newMessage.trim()) {
            parts[0].text = "Describe this image in detail.";
        }
        parts.unshift(imagePart);
    }
    return chat.sendMessageStream({ message: parts });
};