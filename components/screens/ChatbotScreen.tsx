import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, Language } from '../../types';
import { startChat, streamChatResponse } from '../../services/geminiService';
import { SendIcon, LeafIcon, MicrophoneIcon, PaperclipIcon, SaveIcon, DownloadIcon, SpeakerOnIcon, SpeakerOffIcon } from '../ui/Icons';
import Spinner from '../ui/Spinner';
import { Chat } from '@google/genai';
import { useLocalization } from '../../localization';
import { useSettings } from '../../App';
import { motion, AnimatePresence } from 'framer-motion';

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
let recognition: any | null = null;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
}

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-xs md:max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl break-words shadow-md ${
          isUser
            ? 'bg-emerald-600 text-white rounded-br-none'
            : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 rounded-bl-none'
        }`}
      >
        {message.imagePreviewUrl && (
            <img src={message.imagePreviewUrl} alt="User upload" className="rounded-lg mb-2 max-h-48" />
        )}
        {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
      </div>
    </motion.div>
  );
};

const ChatbotScreen: React.FC = () => {
  const { t, language, setLanguage } = useLocalization();
  const { voice } = useSettings();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(false);
  const [speechSynthesisVoices, setSpeechSynthesisVoices] = useState<SpeechSynthesisVoice[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Fetch and store voices when the component mounts or when they change
    const getVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setSpeechSynthesisVoices(voices);
      }
    };
    getVoices();
    window.speechSynthesis.onvoiceschanged = getVoices;
  }, []);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);
  
  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    if(recognition) recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    const newChat = startChat(lang);
    setChat(newChat);
    const welcomeText = lang === 'hi'
      ? 'नमस्ते! मैं किसान मित्र हूँ। मैं आपकी कृषि संबंधी समस्याओं में कैसे मदद कर सकता हूँ?'
      : 'Hello! I am Kisan Mitra. How can I help you with your farming needs?';
    setMessages([{ id: 'init', role: 'model', text: welcomeText }]);
  };
  
  const speakText = useCallback((text: string) => {
    if (!isTtsEnabled || speechSynthesisVoices.length === 0) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = speechSynthesisVoices.find(v => v.name === voice);
    utterance.voice = selectedVoice || speechSynthesisVoices.find(v => v.lang.startsWith(language)) || speechSynthesisVoices[0];
    utterance.lang = utterance.voice?.lang || language;
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, [isTtsEnabled, voice, language, speechSynthesisVoices]);


  const handleSend = useCallback(async () => {
    if ((!input.trim() && !imageFile) || !chat || isLoading) return;

    const userMessage: ChatMessage = { 
        id: Date.now().toString(), 
        role: 'user', 
        text: input, 
        imagePreviewUrl: imagePreview ?? undefined 
    };
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = input;
    const currentImageFile = imageFile;
    
    setInput('');
    setImageFile(null);
    setImagePreview(null);
    setIsLoading(true);

    const modelMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: modelMessageId, role: 'model', text: '' }]);

    try {
        const stream = await streamChatResponse(chat, currentInput, currentImageFile ?? undefined);
        
        let fullResponse = '';
        for await (const chunk of stream) {
            fullResponse += chunk.text;
            setMessages(prev => prev.map(msg => 
                msg.id === modelMessageId ? { ...msg, text: fullResponse } : msg
            ));
        }
        speakText(fullResponse);

    } catch (error) {
        console.error("Chat error:", error);
        const errorText = t('error_generic');
        setMessages(prev => prev.map(msg => 
            msg.id === modelMessageId ? { ...msg, text: errorText } : msg
        ));
        speakText(errorText);
    } finally {
        setIsLoading(false);
    }
  }, [input, imageFile, imagePreview, chat, isLoading, t, speakText]);

  const handleMicListen = () => {
      if (!recognition) return alert('Speech recognition is not supported by your browser.');
      if (isListening) {
          recognition.stop();
          setIsListening(false);
      } else {
          recognition.start();
          setIsListening(true);
      }
  };

  useEffect(() => {
      if (!recognition) return;
      recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                  finalTranscript += event.results[i][0].transcript;
              } else {
                  interimTranscript += event.results[i][0].transcript;
              }
          }
          setInput(finalTranscript + interimTranscript);
      };
      recognition.onend = () => {
          setIsListening(false);
      };
      return () => {
          recognition.stop();
      }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          setImageFile(file);
          const reader = new FileReader();
          reader.onloadend = () => {
              setImagePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };
  
  const downloadChat = () => {
    const chatContent = messages.map(m => `[${m.role.toUpperCase()}] ${m.text}`).join('\n\n');
    const blob = new Blob([chatContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kisan-mitra-chat-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!chat) {
    return (
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">{t('chooseLanguage')}</h2>
            <div className="flex justify-center gap-4">
                <button onClick={() => handleLanguageSelect('en')} className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105">{t('english')}</button>
                <button onClick={() => handleLanguageSelect('hi')} className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-transform transform hover:scale-105">{t('hindi')}</button>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] sm:h-[calc(100vh-180px)] max-w-4xl mx-auto bg-slate-50 dark:bg-slate-900/70 rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm" 
         style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/farmer.png')", backgroundBlendMode: 'overlay'}}>
      <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center flex-grow">{t('chatWithKisanMitra')}</h2>
        <div className="flex items-center gap-1">
             <button onClick={() => setIsTtsEnabled(!isTtsEnabled)} title={t('speakResponses')} className={`p-2 rounded-full transition-colors ${isTtsEnabled ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'}`}>
                {isTtsEnabled ? <SpeakerOnIcon className="w-5 h-5"/> : <SpeakerOffIcon className="w-5 h-5"/>}
            </button>
            <div className="relative group">
                <button title={t('saveChat')} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                    <SaveIcon className="w-5 h-5"/>
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl p-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-10">
                    <button onClick={downloadChat} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md">{t('downloadTxt')}</button>
                    <button onClick={() => alert(t('driveSaveNotice'))} className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md">{t('saveToDrive')}</button>
                </div>
            </div>
        </div>
      </div>

      <div ref={chatContainerRef} className="flex-1 p-6 space-y-6 overflow-y-auto">
        <AnimatePresence>
            {messages.map(msg => <ChatBubble key={msg.id} message={msg} />)}
        </AnimatePresence>
        {isLoading && messages[messages.length-1]?.role !== 'model' && (
             <div className="flex items-end gap-2 justify-start">
                <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl bg-white dark:bg-slate-700 text-gray-800 rounded-bl-none shadow-sm">
                    <Spinner className="w-5 h-5"/>
                </div>
            </div>
        )}
      </div>
        
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
        {imagePreview && (
            <div className="relative w-24 h-24 mb-2 p-1 border border-slate-300 dark:border-slate-600 rounded-lg">
                <img src={imagePreview} className="w-full h-full object-cover rounded" />
                <button onClick={() => {setImageFile(null); setImagePreview(null);}} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">&times;</button>
            </div>
        )}
        <div className="flex items-center space-x-2">
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden"/>
            <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                <PaperclipIcon className="w-6 h-6"/>
            </button>
             <button onClick={handleMicListen} className={`p-2 rounded-full transition-colors ${isListening ? 'text-red-500 bg-red-100 dark:bg-red-900/50' : 'text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}>
                <MicrophoneIcon className="w-6 h-6"/>
            </button>

          <input
            type="text"
            value={isListening ? t('listening') : input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={t('typeYourMessage')}
            className="w-full px-4 py-2 bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 border border-slate-300 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
            disabled={isLoading || isListening}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !imageFile)}
            className="p-3 bg-emerald-600 text-white rounded-full disabled:bg-gray-400 dark:disabled:bg-slate-600 hover:bg-emerald-700 transition-all transform hover:scale-110 disabled:cursor-not-allowed"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotScreen;