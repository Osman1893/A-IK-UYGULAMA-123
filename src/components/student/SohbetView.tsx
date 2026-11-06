import React, { useState } from 'react';
import { 
  Send, 
  Volume2, 
  Languages, 
  Sparkles, 
  MessageCircle,
  Clock,
  RotateCcw,
  Bot,
  User,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
  Check,
  Target,
  Mic,
  MicOff,
  Flame
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
  isAi?: boolean;
  messages: ChatMessage[];
}

interface ChatMessage {
  id: string;
  sender: 'partner' | 'user';
  kazakhText: string;
  turkishTranslation: string;
  timestamp: string;
}

interface RoleplayScenario {
  id: string;
  titleTr: string;
  titleKz: string;
  icon: string;
  partnerName: string;
  partnerRole: string;
  avatar: string;
  descriptionTr: string;
  goals: { id: string; textTr: string; keywords: string[]; completed: boolean }[];
  initialMessageKz: string;
  initialMessageTr: string;
  suggestedPhrases: { kz: string; tr: string }[];
}

interface SohbetViewProps {
  user: UserProfile;
  onBack?: () => void;
}

export const SohbetView: React.FC<SohbetViewProps> = ({ user, onBack }) => {
  const isTr = user.currentDirection === 'TR_TO_KZ';
  const [activeMode, setActiveMode] = useState<'free' | 'roleplay'>('roleplay');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('market');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('partner-gemini');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTranslationIds, setShowTranslationIds] = useState<Record<string, boolean>>({});

  // Roleplay Scenarios
  const roleplayScenarios: RoleplayScenario[] = [
    {
      id: 'market',
      titleTr: 'Almatı Kök Pazarında Alışveriş',
      titleKz: 'Көк базарда сауда жасау',
      icon: '🍎',
      partnerName: 'Aygül Apa',
      partnerRole: 'Bozkır Meyve & Kımız Satıcısı',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      descriptionTr: 'Almatı\'nın tarihi Yeşil Pazarındasınız. Elma ve kımız fiyatını sorun, miktar belirtin ve pazarlık yapın.',
      goals: [
        { id: 'g1', textTr: 'Elma veya kımız fiyatını sor', keywords: ['қанша', 'бағасы', 'алма', 'қымыз'], completed: false },
        { id: 'g2', textTr: 'İki kilo veya miktar belirt', keywords: ['екі', 'келі', 'беріңіз', 'литр', 'арзан'], completed: false },
        { id: 'g3', textTr: 'Teşekkür et ve vedalaş', keywords: ['рақмет', 'рахмет', 'сау', 'болыңыз'], completed: false }
      ],
      initialMessageKz: 'Келіңіз, қарындасым / бауырым! Алматының апорты тәтті, қымызы шүйгін! Қандай жеміс алғыңыз келеді?',
      initialMessageTr: 'Gelin, kardeşim! Almatı\'nın elması tatlı, kımızımız tazedir! Hangi meyveden almak istersiniz?',
      suggestedPhrases: [
        { kz: 'Сәлеметсіз бе! Алманың келісі қанша?', tr: 'Merhaba! Elmanın kilosu ne kadar?' },
        { kz: 'Маған екі келі алма беріңізші.', tr: 'Bana iki kilo elma verir misiniz?' },
        { kz: 'Сәл арзандатып бере аласыз ба?', tr: 'Biraz indirim yapabilir misiniz?' },
        { kz: 'Мінекей ақшасы, көп рақмет!', tr: 'İşte parası, çok teşekkürler!' }
      ]
    },
    {
      id: 'hospitality',
      titleTr: 'Kazak Sofrası & Dasturhan (Misafirlik)',
      titleKz: 'Қонақта болу және ақ бата',
      icon: '🍵',
      partnerName: 'Nursultan Ağa',
      partnerRole: 'Aksakal & Ev Sahibi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      descriptionTr: 'Geleneksel bir Kazak evine misafir oldunuz. Hal hatır sorun, çay ikramını övün ve aksakaldan hayır duası (bata) dileyin.',
      goals: [
        { id: 'g1', textTr: 'Selam ver ve hal hatır sor', keywords: ['сәлеметсіз', 'қалыңыз', 'амансыз', 'қалай'], completed: false },
        { id: 'g2', textTr: 'Çay veya yemeğe teşekkür et', keywords: ['дәмді', 'шай', 'рақмет', 'ас', 'тәтті'], completed: false },
        { id: 'g3', textTr: 'Bata (hayır duası) dile', keywords: ['бата', 'ақ бата', 'беріңіз', 'әумин', 'аумин'], completed: false }
      ],
      initialMessageKz: 'Төрлетіңіз, құрметті қонақ! Қазақтың дастарқаны ашық. Қалыңыз қалай, жолыңыз оң болды ма?',
      initialMessageTr: 'Başköşeye buyurunuz, hürmetli misafir! Kazak sofrası açıktır. Nasılsınız, yolculuğunuz iyi geçti mi?',
      suggestedPhrases: [
        { kz: 'Сәлеметсіз бе! Шүкір, аман-есен жеттім.', tr: 'Merhaba! Şükür, sağ salim ulaştım.' },
        { kz: 'Дастарқаныңызға береке берсін, шай өте дәмді!', tr: 'Sofranıza bereket versin, çay çok lezzetli!' },
        { kz: 'Үлкен рақмет, ақ батаңызды бересіз бе?', tr: 'Çok teşekkürler, hayır duanızı (bata) verir misiniz?' }
      ]
    },
    {
      id: 'taxi',
      titleTr: 'Astana Havalimanı & Taksi Yolculuğu',
      titleKz: 'Әуежайда және таксиде',
      icon: '🚕',
      partnerName: 'Daulet',
      partnerRole: 'Astana Taksicisi',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      descriptionTr: 'Astana Nursultan Nazarbayev Havalimanı\'ndan şehir merkezine gideceksiniz. Güzergahı söyleyin ve ücreti konuşun.',
      goals: [
        { id: 'g1', textTr: 'Gideceğiniz yeri söyle', keywords: ['орталығына', 'бәйтерек', 'мейманхана', 'барамын'], completed: false },
        { id: 'g2', textTr: 'Yol ücretini sor', keywords: ['жол', 'ақысы', 'қанша', 'болады', 'теңге'], completed: false },
        { id: 'g3', textTr: 'Teşekkür edip in', keywords: ['жеттік', 'рақмет', 'мінекей', 'сау'], completed: false }
      ],
      initialMessageKz: 'Сәлем бауырым! Қайда барасыз? Қала орталығы ма, әлде сол жағалау ма?',
      initialMessageTr: 'Selam kardeşim! Nereye gideceksiniz? Şehir merkezi mi, yoksa sol yaka (yeni merkez) mi?',
      suggestedPhrases: [
        { kz: 'Сәлем! Маған қала орталығына, Бәйтерекке бару керек.', tr: 'Selam! Bana şehir merkezine, Bayterek\'e gitmek gerek.' },
        { kz: 'Жол ақысы қанша теңге болады?', tr: 'Yol ücreti kaç tenge tutar?' },
        { kz: 'Мінекей жол ақысы, рақмет, сау болыңыз!', tr: 'İşte ücret, teşekkürler, hoşça kalın!' }
      ]
    }
  ];

  const currentScenario = roleplayScenarios.find(s => s.id === selectedScenarioId) || roleplayScenarios[0];
  const [scenarioGoals, setScenarioGoals] = useState(currentScenario.goals);

  const partners: ChatPartner[] = [
    {
      id: 'partner-gemini',
      name: 'Gemini AI Türkolog',
      city: 'Yapay Zeka Dil Eğitmeni',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GeminiTurkolog',
      nativeLang: '🇰🇿 Қазақша / 🇹🇷 Türkçe',
      learningLang: 'Canlı Yapay Zeka',
      bio: 'Gemini AI dil eğitmeniniz. Kazakça ve Türkçe sorularınızı sorun, serbestçe sohbet edin ve hatalarınızı anında düzeltin!',
      online: true,
      isAi: true,
      messages: [
        {
          id: 'm-ai-welcome',
          sender: 'partner',
          kazakhText: 'Сәлеметсіз бе! Мен Uzaktan Türkolog жасанды интеллект көмекшісімін. Қазақ тілін үйренуде қандай сұрағыңыз бар?',
          turkishTranslation: 'Merhaba! Ben Uzaktan Türkolog yapay zeka asistanıyım. Kazakça öğrenme konusunda ne sormak istersiniz?',
          timestamp: 'Şimdi'
        }
      ]
    }
  ];

  const currentPartner = partners[0];
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'm-init',
      sender: 'partner',
      kazakhText: currentScenario.initialMessageKz,
      turkishTranslation: currentScenario.initialMessageTr,
      timestamp: 'Şimdi'
    }
  ]);

  const handleSelectScenario = (scId: string) => {
    setSelectedScenarioId(scId);
    const sc = roleplayScenarios.find(s => s.id === scId) || roleplayScenarios[0];
    setScenarioGoals(sc.goals);
    setMessages([
      {
        id: 'm-sc-' + Date.now(),
        sender: 'partner',
        kazakhText: sc.initialMessageKz,
        turkishTranslation: sc.initialMessageTr,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    audioService.playFeedbackSound('click');
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    // Check roleplay goals progress
    if (activeMode === 'roleplay') {
      const lower = text.toLowerCase();
      setScenarioGoals(prev => prev.map(g => {
        if (!g.completed && g.keywords.some(k => lower.includes(k.toLowerCase()))) {
          audioService.playFeedbackSound('correct');
          return { ...g, completed: true };
        }
        return g;
      }));
    }

    const newMsg: ChatMessage = {
      id: 'm-' + Date.now(),
      sender: 'user',
      kazakhText: text,
      turkishTranslation: isTr ? 'Kullanıcı mesajı' : 'Пайдаланушы хабарламасы',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, newMsg];
    setMessages(newHistory);
    setInputText('');
    audioService.playFeedbackSound('click');
    setIsLoading(true);

    try {
      const promptInstruction = activeMode === 'roleplay'
        ? `Sen ${currentScenario.partnerName} (${currentScenario.partnerRole}) karakterisin. 
Senaryo: "${currentScenario.titleTr}". 
Öğrenci seninle Kazakça konuşuyor.
Kurallar:
1. Karakterine sadık kalarak samimi, canlı Kazakça cevap ver.
2. Verdiğin cevabın altına parantez içinde Türkçe anlamını yaz (örn: «... (Türkçe anlamı)»).
3. Öğrencinin konuşmasını teşvik et, kısa ve doğal konuş.`
        : `Sen Uzaktan Türkolog yapay zeka Kazakça dil eğitmenisin. Öğrenciyle arkadaşça sohbet et, hatalarını nazikçe düzelt ve her Kazakça cümlenin Türkçe karşılığını parantez içinde ver.`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { text: promptInstruction, role: 'system' },
            ...newHistory.map(m => ({ text: m.kazakhText, role: m.sender }))
          ],
          userLevel: user.currentLevel,
          direction: user.currentDirection
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.reply || '';
        
        let trPart = '';
        const match = reply.match(/\(([^)]+)\)/);
        if (match) {
          trPart = match[1];
        }

        const replyMsg: ChatMessage = {
          id: 'm-' + (Date.now() + 1),
          sender: 'partner',
          kazakhText: reply,
          turkishTranslation: trPart || 'Türkçe tercüme metin içerisindedir.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, replyMsg]);
        audioService.playFeedbackSound('correct');
      } else {
        throw new Error('API error');
      }
    } catch {
      // Offline fallback response based on scenario
      const fallbackKz = activeMode === 'roleplay' 
        ? 'Өте жақсы айттыңыз! Сізбен сөйлесуге қуаныштымын. Жұмысыңыз алға бассын!'
        : 'Керемет! Сөйлемдеріңіз күннен күнге жақсарып келеді. Қазақ тілін өте жақсы меңгеріп жатырсыз!';
      const fallbackTr = activeMode === 'roleplay'
        ? 'Çok güzel söylediniz! Sizinle konuşmaktan memnunum. İşiniz rast gitsin!'
        : 'Harika! Cümleleriniz günden güne gelişiyor. Kazakçayı çok iyi öğreniyorsunuz!';

      const fallbackMsg: ChatMessage = {
        id: 'm-' + (Date.now() + 1),
        sender: 'partner',
        kazakhText: fallbackKz,
        turkishTranslation: fallbackTr,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
      audioService.playFeedbackSound('correct');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTranslation = (id: string) => {
    setShowTranslationIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const playVoice = (text: string) => {
    // Strip parenthetical translations before vocalizing
    const speechOnly = text.replace(/\([^)]*\)/g, '').trim();
    audioService.speak(speechOnly, 'kk', 0.88);
  };

  const completedGoalsCount = scenarioGoals.filter(g => g.completed).length;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-full">
      
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-1 rounded-xl text-slate-500 hover:bg-slate-100 transition mr-1"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            
            <div className="relative">
              <img
                src={activeMode === 'roleplay' ? currentScenario.avatar : currentPartner.avatar}
                alt={activeMode === 'roleplay' ? currentScenario.partnerName : currentPartner.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-teal-500 shadow-2xs"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black text-slate-900 leading-tight">
                  {activeMode === 'roleplay' ? currentScenario.partnerName : currentPartner.name}
                </h3>
                <span className="text-[9px] font-black bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded-md">
                  {activeMode === 'roleplay' ? currentScenario.partnerRole : 'Gemini AI'}
                </span>
              </div>
              <p className="text-[10px] text-teal-700 font-bold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Canlı Yapay Zeka Pratiği</span>
              </p>
            </div>
          </div>

          {/* Mode Switcher Pills */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveMode('roleplay')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                activeMode === 'roleplay'
                  ? 'bg-teal-600 text-white shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🎭 Rol Yapma</span>
            </button>
            <button
              onClick={() => setActiveMode('free')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                activeMode === 'free'
                  ? 'bg-teal-600 text-white shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>💬 Serbest</span>
            </button>
          </div>
        </div>

        {/* Roleplay Scenarios Selector Bar */}
        {activeMode === 'roleplay' && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {roleplayScenarios.map(sc => (
                <button
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    selectedScenarioId === sc.id
                      ? 'bg-teal-700 text-white shadow-2xs font-black'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{sc.icon}</span>
                  <span>{sc.titleTr}</span>
                </button>
              ))}
            </div>

            {/* Mission Progress Tracker */}
            <div className="p-2.5 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-200/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-teal-600 shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase text-teal-900 tracking-wider">
                      Senaryo Görevleri:
                    </span>
                    <span className="text-[10px] font-black bg-teal-200/80 text-teal-950 px-1.5 py-0.2 rounded-full">
                      {completedGoalsCount} / {scenarioGoals.length} Tamamlandı
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {scenarioGoals.map(g => (
                      <span 
                        key={g.id} 
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          g.completed 
                            ? 'bg-emerald-500 text-white shadow-2xs' 
                            : 'bg-white border border-slate-200 text-slate-500'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5" />
                        <span>{g.textTr}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 pb-6">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          const isTranslated = showTranslationIds[msg.id];

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl shadow-2xs relative text-xs ${
                  isUser
                    ? 'bg-teal-600 text-white rounded-br-xs'
                    : 'bg-white border border-slate-200/90 text-slate-900 rounded-bl-xs'
                }`}
              >
                <p className="font-semibold leading-relaxed whitespace-pre-wrap">
                  {msg.kazakhText}
                </p>

                {/* Instant Translation Box */}
                {isTranslated && (
                  <div className={`mt-2 pt-2 border-t text-[11px] font-medium leading-relaxed ${
                    isUser ? 'border-white/20 text-teal-100' : 'border-slate-100 text-slate-600'
                  }`}>
                    <span className="font-bold opacity-80 block text-[9px] uppercase tracking-wider mb-0.5">
                      Türkçe Tercüme:
                    </span>
                    {msg.turkishTranslation}
                  </div>
                )}

                {/* Message Action Bar */}
                <div className={`mt-2 flex items-center justify-between gap-3 text-[10px] ${
                  isUser ? 'text-white/80' : 'text-slate-400'
                }`}>
                  <span className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{msg.timestamp}</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => playVoice(msg.kazakhText)}
                      className={`p-1 rounded-md transition flex items-center gap-0.5 ${
                        isUser ? 'hover:bg-white/20 text-white' : 'hover:bg-slate-100 text-teal-700'
                      }`}
                      title="Seslendir"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Dinle</span>
                    </button>

                    <button
                      onClick={() => toggleTranslation(msg.id)}
                      className={`p-1 rounded-md transition flex items-center gap-0.5 font-bold ${
                        isUser ? 'hover:bg-white/20 text-white' : 'hover:bg-slate-100 text-teal-700'
                      }`}
                    >
                      <Languages className="w-3.5 h-3.5" />
                      <span>{isTranslated ? 'Gizle' : 'Çevir'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading typing bubble */}
        {isLoading && (
          <div className="flex items-start gap-2 animate-in fade-in">
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-xs shadow-2xs flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="w-4 h-4 text-teal-600 animate-spin" />
              <span className="font-bold">Gemini AI yanıt hazırlıyor...</span>
            </div>
          </div>
        )}
      </div>

      {/* Responsive Bottom Input Area (Inside component, sticky at bottom) */}
      <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-lg space-y-2">
        {/* Suggested Phrases for the Active Scenario */}
        {activeMode === 'roleplay' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 shrink-0">Hızlı İfadeler:</span>
            {currentScenario.suggestedPhrases.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s.kz)}
                className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl border border-teal-200 shrink-0 font-bold transition active:scale-95 flex items-center gap-1 cursor-pointer"
                title={s.tr}
              >
                <span>{s.kz}</span>
              </button>
            ))}
          </div>
        )}

        {/* Input Form */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }} 
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              activeMode === 'roleplay'
                ? `${currentScenario.partnerName} ile Kazakça konuşun...`
                : (isTr ? "Kazakça bir mesaj yazın..." : "Қазақша хабарлама жазыңыз...")
            }
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-medium"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-2xl shadow-md transition shrink-0 active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
