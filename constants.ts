import { CropPrice, GovernmentScheme, UserProfile, ChatbotVoice } from './types';

export const CROP_PRICES: CropPrice[] = [
  { id: 1, name: 'Wheat', variety: 'HD-2967', minPrice: 2100, maxPrice: 2250, avgPrice: 2175, unit: 'Quintal' },
  { id: 2, name: 'Paddy (Basmati)', variety: '1121 Sella', minPrice: 7800, maxPrice: 8200, avgPrice: 8000, unit: 'Quintal' },
  { id: 3, name: 'Mustard', variety: 'Local', minPrice: 5400, maxPrice: 5650, avgPrice: 5525, unit: 'Quintal' },
  { id: 4, name: 'Cotton', variety: 'Narma', minPrice: 6800, maxPrice: 7100, avgPrice: 6950, unit: 'Quintal' },
  { id: 5, name: 'Sugarcane', variety: 'Co-0238', minPrice: 350, maxPrice: 370, avgPrice: 362, unit: 'Quintal' },
  { id: 6, name: 'Bajra', variety: 'Hybrid', minPrice: 2200, maxPrice: 2350, avgPrice: 2275, unit: 'Quintal' },
  { id: 7, name: 'Tomato', variety: 'Hybrid', minPrice: 1200, maxPrice: 1500, avgPrice: 1350, unit: 'Quintal' },
  { id: 8, name: 'Onion', variety: 'Nasik Red', minPrice: 1800, maxPrice: 2200, avgPrice: 2000, unit: 'Quintal' },
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
const nextMonth = new Date(today);
nextMonth.setMonth(nextMonth.getMonth() + 1);
const lastMonth = new Date(today);
lastMonth.setMonth(lastMonth.getMonth() - 1);


export const GOVERNMENT_SCHEMES: GovernmentScheme[] = [
    {
        id: 'pmkisan',
        name: 'PM-Kisan Samman Nidhi',
        description: 'A central sector scheme with 100% funding from the Government of India. It provides income support to all landholding farmer families.',
        status: 'Active',
        eligibility: 'All landholding farmer families.',
        benefits: '₹6,000 per year in three equal installments.',
        registrationStartDate: new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0],
        registrationEndDate: new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0],
        link: '#'
    },
    {
        id: 'fasal_bima',
        name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        description: 'Crop insurance scheme to provide comprehensive insurance cover against failure of the crop thus helping in stabilising the income of the farmers.',
        status: 'Active',
        eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops in the notified areas are eligible.',
        benefits: 'Insurance coverage against crop loss due to non-preventable natural risks.',
        registrationStartDate: today.toISOString().split('T')[0],
        registrationEndDate: nextMonth.toISOString().split('T')[0],
        link: '#'
    },
     {
        id: 'meri_fasal',
        name: 'Meri Fasal Mera Byora (Haryana)',
        description: 'A scheme by the Haryana government for crop registration and to provide multiple services on a single portal.',
        status: 'Upcoming',
        eligibility: 'Farmers in Haryana.',
        benefits: 'Easy access to subsidies, crop damage compensation, and other government schemes.',
        registrationStartDate: tomorrow.toISOString().split('T')[0],
        registrationEndDate: nextWeek.toISOString().split('T')[0],
        link: '#'
    },
    {
        id: 'kcc',
        name: 'Kisan Credit Card (KCC)',
        description: 'A scheme that aims at providing adequate and timely credit support from the banking system to farmers for their cultivation and other needs.',
        status: 'Active',
        eligibility: 'All farmers - individuals/joint borrowers who are owner cultivators.',
        benefits: 'Revolving cash credit limit. Interest subvention available.',
        registrationStartDate: new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0],
        registrationEndDate: new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0],
        link: '#'
    },
    {
        id: 'soil_health',
        name: 'Soil Health Card Scheme',
        description: 'A scheme to assist farmers to improve productivity from their soil by giving them soil health cards.',
        status: 'Closed',
        eligibility: 'All farmers are eligible.',
        benefits: 'Get a report on the nutrient status of the soil along with recommendations on the dosage of nutrients to be applied.',
        registrationStartDate: lastMonth.toISOString().split('T')[0],
        registrationEndDate: today.toISOString().split('T')[0],
        link: '#'
    }
];

export const MOCK_USER_PROFILE: UserProfile = {
  name: 'Ramesh Kumar',
  email: 'ramesh.k@example.com',
  phone: '+91-9876543210',
  dob: '1985-06-15',
  profilePicUrl: 'https://images.unsplash.com/photo-1596752235338-a2b8040fee41?q=80&w=200&h=200&auto=format&fit=crop&ixlib=rb-4.0.3'
};

export const CHATBOT_VOICES: ChatbotVoice[] = [
  { name: 'Google US English', lang: 'en-US' },
  { name: 'Google UK English Female', lang: 'en-GB' },
  { name: 'Google हिन्दी', lang: 'hi-IN' },
];

export const translations = {
  en: {
    // Welcome
    welcomeUser: "Welcome, {name}!",

    // Profile & Settings
    myProfile: "My Profile",
    settings: "Settings",
    fullName: "Full Name",
    emailAddress: "Email Address",
    phoneNumber: "Phone Number",
    dateOfBirth: "Date of Birth",
    updateProfile: "Update Profile",
    uploadNewPhoto: "Upload New Photo",
    profileUpdated: "Profile updated successfully!",
    appTheme: "App Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    appLanguage: "App Language",
    chatbotVoice: "Chatbot Voice",
    goBack: "Go Back",
    close: "Close",

    // Landing Screen
    landingTitle: "Revolutionizing Agriculture with AI",
    landingSubtitle: "Your all-in-one smart farming assistant. Get instant crop prices, disease diagnosis, and expert advice.",
    launchWebApp: "Launch Web App",
    downloadApk: "Download Android APK",

    // Auth Screen
    welcomeTo: "Welcome to Kisan Mitra",
    yourAIFarmingAssistant: "Your AI Farming Assistant",
    signInWithGoogle: "Sign in with Google",
    signInWithPhone: "Sign in with Phone",
    signInWithEmail: "Sign in with Email",
    continueAsGuest: "Continue as Guest",

    // Main App Header
    diagnose: "Diagnose",
    prices: "Prices",
    chatbot: "Chatbot",
    pesticideInfo: "Pesticide Info",
    schemes: "Schemes",

    // Prices Screen
    gohanaMandiPrices: "Gohana Mandi Prices",
    todaysLiveMarketRates: "Today's live market rates for major crops.",
    cropName: "Crop Name",
    variety: "Variety",
    minPrice: "Min Price (₹)",
    maxPrice: "Max Price (₹)",
    avgPrice: "Average Price (₹)",
    pricesDisclaimer: "Disclaimer: Prices are indicative and sourced from local aggregators. Actual market prices may vary.",
    lastUpdated: "Last Updated",
    refresh: "Refresh",
    refreshing: "Refreshing...",

    // Disease Diagnosis Screen
    cropDiseaseDiagnosis: "Crop Disease Diagnosis",
    uploadForAnalysis: "Upload a photo of your crop to get an AI-powered health analysis.",
    clickToUpload: "Click to upload image",
    pngOrJpg: "PNG, JPG, or WEBP",
    optionalQuestion: "Optional: Ask a specific question about the plant...",
    analyzeCrop: "Analyze Crop",
    analysisResult: "Analysis Result",
    aiAnalyzing: "Our AI is analyzing your crop... This might take a moment.",
    yourAnalysisWillAppear: "Your analysis will appear here.",
    plantAppearsHealthy: "Plant Appears Healthy",
    diseaseDetected: "Disease Detected!",
    diseaseName: "Disease Name:",
    description: "Description:",
    recommendedSolution: "Recommended Solution:",
    product: "Product:",
    dosage: "Dosage:",
    application: "Application:",
    generalAdvice: "General Advice:",
    error_pleaseUploadImage: "Please upload an image of the crop first.",

    // Pesticide Finder Screen
    pesticideFinder: "Pesticide Information Finder",
    uploadPesticideForInfo: "Upload a photo of a pesticide to get details on its use and dosage.",
    error_pleaseUploadPesticideImage: "Please upload an image of the pesticide first.",
    analyzePesticide: "Analyze Pesticide",
    pesticideAnalysisResult: "Pesticide Analysis Result",
    aiAnalyzingPesticide: "Our AI is analyzing the pesticide... This might take a moment.",
    productName: "Product Name:",
    activeIngredients: "Active Ingredients:",
    targets: "Targets:",
    usageInstructions: "Usage Instructions:",
    precautions: "Precautions:",

    // Chatbot Screen
    chatWithKisanMitra: "Chat with Kisan Mitra",
    chooseLanguage: "Please choose your language",
    english: "English",
    hindi: "Hindi",
    askMeAnything: "Ask me anything about farming!",
    exampleQuery: 'e.g., "When is the best time to plant wheat in Haryana?"',
    typeYourMessage: "Type your message or use the mic...",
    error_generic: "Sorry, I encountered an error. Please try again.",
    listening: "Listening...",
    saveChat: "Save Chat",
    downloadTxt: "Download as .txt",
    saveToDrive: "Save to Google Drive (Beta)",
    driveSaveNotice: "Feature in development. Full Google Drive integration is coming soon!",
    speakResponses: "Speak Responses",
    describeImage: "Describe this image...",

    // Schemes Screen
    liveSchemes: "Live Government Schemes",
    schemesDescription: "Stay updated with the latest agricultural schemes from the government.",
    status: "Status",
    active: "Active",
    upcoming: "Upcoming",
    closed: "Closed",
    eligibility: "Eligibility",
    benefits: "Benefits",
    registrationPeriod: "Registration Period",
    viewDetails: "View Details",
    applyNow: "Apply Now",
    notificationTitle: "Scheme Alert!",
    notificationBody: "Registration for '{schemeName}' is now open!",
    
  },
  hi: {
    // Welcome
    welcomeUser: "नमस्ते, {name}!",

    // Profile & Settings
    myProfile: "मेरी प्रोफाइल",
    settings: "सेटिंग्स",
    fullName: "पूरा नाम",
    emailAddress: "ईमेल पता",
    phoneNumber: "फ़ोन नंबर",
    dateOfBirth: "जन्म तिथि",
    updateProfile: "प्रोफ़ाइल अपडेट करें",
    uploadNewPhoto: "नई तस्वीर अपलोड करें",
    profileUpdated: "प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!",
    appTheme: "ऐप की थीम",
    light: "लाइट",
    dark: "डार्क",
    system: "सिस्टम",
    appLanguage: "ऐप की भाषा",
    chatbotVoice: "चैटबॉट की आवाज़",
    goBack: "वापस जाओ",
    close: "बंद करें",

    // Landing Screen
    landingTitle: "AI के साथ कृषि में क्रांति",
    landingSubtitle: "आपका ऑल-इन-वन स्मार्ट खेती सहायक। फसल की कीमतें, रोग निदान, और विशेषज्ञ सलाह तुरंत प्राप्त करें।",
    launchWebApp: "वेब ऐप लॉन्च करें",
    downloadApk: "एंड्रॉइड एपीके डाउनलोड करें",

    // Auth Screen
    welcomeTo: "किसान मित्र में आपका स्वागत है",
    yourAIFarmingAssistant: "आपका AI कृषि सहायक",
    signInWithGoogle: "Google से साइन इन करें",
    signInWithPhone: "फ़ोन से साइन इन करें",
    signInWithEmail: "ईमेल से साइन इन करें",
    continueAsGuest: "अतिथि के रूप में जारी रखें",

    // Main App Header
    diagnose: "रोग निदान",
    prices: "भाव",
    chatbot: "चैटबॉट",
    pesticideInfo: "कीटनाशक जानकारी",
    schemes: "योजनाएं",

    // Prices Screen
    gohanaMandiPrices: "गोहाना मंडी भाव",
    todaysLiveMarketRates: "प्रमुख फसलों के आज के लाइव बाजार दर।",
    cropName: "फसल का नाम",
    variety: "किस्म",
    minPrice: "न्यूनतम मूल्य (₹)",
    maxPrice: "अधिकतम मूल्य (₹)",
    avgPrice: "औसत मूल्य (₹)",
    pricesDisclaimer: "अस्वीकरण: कीमतें सांकेतिक हैं और स्थानीय एग्रीगेटर्स से प्राप्त की गई हैं। वास्तविक बाजार कीमतें भिन्न हो सकती हैं।",
    lastUpdated: "पिछला अपडेट",
    refresh: "रिफ्रेश",
    refreshing: "रिफ्रेश हो रहा है...",

    // Disease Diagnosis Screen
    cropDiseaseDiagnosis: "फसल रोग निदान",
    uploadForAnalysis: "AI-संचालित स्वास्थ्य विश्लेषण प्राप्त करने के लिए अपनी फसल की एक तस्वीर अपलोड करें।",
    clickToUpload: "छवि अपलोड करने के लिए क्लिक करें",
    pngOrJpg: "PNG, JPG, या WEBP",
    optionalQuestion: "वैकल्पिक: पौधे के बारे में एक विशिष्ट प्रश्न पूछें...",
    analyzeCrop: "फसल का विश्लेषण करें",
    analysisResult: "विश्लेषण परिणाम",
    aiAnalyzing: "हमारा AI आपकी फसल का विश्लेषण कर रहा है... इसमें कुछ क्षण लग सकते हैं।",
    yourAnalysisWillAppear: "आपका विश्लेषण यहां दिखाई देगा।",
    plantAppearsHealthy: "पौधा स्वस्थ प्रतीत होता है",
    diseaseDetected: "रोग का पता चला!",
    diseaseName: "रोग का नाम:",
    description: "विवरण:",
    recommendedSolution: "अनुशंसित समाधान:",
    product: "उत्पाद:",
    dosage: "खुराक:",
    application: "आवेदन:",
    generalAdvice: "सामान्य सलाह:",
    error_pleaseUploadImage: "कृपया पहले फसल की एक छवि अपलोड करें।",

    // Pesticide Finder Screen
    pesticideFinder: "कीटनाशक सूचना खोजक",
    uploadPesticideForInfo: "उपयोग और खुराक पर विवरण प्राप्त करने के लिए कीटनाशक की एक तस्वीर अपलोड करें।",
    error_pleaseUploadPesticideImage: "कृपया पहले कीटनाशक की एक छवि अपलोड करें।",
    analyzePesticide: "कीटनाशक का विश्लेषण करें",
    pesticideAnalysisResult: "कीटनाशक विश्लेषण परिणाम",
    aiAnalyzingPesticide: "हमारा AI कीटनाशक का विश्लेषण कर रहा है... इसमें कुछ क्षण लग सकते हैं।",
    productName: "उत्पाद का नाम:",
    activeIngredients: "सक्रिय तत्व:",
    targets: "लक्ष्य:",
    usageInstructions: "उपयोग के निर्देश:",
    precautions: "सावधानियां:",

    // Chatbot Screen
    chatWithKisanMitra: "किसान मित्र के साथ चैट करें",
    chooseLanguage: "कृपया अपनी भाषा चुनें",
    english: "English",
    hindi: "हिंदी",
    askMeAnything: "खेती के बारे में कुछ भी पूछें!",
    exampleQuery: 'उदा., "हरियाणा में गेहूं बोने का सबसे अच्छा समय कौन सा है?"',
    typeYourMessage: "अपना संदेश लिखें या माइक का उपयोग करें...",
    error_generic: "क्षमा करें, मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें।",
    listening: "सुन रहा हूँ...",
    saveChat: "चैट सहेजें",
    downloadTxt: ".txt के रूप में डाउनलोड करें",
    saveToDrive: "गूगल ड्राइव में सहेजें (बीटा)",
    driveSaveNotice: "यह सुविधा विकास में है। पूर्ण गूगल ड्राइव एकीकरण जल्द ही आ रहा है!",
    speakResponses: "प्रतिक्रियाएं बोलें",
    describeImage: "इस छवि का वर्णन करें...",

    // Schemes Screen
    liveSchemes: "लाइव सरकारी योजनाएं",
    schemesDescription: "सरकार की नवीनतम कृषि योजनाओं से अपडेट रहें।",
    status: "स्थिति",
    active: "सक्रिय",
    upcoming: "आगामी",
    closed: "बंद",
    eligibility: "पात्रता",
    benefits: "लाभ",
    registrationPeriod: "पंजीकरण अवधि",
    viewDetails: "विवरण देखें",
    applyNow: "अभी आवेदन करें",
    notificationTitle: "योजना अलर्ट!",
    notificationBody: "'{schemeName}' के लिए पंजीकरण अब खुला है!",
  }
};