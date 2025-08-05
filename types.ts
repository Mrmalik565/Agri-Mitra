export type Language = 'en' | 'hi';

export enum ActiveScreen {
  PRICES = 'PRICES',
  DIAGNOSIS = 'DIAGNOSIS',
  CHATBOT = 'CHATBOT',
  PESTICIDE_FINDER = 'PESTICIDE_FINDER',
  SCHEMES = 'SCHEMES'
}

export interface CropPrice {
  id: number;
  name: string;
  variety: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  unit: string;
}

export interface AnalysisResult {
  isPlantHealthy: boolean;
  diseaseName: string;
  description: string;
  solution: {
    recommendedProduct: string;
    dosage: string;
    applicationAdvice: string;
  };
  generalAdvice: string;
}

export interface PesticideAnalysisResult {
    productName: string;
    activeIngredients: string;
    targetPestsAndDiseases: string[];
    usage: {
        dosage: string;
        applicationMethod: string;
        precautions: string;
    };
}


export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  imagePreviewUrl?: string;
}

export type SchemeStatus = 'Active' | 'Upcoming' | 'Closed';

export interface GovernmentScheme {
  id: string;
  name: string;
  description: string;
  status: SchemeStatus;
  eligibility: string;
  benefits: string;
  registrationStartDate: string;
  registrationEndDate: string;
  link: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dob: string;
  profilePicUrl: string;
}

export interface ChatbotVoice {
  name: string;
  lang: string;
}