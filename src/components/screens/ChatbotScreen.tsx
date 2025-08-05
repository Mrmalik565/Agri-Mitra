import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage, Language } from '../../types';
import { startChat, streamChatResponse } from '../../services/geminiService';
import { SendIcon, MicrophoneIcon, PaperclipIcon, SaveIcon, SpeakerOnIcon, SpeakerOffIcon } from '../ui/Icons';
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
        className={`flex items-end gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`w-fit max-w-xs md:max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl break-words shadow-sm ${
          isUser
            ? 'bg-emerald-600 text-white rounded-br-lg'
            : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-lg'
        }`}
      >
        {message.imagePreviewUrl && (
            <img src={message.imagePreviewUrl} alt="User upload" className="rounded-lg mb-2 max-h-48 w-full object-cover" />
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
    const getVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) setSpeechSynthesisVoices(voices);
    };
    getVoices();
    window.speechSynthesis.onvoiceschanged = getVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  useEffect(() => {
    setTimeout(() => {
        chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
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
    if (!isTtsEnabled || !text) return;
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
      } else {
          setInput('');
          recognition.start();
      }
      setIsListening(!isListening);
  };

  useEffect(() => {
      if (!recognition) return;
      recognition.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                  finalTranscript += event.results[i][0].transcript;
              }
          }
          setInput(prev => prev + finalTranscript);
      };
      recognition.onend = () => setIsListening(false);
      return () => { if(recognition) recognition.stop(); }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          setImageFile(file);
          setImagePreview(URL.createObjectURL(file));
      }
  };
  
  if (!chat) {
    return (
        <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t('chooseLanguage')}</h2>
            <div className="flex justify-center gap-4">
                <button onClick={() => handleLanguageSelect('en')} className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105">{t('english')}</button>
                <button onClick={() => handleLanguageSelect('hi')} className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-transform transform hover:scale-105">{t('hindi')}</button>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('chatWithKisanMitra')}</h2>
        <div className="flex items-center gap-2">
             <button onClick={() => setIsTtsEnabled(!isTtsEnabled)} title={t('speakResponses')} className={`p-2 rounded-full transition-colors ${isTtsEnabled ? 'bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-200' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                {isTtsEnabled ? <SpeakerOnIcon className="w-5 h-5"/> : <SpeakerOffIcon className="w-5 h-5"/>}
            </button>
        </div>
      </div>

      <div ref={chatContainerRef} className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
        <AnimatePresence>
            {messages.map(msg => <ChatBubble key={msg.id} message={msg} />)}
        </AnimatePresence>
        {isLoading && messages[messages.length-1]?.role !== 'model' && (
             <div className="flex items-end gap-2.5 justify-start">
                <div className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-700 rounded-bl-lg shadow-sm">
                    <Spinner className="w-5 h-5"/>
                </div>
            </div>
        )}
      </div>
        
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        {imagePreview && (
            <div className="relative w-24 h-24 mb-2 p-1 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
                <img src={imagePreview} className="w-full h-full object-cover rounded" />
                <button onClick={() => {setImageFile(null); setImagePreview(null);}} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm shadow-md">&times;</button>
            </div>
        )}
        <div className="relative flex items-center gap-2">
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden"/>
            <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <PaperclipIcon className="w-6 h-6"/>
            </button>
             <button onClick={handleMicListen} className={`p-2 rounded-full transition-colors ${isListening ? 'text-red-500 bg-red-100 dark:bg-red-900/50 animate-pulse' : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                <MicrophoneIcon className="w-6 h-6"/>
            </button>

          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
            placeholder={isListening ? t('listening') : t('typeYourMessage')}
            className="w-full px-4 py-2.5 resize-none bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !imageFile)}
            className="p-3 bg-emerald-600 text-white rounded-full disabled:bg-slate-400 dark:disabled:bg-slate-600 hover:bg-emerald-700 transition-all transform hover:scale-110 disabled:scale-100 disabled:cursor-not-allowed"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotScreen;