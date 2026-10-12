import React, { useState } from 'react';
import { 
  Send, 
  Volume2, 
  Languages, 
  Sparkles, 
  MessageCircle,
  Clock
} from 'lucide-react';
import { UserProfile } from '../../types';
import { audioService } from '../../services/audioService';

interface ChatPartner {
  id: string;
  name: string;
  city: string;
  avatar: string;
  nativeLang: string;
  learningLang: string;
  bio: string;
  online: boolean;
  messages: ChatMessage[];
}

interface ChatMessage {
  id: string;
  sender: 'partner' | 'user';
  kazakhText: string;
  turkishTranslation: string;
  timestamp: string;
}

interface SohbetViewProps {
  user: UserProfile;
}

export const SohbetView: React.FC<SohbetViewProps> = ({ user }) => {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('partner-1');
  const [inputText, setInputText] = useState('');
  const [showTranslationIds, setShowTranslationIds] = useState<Record<string, boolean>>({});

  const partners: ChatPartner[] = [
    {
      id: 'partner-1',
      name: 'Aygül Nursultanova',
      city: 'Almatı, Qazaqstan',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      nativeLang: '🇰🇿 Kazakça (Ана тілі)',
      learningLang: '🇹🇷 Türkçe (Оқып жатыр)',
      bio: 'Al-Farabi Kazak Milli Üniversitesi öğrencisiyim. Türkçe pratik yapmak istiyorum!',
      online: true,
      messages: [
        {
          id: 'm-1',
          sender: 'partner',
          kazakhText: 'Сәлеметсіз бе! Менің атым – Әйгерім. Сіз қазақ тілін үйреніп жатырсыз ба?',
          turkishTranslation: 'Merhaba! Benim adım Aygerim. Siz Kazakça mı öğreniyorsunuz?',
          timestamp: '14:20'
        },
        {
          id: 'm-2',
          sender: 'user',
          kazakhText: 'Сәлем! Иә, мен қазақ тілін өте жақсы көремін. Түркиядан жазып отырмын.',
          turkishTranslation: 'Selam! Evet, ben Kazakçayı çok seviyorum. Türkiye\'den yazıyorum.',
          timestamp: '14:22'
        },
        {
          id: 'm-3',
          sender: 'partner',
          kazakhText: 'Өте тамаша! Қазақстанға бұрын келдіңіз бе? Алматының табиғаты өте көркем.',
          turkishTranslation: 'Harika! Kazakistan\'a daha önce geldiniz mi? Almatı\'nın doğası çok güzel.',
          timestamp: '14:25'
        }
      ]
    },
    {
      id: 'partner-2',
      name: 'Serik Akhmetov',
      city: 'Astana, Qazaqstan',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      nativeLang: '🇰🇿 Kazakça',
      learningLang: '🇹🇷 Türkçe',
      bio: 'Bilişim mühendisiyim. İstanbul\'u ve Türk kültürünü çok merak ediyorum.',
      online: true,
      messages: [
        {
          id: 'm-4',
          sender: 'partner',
          kazakhText: 'Қайырлы күн! Сізге қазақ тілінің грамматикасын үйренуге қуана көмектесемін.',
          turkishTranslation: 'İyi günler! Size Kazakça dil bilgisini öğrenmenizde seve seve yardım ederim.',
          timestamp: '11:05'
        }
      ]
    }
  ];

  const currentPartner = partners.find(p => p.id === selectedPartnerId) || partners[0];
  const [messages, setMessages] = useState<ChatMessage[]>(currentPartner.messages);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: 'm-' + Date.now(),
      sender: 'user',
      kazakhText: inputText,
      turkishTranslation: 'Kullanıcı mesajı',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    audioService.playFeedbackSound('click');

    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: 'm-' + (Date.now() + 1),
        sender: 'partner',
        kazakhText: 'Керемет сөйлем! Сіздің қазақша сөйлеуіңіз күннен күнге жақсарып келеді.',
        turkishTranslation: 'Harika bir cümle! Kazakça konuşmanız günden güne güzelleşiyor.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, replyMsg]);
      audioService.playFeedbackSound('correct');
    }, 1400);
  };

  const toggleTranslation = (id: string) => {
    setShowTranslationIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const playVoice = (text: string) => {
    audioService.speak(text, 'kk', 0.88);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-100 h-full">
      
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={currentPartner.avatar}
              alt={currentPartner.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-teal-500 shadow-xs"
            />
            {currentPartner.online && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 leading-tight">
              {currentPartner.name}
            </h3>
            <p className="text-[10px] text-teal-700 font-bold flex items-center gap-1">
              <span>{currentPartner.city}</span>
              <span>•</span>
              <span className="text-emerald-600">Çevrimiçi</span>
            </p>
          </div>
        </div>

        {/* Partner Selector */}
        <div className="flex items-center gap-1">
          {partners.map(p => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPartnerId(p.id);
                setMessages(p.messages);
              }}
              className={`p-1.5 rounded-xl border text-[10px] font-bold transition ${
                selectedPartnerId === p.id 
                  ? 'bg-teal-50 border-teal-500 text-teal-800 ring-1 ring-teal-400' 
                  : 'bg-white border-slate-200 text-slate-500'
              }`}
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="px-4 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-teal-100 text-[11px] text-teal-900 flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-bold">
          <MessageCircle className="w-3.5 h-3.5 text-teal-600" />
          <span>Dil Sohbeti (Сұхбат): {currentPartner.nativeLang} ⇄ {currentPartner.learningLang}</span>
        </span>
        <span className="text-[10px] bg-teal-200/80 px-2 py-0.5 rounded-full font-black">
          Doğal Pratik
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          const isTranslated = showTranslationIds[msg.id];

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[82%] p-3.5 rounded-2xl shadow-2xs relative text-xs ${
                  isUser
                    ? 'bg-teal-600 text-white rounded-br-xs'
                    : 'bg-white border border-slate-200/90 text-slate-900 rounded-bl-xs'
                }`}
              >
                <p className="font-semibold leading-relaxed">
                  {msg.kazakhText}
                </p>

                {/* Instant Translation Box */}
                {isTranslated && (
                  <div className={`mt-2 pt-2 border-t text-[11px] font-medium animate-in fade-in ${
                    isUser ? 'border-white/20 text-teal-100' : 'border-slate-100 text-slate-600'
                  }`}>
                    🇹🇷 {msg.turkishTranslation}
                  </div>
                )}

                {/* Action Bar (Audio speak, Translate) */}
                <div className={`flex items-center gap-2 mt-2 pt-1 border-t ${
                  isUser ? 'border-white/10' : 'border-slate-100'
                }`}>
                  <button
                    onClick={() => playVoice(msg.kazakhText)}
                    className={`p-1 rounded hover:bg-black/10 transition ${
                      isUser ? 'text-teal-200' : 'text-slate-500'
                    }`}
                    title="Sesli Dinle"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => toggleTranslation(msg.id)}
                    className={`p-1 rounded hover:bg-black/10 transition ${
                      isUser ? 'text-teal-200' : 'text-slate-500'
                    }`}
                    title="Çeviriyi Göster"
                  >
                    <Languages className="w-3.5 h-3.5" />
                  </button>

                  <span className={`text-[9px] ml-auto font-mono ${
                    isUser ? 'text-teal-200' : 'text-slate-400'
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Reply Phrases */}
      <div className="px-4 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto select-none">
        {[
          'Сәлеметсіз бе! (Merhaba)',
          'Қалыңыз қалай? (Nasılsınız?)',
          'Рақмет! (Teşekkürler)',
          'Түсінбедім (Anlamadım)',
          'Қайталаңызшы (Tekrarlar mısınız)'
        ].map((phrase, idx) => (
          <button
            key={idx}
            onClick={() => setInputText(phrase.split(' (')[0])}
            className="px-2.5 py-1 text-[10px] font-bold bg-slate-100 hover:bg-teal-50 hover:text-teal-800 rounded-xl whitespace-nowrap transition border border-slate-200"
          >
            {phrase}
          </button>
        ))}
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          placeholder="Kazakça mesajınızı yazınız... / Қазақша жазыңыз..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
        />
        <button
          type="submit"
          className="p-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
