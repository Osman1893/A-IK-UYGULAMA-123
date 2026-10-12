import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  Plus, 
  Search, 
  Volume2, 
  Download, 
  Upload, 
  FileText, 
  Rocket, 
  Settings, 
  Activity, 
  Sparkles,
  Save,
  X,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Database,
  Layers,
  HelpCircle,
  Copy,
  Check,
  UserCheck,
  UserX,
  RotateCcw,
  KeyRound
} from 'lucide-react';
import { 
  Unit, 
  Lesson, 
  VocabItem, 
  UserProfile, 
  TranslationErrorTicket, 
  AuditLogItem, 
  AppReleaseMetadata,
  CefrLevel 
} from '../../types';
import { storageService, SUPER_ADMIN_EMAIL } from '../../services/storageService';
import { audioService } from '../../services/audioService';

interface AdminDashboardProps {
  user: UserProfile;
  units: Unit[];
  onUnitsChange: (units: Unit[]) => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  units,
  onUnitsChange,
  onExitAdmin
}) => {
  const [activeModule, setActiveModule] = useState<
    'overview' | 'curriculum' | 'vocabulary' | 'tickets' | 'users' | 'audit' | 'release'
  >('overview');

  // Tickets & System state
  const [tickets, setTickets] = useState<TranslationErrorTicket[]>(() => storageService.getErrorTickets());
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => storageService.getAuditLogs());
  const [appConfig, setAppConfig] = useState<AppReleaseMetadata>(() => storageService.getAppConfig());
  const [usersList, setUsersList] = useState<UserProfile[]>(() => storageService.getRegisteredUsers());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Search & Filter
  const [vocabSearch, setVocabSearch] = useState('');
  const [editingWord, setEditingWord] = useState<VocabItem | null>(null);

  // Unit Editing States
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [isNewUnitModalOpen, setIsNewUnitModalOpen] = useState(false);
  const [newUnitLevel, setNewUnitLevel] = useState<CefrLevel>('A1');
  const [newUnitTitleTr, setNewUnitTitleTr] = useState('');
  const [newUnitTitleKz, setNewUnitTitleKz] = useState('');
  const [newUnitDescTr, setNewUnitDescTr] = useState('');
  const [newUnitDescKz, setNewUnitDescKz] = useState('');

  // Lesson Editing States
  const [isNewLessonModalOpen, setIsNewLessonModalOpen] = useState(false);
  const [selectedUnitForNewLesson, setSelectedUnitForNewLesson] = useState<string>(units[0]?.id || '');
  const [newLessonTitleTr, setNewLessonTitleTr] = useState('');
  const [newLessonTitleKz, setNewLessonTitleKz] = useState('');
  const [newLessonSummaryTr, setNewLessonSummaryTr] = useState('');
  const [newLessonSummaryKz, setNewLessonSummaryKz] = useState('');
  const [editingLessonPair, setEditingLessonPair] = useState<{ unitId: string; lesson: Lesson } | null>(null);

  // New Word Modal
  const [isNewWordModalOpen, setIsNewWordModalOpen] = useState(false);
  const [newWordTargetUnitId, setNewWordTargetUnitId] = useState(units[0]?.id || '');
  const [newWordTargetLessonId, setNewWordTargetLessonId] = useState(units[0]?.lessons[0]?.id || '');
  const [newWordKzCyrillic, setNewWordKzCyrillic] = useState('');
  const [newWordKzLatin, setNewWordKzLatin] = useState('');
  const [newWordTurkish, setNewWordTurkish] = useState('');
  const [newWordCategory, setNewWordCategory] = useState('Genel');
  const [newWordExampleKz, setNewWordExampleKz] = useState('');
  const [newWordExampleTr, setNewWordExampleTr] = useState('');
  const [newWordFalseFriend, setNewWordFalseFriend] = useState('');

  // Admin Password Change Modal States
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // File input ref for JSON restore
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdminPassword !== confirmAdminPassword) {
      setPasswordChangeMessage({ text: 'Şifreler birbiriyle uyuşmuyor!', isError: true });
      return;
    }
    const res = storageService.changeAdminPassword(newAdminPassword);
    if (!res.success) {
      setPasswordChangeMessage({ text: res.error || 'Şifre güncellenemedi.', isError: true });
      return;
    }
    setAuditLogs(storageService.getAuditLogs());
    setPasswordChangeMessage({ text: 'Yönetici şifreniz SHA-256 ile başarıyla güncellendi!', isError: false });
    setTimeout(() => {
      setIsChangePasswordModalOpen(false);
      setNewAdminPassword('');
      setConfirmAdminPassword('');
      setPasswordChangeMessage(null);
    }, 1500);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Handle Save Word Edit
  const handleSaveWordEdit = () => {
    if (!editingWord) return;
    storageService.updateVocabEverywhere(editingWord.id, editingWord);
    onUnitsChange(storageService.getUnits());
    setAuditLogs(storageService.getAuditLogs());
    setEditingWord(null);
  };

  // Handle Delete Word
  const handleDeleteWord = (vocabId: string) => {
    if (confirm('Bu kelimeyi tüm derslerden ve sözlükten kalıcı olarak silmek istediğinizden emin misiniz?')) {
      storageService.deleteWordEverywhere(vocabId);
      onUnitsChange(storageService.getUnits());
      setAuditLogs(storageService.getAuditLogs());
    }
  };

  // Handle Create Unit
  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitTitleTr || !newUnitTitleKz) return;

    storageService.createUnit({
      unitNumber: units.length + 1,
      level: newUnitLevel,
      direction: 'TR_TO_KZ',
      titleTr: newUnitTitleTr,
      titleKz: newUnitTitleKz,
      descriptionTr: newUnitDescTr,
      descriptionKz: newUnitDescKz,
      icon: 'BookOpen',
      isPublished: true,
      lessons: []
    });

    onUnitsChange(storageService.getUnits());
    setAuditLogs(storageService.getAuditLogs());
    setIsNewUnitModalOpen(false);
    setNewUnitTitleTr('');
    setNewUnitTitleKz('');
    setNewUnitDescTr('');
    setNewUnitDescKz('');
  };

  // Handle Save Unit Edit
  const handleSaveUnitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUnit) return;
    storageService.updateUnit(editingUnit.id, {
      titleTr: editingUnit.titleTr,
      titleKz: editingUnit.titleKz,
      descriptionTr: editingUnit.descriptionTr,
      descriptionKz: editingUnit.descriptionKz,
      level: editingUnit.level,
      isPublished: editingUnit.isPublished
    });
    onUnitsChange(storageService.getUnits());
    setAuditLogs(storageService.getAuditLogs());
    setEditingUnit(null);
  };

  // Handle Delete Unit
  const handleDeleteUnit = (unitId: string) => {
    if (confirm('Bu üniteyi ve içindeki dersleri silmek istediğinizden emin misiniz?')) {
      storageService.deleteUnit(unitId);
      onUnitsChange(storageService.getUnits());
      setAuditLogs(storageService.getAuditLogs());
    }
  };

  // Handle Create Lesson
  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnitForNewLesson || !newLessonTitleTr || !newLessonTitleKz) return;

    const unit = units.find(u => u.id === selectedUnitForNewLesson);
    const lessonNum = (unit?.lessons.length || 0) + 1;

    storageService.addLessonToUnit(selectedUnitForNewLesson, {
      lessonNumber: lessonNum,
      titleTr: newLessonTitleTr,
      titleKz: newLessonTitleKz,
      summaryTr: newLessonSummaryTr,
      summaryKz: newLessonSummaryKz,
      learningObjectivesTr: ['Temel ifadeleri ve gramer kurallarını kavrama'],
      learningObjectivesKz: ['Негізгі ережелерді меңгеру'],
      vocabulary: [],
      grammar: {
        titleTr: 'Ders Dil Bilgisi Notu',
        titleKz: 'Грамматикалық ереже',
        explanationTr: 'Bu dersin karşılaştırmalı dil bilgisi açıklaması.',
        explanationKz: 'Сабақтың грамматикасы.',
        rules: [],
        examples: [],
        commonMistakes: []
      },
      dialogue: {
        id: 'dlg-' + Date.now(),
        titleTr: 'Ders Diyaloğu',
        titleKz: 'Сұхбат',
        contextTr: 'Günlük konuşma pratiği.',
        contextKz: 'Күнделікті сөйлесу.',
        lines: [
          {
            id: 'dl-' + Date.now(),
            speaker: 'Студент',
            avatar: '🧑‍🎓',
            kazakh: 'Сәлеметсіз бе! Сабақты бастайық.',
            turkish: 'Merhaba! Derse başlayalım.'
          }
        ]
      },
      exercises: [
        {
          id: 'ex-' + Date.now(),
          type: 'multiple_choice',
          questionTr: 'Bu dersin ana kavramı hangisidir?',
          questionKz: 'Сабақтың негізгі ұғымы:',
          options: ['Kazakça', 'Türkçe', 'Öğrenme', 'Başarı'],
          correctAnswer: 'Kazakça',
          explanationTr: 'Doğru cevap!',
          explanationKz: 'Дұрыс жауап!',
          points: 10
        }
      ],
      isPublished: true
    });

    onUnitsChange(storageService.getUnits());
    setAuditLogs(storageService.getAuditLogs());
    setIsNewLessonModalOpen(false);
    setNewLessonTitleTr('');
    setNewLessonTitleKz('');
    setNewLessonSummaryTr('');
    setNewLessonSummaryKz('');
  };

  // Handle Save Lesson Edit
  const handleSaveLessonEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLessonPair) return;
    storageService.updateLesson(editingLessonPair.unitId, editingLessonPair.lesson.id, {
      titleTr: editingLessonPair.lesson.titleTr,
      titleKz: editingLessonPair.lesson.titleKz,
      summaryTr: editingLessonPair.lesson.summaryTr,
      summaryKz: editingLessonPair.lesson.summaryKz,
      grammar: editingLessonPair.lesson.grammar
    });
    onUnitsChange(storageService.getUnits());
    setAuditLogs(storageService.getAuditLogs());
    setEditingLessonPair(null);
  };

  // Handle Delete Lesson
  const handleDeleteLesson = (unitId: string, lessonId: string) => {
    if (confirm('Bu dersi ve içindeki alıştırmaları silmek istediğinizden emin misiniz?')) {
      storageService.deleteLesson(unitId, lessonId);
      onUnitsChange(storageService.getUnits());
      setAuditLogs(storageService.getAuditLogs());
    }
  };

  // Handle Create Word
  const handleCreateWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWordKzCyrillic || !newWordTurkish) return;

    storageService.addWordToLesson(newWordTargetUnitId, newWordTargetLessonId, {
      kazakhCyrillic: newWordKzCyrillic,
      kazakhLatin: newWordKzLatin || newWordKzCyrillic,
      turkish: newWordTurkish,
      phoneticGuide: (newWordKzLatin || newWordKzCyrillic).toLowerCase(),
      partOfSpeech: 'noun',
      exampleKazakh: newWordExampleKz,
      exampleTurkish: newWordExampleTr,
      category: newWordCategory,
      falseFriendWarning: newWordFalseFriend || undefined
    });

    onUnitsChange(storageService.getUnits());
    setAuditLogs(storageService.getAuditLogs());
    setIsNewWordModalOpen(false);
    setNewWordKzCyrillic('');
    setNewWordKzLatin('');
    setNewWordTurkish('');
    setNewWordExampleKz('');
    setNewWordExampleTr('');
    setNewWordFalseFriend('');
  };

  // Handle Ticket Resolution
  const handleResolveTicket = (ticket: TranslationErrorTicket, action: 'resolved' | 'rejected') => {
    if (action === 'resolved') {
      const allVocab = storageService.getAllVocabulary();
      const match = allVocab.find(v => 
        v.kazakhCyrillic.toLowerCase() === ticket.wordOrPhrase.toLowerCase()
      );
      if (match) {
        storageService.updateVocabEverywhere(match.id, {
          turkish: ticket.suggestedCorrection
        });
      }
    }
    storageService.resolveErrorTicket(ticket.id, action, 'Super Admin tarafından doğrulandı ve güncellendi.');
    setTickets(storageService.getErrorTickets());
    setAuditLogs(storageService.getAuditLogs());
    onUnitsChange(storageService.getUnits());
  };

  // Handle User Role Toggle
  const handleToggleUserRole = (targetUser: UserProfile) => {
    if (targetUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      alert('Baş Yönetici (Osman Dadaş) hesabı dokunulmazdır.');
      return;
    }
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    storageService.updateUserRole(targetUser.id, newRole);
    setUsersList(storageService.getRegisteredUsers());
    setAuditLogs(storageService.getAuditLogs());
  };

  // Handle Delete User
  const handleDeleteUser = (targetUser: UserProfile) => {
    if (targetUser.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
      alert('Baş Yönetici (Osman Dadaş) silinemez.');
      return;
    }
    if (confirm(`${targetUser.name} (${targetUser.email}) kullanıcısını silmek istediğinize emin misiniz?`)) {
      storageService.deleteUser(targetUser.id);
      setUsersList(storageService.getRegisteredUsers());
      setAuditLogs(storageService.getAuditLogs());
    }
  };

  // JSON Export / Backup
  const handleExportDatabase = () => {
    const data = {
      appName: 'Uzaktan Turkolog',
      exportDate: new Date().toISOString(),
      adminEmail: SUPER_ADMIN_EMAIL,
      units: storageService.getUnits(),
      tickets: storageService.getErrorTickets(),
      auditLogs: storageService.getAuditLogs(),
      appConfig: storageService.getAppConfig()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uzaktan-turkolog-yedek-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  // JSON Restore / Import
  const handleImportDatabase = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const res = storageService.importDatabaseJson(json);
        if (res.success) {
          alert(res.message);
          onUnitsChange(storageService.getUnits());
          setTickets(storageService.getErrorTickets());
          setAuditLogs(storageService.getAuditLogs());
          setAppConfig(storageService.getAppConfig());
        } else {
          alert(res.message);
        }
      } catch (err: any) {
        alert('Geçersiz dosya: ' + (err?.message || 'JSON okunamadı'));
      }
    };
    reader.readAsText(file);
  };

  // Factory Curriculum Reset
  const handleResetCurriculum = () => {
    if (confirm('Tüm müfredatı fabrika çıkışı 17 üniteye ve 34 derse sıfırlamak istediğinizden emin misiniz? Özel eklediğiniz üniteler etkilenebilir.')) {
      const freshUnits = storageService.resetCurriculumToInitial();
      onUnitsChange(freshUnits);
      setAuditLogs(storageService.getAuditLogs());
      alert('Müfredat başarıyla 17 ünite ve 34 derse yenilendi!');
    }
  };

  const allVocabulary = storageService.getAllVocabulary();
  const filteredVocab = allVocabulary.filter(v => 
    v.kazakhCyrillic.toLowerCase().includes(vocabSearch.toLowerCase()) ||
    v.turkish.toLowerCase().includes(vocabSearch.toLowerCase()) ||
    v.category.toLowerCase().includes(vocabSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Hidden file input for JSON database restore */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportDatabase}
        accept=".json"
        className="hidden"
      />

      {/* Super Admin Top Header */}
      <header className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-6 h-6 stroke-[2.3]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black tracking-tight text-white">
                UZAKTAN TÜRKOLOG • BAŞ YÖNETİCİ MERKEZİ
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase">
                Aktif & Yetkili
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Sistem Sahibi: <span className="text-amber-400 font-bold">{SUPER_ADMIN_EMAIL}</span> (Tüm Düzenleme Yetkileri Açık)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
            title="JSON yedeğinden geri yükle"
          >
            <Upload className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Yedek Yükle</span>
          </button>

          <button
            onClick={handleExportDatabase}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
            title="Tüm veritabanını JSON olarak indir"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Yedek İndir</span>
          </button>

          <button
            onClick={() => { setIsChangePasswordModalOpen(true); setPasswordChangeMessage(null); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-amber-500/30 transition shadow-xs"
            title="Yönetici Şifresini Değiştir"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Şifre Değiştir</span>
          </button>

          <button
            onClick={onExitAdmin}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-black shadow-md shadow-teal-600/20 transition"
          >
            <span>Öğrenci Modu</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Navigation Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 flex items-center gap-1.5 overflow-x-auto select-none py-1">
        {[
          { id: 'overview', label: '📊 Genel Bakış', icon: Activity },
          { id: 'curriculum', label: `📚 Müfredat & Dersler (${units.length})`, icon: BookOpen },
          { id: 'vocabulary', label: `📖 Sözlük CMS (${allVocabulary.length})`, icon: FileText },
          { id: 'tickets', label: `🚨 Hata Bildirimleri (${tickets.filter(t => t.status === 'pending').length})`, icon: AlertTriangle },
          { id: 'users', label: `👥 Kullanıcılar (${usersList.length})`, icon: Users },
          { id: 'audit', label: '📜 Güvenlik Günlüğü', icon: RefreshCw },
          { id: 'release', label: '🚀 Mağaza Yayın Paketi', icon: Rocket },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveModule(tab.id as any)}
            className={`py-2.5 px-3.5 text-xs font-bold rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
              activeModule === tab.id
                ? 'bg-amber-500/15 text-amber-300 font-black border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Admin Content Area */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
        
        {/* ========================================================= */}
        {/* 1. MODULE: OVERVIEW (GENEL BAKIŞ) */}
        {/* ========================================================= */}
        {activeModule === 'overview' && (
          <div className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl shadow-sm">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Toplam Müfredat
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {units.length} Ünite
                </div>
                <span className="text-[11px] text-teal-400 font-bold mt-1 block">
                  {units.reduce((acc, u) => acc + u.lessons.length, 0)} İnteraktif Ders
                </span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl shadow-sm">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Sözlük Kelimeleri
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {allVocabulary.length}
                </div>
                <span className="text-[11px] text-amber-400 font-bold mt-1 block">
                  Kiril, Latin, Ses & Çeviri
                </span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl shadow-sm">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Kayıtlı Kullanıcılar
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {usersList.length}
                </div>
                <span className="text-[11px] text-indigo-400 font-bold mt-1 block">
                  Tam Üye Statüsünde
                </span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-2xl shadow-sm">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Bekleyen Hata Talebi
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {tickets.filter(t => t.status === 'pending').length}
                </div>
                <span className="text-[11px] text-rose-400 font-bold mt-1 block">
                  Kullanıcı Bildirimleri
                </span>
              </div>
            </div>

            {/* Quick Actions & System Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-slate-800/60 border border-slate-700 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Hızlı İçerik & Yönetim İşlemleri</span>
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setActiveModule('curriculum'); setIsNewUnitModalOpen(true); }}
                    className="p-3.5 bg-slate-700 hover:bg-slate-600 rounded-2xl text-left border border-slate-600 transition"
                  >
                    <Plus className="w-5 h-5 text-teal-400 mb-1" />
                    <div className="text-xs font-bold text-white">Yeni Ünite Ekle</div>
                    <div className="text-[10px] text-slate-400">A1 - C1 seviyelerinde</div>
                  </button>

                  <button
                    onClick={() => { setActiveModule('curriculum'); setIsNewLessonModalOpen(true); }}
                    className="p-3.5 bg-slate-700 hover:bg-slate-600 rounded-2xl text-left border border-slate-600 transition"
                  >
                    <BookOpen className="w-5 h-5 text-indigo-400 mb-1" />
                    <div className="text-xs font-bold text-white">Yeni Ders Ekle</div>
                    <div className="text-[10px] text-slate-400">Üniteye ders bağla</div>
                  </button>

                  <button
                    onClick={() => { setActiveModule('vocabulary'); setIsNewWordModalOpen(true); }}
                    className="p-3.5 bg-slate-700 hover:bg-slate-600 rounded-2xl text-left border border-slate-600 transition"
                  >
                    <FileText className="w-5 h-5 text-amber-400 mb-1" />
                    <div className="text-xs font-bold text-white">Yeni Kelime Tanımla</div>
                    <div className="text-[10px] text-slate-400">Sözlük ve derslere</div>
                  </button>

                  <button
                    onClick={handleResetCurriculum}
                    className="p-3.5 bg-slate-700 hover:bg-rose-900/40 rounded-2xl text-left border border-slate-600 transition"
                  >
                    <RotateCcw className="w-5 h-5 text-rose-400 mb-1" />
                    <div className="text-xs font-bold text-white">Müfredatı Sıfırla</div>
                    <div className="text-[10px] text-slate-400">17 Ünite fabrika çıkışı</div>
                  </button>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700 p-6 rounded-3xl space-y-3">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Sistem ve Güvenlik Altyapısı</span>
                </h3>
                <div className="text-xs space-y-2 text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-700">
                    <span className="text-slate-400">Uygulama Kimliği:</span>
                    <span className="font-bold text-white">Uzaktan Türkolog v1.0 Pro</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-700">
                    <span className="text-slate-400">Pedagojik Çerçeve:</span>
                    <span className="font-bold text-white">CEFR A1 - C1 Kazakistan Müfredatı</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-700">
                    <span className="text-slate-400">Aktif Dil Yönü:</span>
                    <span className="font-bold text-teal-400">TR ➔ KZ & KZ ➔ TR (İki Yönlü)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-700">
                    <span className="text-slate-400">Güvenlik Durumu:</span>
                    <span className="font-bold text-emerald-400">XSS Koruması + Rate Limiting Aktif</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Mağaza Uyumluluğu:</span>
                    <span className="font-bold text-amber-400">App Store & Play Store Hazır</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* 2. MODULE: CURRICULUM & LESSONS (MÜFREDAT VE DERSLER) */}
        {/* ========================================================= */}
        {activeModule === 'curriculum' && (
          <div className="space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-white">Müfredat, Üniteler ve Dersler Yönetimi</h2>
                <p className="text-xs text-slate-400">
                  Tüm üniteleri ve dersleri düzenleyin, yeni dersler ekleyin, silin ve yayın durumunu ayarlayın.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsNewLessonModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ders Ekle</span>
                </button>
                <button
                  onClick={() => setIsNewUnitModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ünite Ekle</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {units.map((unit) => (
                <div key={unit.id} className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-xs">
                  
                  {/* Unit Title Bar */}
                  <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-700 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-black rounded-lg text-xs">
                        {unit.level}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-black text-white">{unit.titleTr}</h3>
                          {!unit.isPublished && (
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-bold">
                              Taslak (Gizli)
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-teal-400 font-medium">{unit.titleKz}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 mr-1">
                        {unit.lessons.length} Ders
                      </span>
                      <button
                        onClick={() => {
                          setSelectedUnitForNewLesson(unit.id);
                          setIsNewLessonModalOpen(true);
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        title="Bu üniteye ders ekle"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ders Ekle</span>
                      </button>
                      <button
                        onClick={() => setEditingUnit({ ...unit })}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        title="Üniteyi Düzenle"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Düzenle</span>
                      </button>
                      <button
                        onClick={() => handleDeleteUnit(unit.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 transition"
                        title="Üniteyi Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Lessons Inside Unit */}
                  <div className="divide-y divide-slate-700/60 p-2">
                    {unit.lessons.map(lesson => (
                      <div key={lesson.id} className="px-4 py-3 flex flex-wrap items-center justify-between hover:bg-slate-700/30 rounded-xl transition gap-2">
                        <div className="flex-1 min-w-[200px]">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-[10px] font-bold">
                              {lesson.lessonNumber}
                            </span>
                            <span className="text-xs font-bold text-white">{lesson.titleTr}</span>
                            <span className="text-xs text-slate-400">({lesson.titleKz})</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 ml-7">
                            {lesson.summaryTr}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                            {lesson.vocabulary.length} Kelime
                          </span>
                          <span className="text-[11px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                            {lesson.exercises.length} Alıştırma
                          </span>
                          <button
                            onClick={() => setEditingLessonPair({ unitId: unit.id, lesson: { ...lesson } })}
                            className="p-1.5 text-amber-400 hover:text-amber-300 transition"
                            title="Dersi Düzenle"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(unit.id, lesson.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 transition"
                            title="Dersi Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {unit.lessons.length === 0 && (
                      <div className="p-4 text-center text-xs text-slate-500">
                        Bu ünitede henüz ders bulunmuyor. "Ders Ekle" butonuna basarak ilk dersi ekleyin.
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* 3. MODULE: VOCABULARY & DICTIONARY CMS */}
        {/* ========================================================= */}
        {activeModule === 'vocabulary' && (
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-white">Sözlük ve Kelime Editörü</h2>
                <p className="text-xs text-slate-400">
                  Kazakça Kiril, Latin ve Türkçe karşılıkları doğrudan düzenleyin veya silin.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsNewWordModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-extrabold transition shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni Kelime Ekle</span>
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Kelime ara (Kiril, Latin veya Türkçe)..."
                value={vocabSearch}
                onChange={(e) => setVocabSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-2xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Vocabulary Table */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-700 text-slate-400 uppercase text-[10px] font-extrabold">
                    <tr>
                      <th className="py-3 px-4">Kazakça (Kiril)</th>
                      <th className="py-3 px-4">Latin</th>
                      <th className="py-3 px-4">Türkçe Karşılığı</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredVocab.map((word) => (
                      <tr key={word.id} className="hover:bg-slate-700/30 transition">
                        <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                          <button
                            onClick={() => audioService.speakWord(word.kazakhCyrillic)}
                            className="p-1 hover:text-amber-400 text-slate-400 transition"
                            title="Telaffuz Dinle"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <span>{word.kazakhCyrillic}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                          {word.kazakhLatin}
                        </td>
                        <td className="py-3 px-4 font-semibold text-teal-300">
                          {word.turkish}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] font-bold">
                            {word.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => setEditingWord({ ...word })}
                              className="p-1 text-amber-400 hover:text-amber-300 transition"
                              title="Kelimeyi Düzenle"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteWord(word.id)}
                              className="p-1 text-slate-400 hover:text-rose-400 transition"
                              title="Kelimeyi Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* 4. MODULE: ERROR TICKETS */}
        {/* ========================================================= */}
        {activeModule === 'tickets' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-black text-white">Kullanıcı Çeviri Hata Bildirimleri</h2>
              <p className="text-xs text-slate-400">
                Öğrencilerin bildirdiği çeviri hatalarını onaylayıp sözlüğe anında yansıtın.
              </p>
            </div>

            {tickets.length === 0 ? (
              <div className="p-8 text-center bg-slate-800 border border-slate-700 rounded-2xl text-slate-400 text-xs">
                Şu anda bekleyen çeviri hatası bildirimi bulunmuyor.
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map(ticket => (
                  <div key={ticket.id} className="bg-slate-800 border border-slate-700 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-sm">{ticket.wordOrPhrase}</span>
                        <span className="text-slate-400">➔</span>
                        <span className="text-rose-400 line-through">{ticket.currentTranslation}</span>
                        <span className="text-slate-400">➔</span>
                        <span className="text-emerald-400 font-bold">{ticket.suggestedCorrection}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{ticket.explanation}</p>
                      <span className="text-[10px] text-slate-500 block">
                        Bildiren: {ticket.reportedByName || ticket.reportedByEmail} • {new Date(ticket.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>

                    {ticket.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleResolveTicket(ticket, 'resolved')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1 transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Onayla & Güncelle</span>
                        </button>
                        <button
                          onClick={() => handleResolveTicket(ticket, 'rejected')}
                          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl font-bold transition"
                        >
                          Reddet
                        </button>
                      </div>
                    ) : (
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                        ticket.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'
                      }`}>
                        {ticket.status === 'resolved' ? '✓ Düzeltildi' : 'Reddedildi'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. MODULE: USERS & ROLES */}
        {/* ========================================================= */}
        {activeModule === 'users' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-black text-white">Kayıtlı Kullanıcılar ve Yetki Yönetimi</h2>
              <p className="text-xs text-slate-400">Üyeleri görüntüleyin, rol atayın veya spam hesapları yönetin.</p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden divide-y divide-slate-700">
              {usersList.map((u) => (
                <div key={u.id} className="p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatarUrl || 'https://api.dicebear.com/7.x/adventurer/svg?seed=user'}
                      alt={u.name}
                      className="w-10 h-10 rounded-full border border-slate-600 object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white">{u.name}</span>
                        {u.isSuperAdmin && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/30">
                            BAŞ ADMİN
                          </span>
                        )}
                        {!u.isSuperAdmin && u.role === 'admin' && (
                          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                            YÖNETİCİ
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>XP: {u.xpPoints}</span>
                        <span>•</span>
                        <span>Seviye: {u.currentLevel}</span>
                        <span>•</span>
                        <span>Yön: {u.currentDirection}</span>
                      </div>
                    </div>
                  </div>

                  {!u.isSuperAdmin && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleUserRole(u)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 ${
                          u.role === 'admin'
                            ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30'
                            : 'bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 border border-indigo-500/30'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{u.role === 'admin' ? 'Yetkiyi Geri Al' : 'Admin Yap'}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 transition"
                        title="Kullanıcıyı Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 6. MODULE: AUDIT LOGS */}
        {/* ========================================================= */}
        {activeModule === 'audit' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-black text-white">Sistem ve Güvenlik Denetim Günlüğü</h2>
              <p className="text-xs text-slate-400">Tüm yetkili işlemlerin ve oturum olaylarının kayıtları.</p>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden divide-y divide-slate-700/60 max-h-[600px] overflow-y-auto">
              {auditLogs.map(log => (
                <div key={log.id} className="p-3.5 flex items-start justify-between text-xs gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono text-[10px]">
                        {log.module}
                      </span>
                      <span className="font-bold text-white">{log.action}</span>
                      <span className="text-slate-400 text-[11px]">• {log.userEmail}</span>
                    </div>
                    <p className="text-slate-300 mt-1">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString('tr-TR')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 7. MODULE: STORE RELEASE HUB */}
        {/* ========================================================= */}
        {activeModule === 'release' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-black text-white">Google Play ve App Store Yayınlama Paketi</h2>
              <p className="text-xs text-slate-400">
                Uygulamanın mağazalara sorunsuz yüklenmesi için gerekli tüm paket bilgileri, kimlikler ve açıklamalar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Android Config */}
              <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>🤖</span>
                    <span>Google Play Store (Android)</span>
                  </h3>
                  <button
                    onClick={() => handleCopy(appConfig.packageNameAndroid, 'pkg_android')}
                    className="text-xs text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1"
                  >
                    {copiedKey === 'pkg_android' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Kopyala</span>
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Paket Adı (Package ID):</span>
                    <span className="font-mono text-teal-400 font-bold">{appConfig.packageNameAndroid}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Hedef SDK (Target SDK):</span>
                    <span className="font-bold text-white">Android 14 (API 34) - Play Store Güncel Uyumlu</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Sürüm Kodu / Adı:</span>
                    <span className="font-bold text-white">Version {appConfig.versionName} (Build {appConfig.versionCode})</span>
                  </div>
                </div>
              </div>

              {/* iOS Config */}
              <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>🍎</span>
                    <span>Apple App Store (iOS)</span>
                  </h3>
                  <button
                    onClick={() => handleCopy(appConfig.bundleIdIos, 'bundle_ios')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                  >
                    {copiedKey === 'bundle_ios' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Kopyala</span>
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Bundle Identifier:</span>
                    <span className="font-mono text-cyan-400 font-bold">{appConfig.bundleIdIos}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">iOS Hedef Sürüm:</span>
                    <span className="font-bold text-white">iOS 15.0+ (Swift / WebKit / Capacitor)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">App Store Kılavuz 5.1.1(v):</span>
                    <span className="font-bold text-emerald-400">✓ Hesap Silme Düğmesi Entegre</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Store Descriptions */}
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl space-y-4 text-xs">
              <h3 className="text-sm font-black text-white">Mağaza Tanıtım Metinleri (Türkçe & Kazakça)</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-300">Kısa Açıklama (Türkçe - 80 Karakter):</span>
                  <button onClick={() => handleCopy(appConfig.shortDescriptionTr, 'short_tr')} className="text-teal-400 hover:underline">Kopyala</button>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl text-slate-300 border border-slate-700">
                  {appConfig.shortDescriptionTr}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-300">Kısa Açıklama (Kazakça):</span>
                  <button onClick={() => handleCopy(appConfig.shortDescriptionKz, 'short_kz')} className="text-teal-400 hover:underline">Kopyala</button>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl text-slate-300 border border-slate-700">
                  {appConfig.shortDescriptionKz}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-300">Tam Açıklama (Türkçe):</span>
                  <button onClick={() => handleCopy(appConfig.fullDescriptionTr, 'full_tr')} className="text-teal-400 hover:underline">Kopyala</button>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl text-slate-300 border border-slate-700 leading-relaxed">
                  {appConfig.fullDescriptionTr}
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* MODAL: EDIT UNIT MODAL */}
      {/* ========================================================= */}
      {editingUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <form onSubmit={handleSaveUnitEdit} className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">Üniteyi Düzenle</h3>
              <button type="button" onClick={() => setEditingUnit(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">CEFR Seviyesi:</label>
                  <select
                    value={editingUnit.level}
                    onChange={(e) => setEditingUnit({ ...editingUnit, level: e.target.value as CefrLevel })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
                  >
                    <option value="A1">A1 (Başlangıç)</option>
                    <option value="A2">A2 (Temel)</option>
                    <option value="B1">B1 (Orta)</option>
                    <option value="B2">B2 (İleri-Orta)</option>
                    <option value="C1">C1 (Akademik)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Yayın Durumu:</label>
                  <select
                    value={editingUnit.isPublished ? 'true' : 'false'}
                    onChange={(e) => setEditingUnit({ ...editingUnit, isPublished: e.target.value === 'true' })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
                  >
                    <option value="true">Yayında (Öğrencilere Açık)</option>
                    <option value="false">Taslak (Gizli)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Başlık (Türkçe):</label>
                <input
                  type="text"
                  value={editingUnit.titleTr}
                  onChange={(e) => setEditingUnit({ ...editingUnit, titleTr: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Başlık (Kazakça):</label>
                <input
                  type="text"
                  value={editingUnit.titleKz}
                  onChange={(e) => setEditingUnit({ ...editingUnit, titleKz: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Açıklama (Türkçe):</label>
                <textarea
                  value={editingUnit.descriptionTr}
                  onChange={(e) => setEditingUnit({ ...editingUnit, descriptionTr: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white h-16"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Açıklama (Kazakça):</label>
                <textarea
                  value={editingUnit.descriptionKz}
                  onChange={(e) => setEditingUnit({ ...editingUnit, descriptionKz: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white h-16"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUnit(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-black rounded-xl"
                >
                  Değişiklikleri Kaydet ✓
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: NEW UNIT MODAL */}
      {/* ========================================================= */}
      {isNewUnitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <form onSubmit={handleCreateUnit} className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">Yeni Ünite Oluştur</h3>
              <button type="button" onClick={() => setIsNewUnitModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">CEFR Seviyesi:</label>
                <select
                  value={newUnitLevel}
                  onChange={(e) => setNewUnitLevel(e.target.value as CefrLevel)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
                >
                  <option value="A1">A1 (Başlangıç)</option>
                  <option value="A2">A2 (Temel)</option>
                  <option value="B1">B1 (Orta)</option>
                  <option value="B2">B2 (İleri-Orta)</option>
                  <option value="C1">C1 (Akademik)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Başlık (Türkçe):</label>
                <input
                  type="text"
                  placeholder="Örn: Ünite 6: Doğa ve Çevre"
                  value={newUnitTitleTr}
                  onChange={(e) => setNewUnitTitleTr(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Başlık (Kazakça):</label>
                <input
                  type="text"
                  placeholder="Мысалы: 6-бөлім: Табиғат"
                  value={newUnitTitleKz}
                  onChange={(e) => setNewUnitTitleKz(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Açıklama (Türkçe):</label>
                <textarea
                  placeholder="Ünite kapsamı..."
                  value={newUnitDescTr}
                  onChange={(e) => setNewUnitDescTr(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white h-16"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Açıklama (Kazakça):</label>
                <textarea
                  placeholder="Бөлім мазмұны..."
                  value={newUnitDescKz}
                  onChange={(e) => setNewUnitDescKz(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white h-16"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewUnitModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-black rounded-xl"
                >
                  Üniteyi Kaydet ✓
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: NEW LESSON MODAL */}
      {/* ========================================================= */}
      {isNewLessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <form onSubmit={handleCreateLesson} className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">Üniteye Yeni Ders Ekle</h3>
              <button type="button" onClick={() => setIsNewLessonModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Eklenecek Ünite:</label>
                <select
                  value={selectedUnitForNewLesson}
                  onChange={(e) => setSelectedUnitForNewLesson(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
                >
                  {units.map(u => (
                    <option key={u.id} value={u.id}>[{u.level}] {u.titleTr}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Ders Başlığı (Türkçe):</label>
                <input
                  type="text"
                  placeholder="Örn: Ders 3: Yeni Kelimeler ve Alıştırmalar"
                  value={newLessonTitleTr}
                  onChange={(e) => setNewLessonTitleTr(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Ders Başlığı (Kazakça):</label>
                <input
                  type="text"
                  placeholder="Мысалы: 3-сабақ: Жаңа сөздер"
                  value={newLessonTitleKz}
                  onChange={(e) => setNewLessonTitleKz(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Ders Özeti (Türkçe):</label>
                <textarea
                  placeholder="Kazanımlar ve özet..."
                  value={newLessonSummaryTr}
                  onChange={(e) => setNewLessonSummaryTr(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white h-16"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Ders Özeti (Kazakça):</label>
                <textarea
                  placeholder="Сабақ мазмұны..."
                  value={newLessonSummaryKz}
                  onChange={(e) => setNewLessonSummaryKz(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white h-16"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewLessonModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl"
                >
                  Dersi Kaydet ✓
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT LESSON MODAL */}
      {/* ========================================================= */}
      {editingLessonPair && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <form onSubmit={handleSaveLessonEdit} className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">Dersi Düzenle</h3>
              <button type="button" onClick={() => setEditingLessonPair(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Ders Başlığı (Türkçe):</label>
                <input
                  type="text"
                  value={editingLessonPair.lesson.titleTr}
                  onChange={(e) => setEditingLessonPair({
                    ...editingLessonPair,
                    lesson: { ...editingLessonPair.lesson, titleTr: e.target.value }
                  })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Ders Başlığı (Kazakça):</label>
                <input
                  type="text"
                  value={editingLessonPair.lesson.titleKz}
                  onChange={(e) => setEditingLessonPair({
                    ...editingLessonPair,
                    lesson: { ...editingLessonPair.lesson, titleKz: e.target.value }
                  })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Özet (Türkçe):</label>
                <textarea
                  value={editingLessonPair.lesson.summaryTr}
                  onChange={(e) => setEditingLessonPair({
                    ...editingLessonPair,
                    lesson: { ...editingLessonPair.lesson, summaryTr: e.target.value }
                  })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white h-16"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Gramer Başlığı (Türkçe):</label>
                <input
                  type="text"
                  value={editingLessonPair.lesson.grammar.titleTr}
                  onChange={(e) => setEditingLessonPair({
                    ...editingLessonPair,
                    lesson: {
                      ...editingLessonPair.lesson,
                      grammar: { ...editingLessonPair.lesson.grammar, titleTr: e.target.value }
                    }
                  })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Gramer Açıklaması (Türkçe):</label>
                <textarea
                  value={editingLessonPair.lesson.grammar.explanationTr}
                  onChange={(e) => setEditingLessonPair({
                    ...editingLessonPair,
                    lesson: {
                      ...editingLessonPair.lesson,
                      grammar: { ...editingLessonPair.lesson.grammar, explanationTr: e.target.value }
                    }
                  })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white h-20"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLessonPair(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl"
                >
                  Değişiklikleri Kaydet ✓
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT WORD MODAL */}
      {/* ========================================================= */}
      {editingWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">Kelime Düzenle</h3>
              <button onClick={() => setEditingWord(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Kazakça (Kiril):</label>
                <input
                  type="text"
                  value={editingWord.kazakhCyrillic}
                  onChange={(e) => setEditingWord({ ...editingWord, kazakhCyrillic: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Kazakça (Latin):</label>
                <input
                  type="text"
                  value={editingWord.kazakhLatin}
                  onChange={(e) => setEditingWord({ ...editingWord, kazakhLatin: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Türkçe Çevirisi:</label>
                <input
                  type="text"
                  value={editingWord.turkish}
                  onChange={(e) => setEditingWord({ ...editingWord, turkish: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Örnek Kazakça Cümle:</label>
                <input
                  type="text"
                  value={editingWord.exampleKazakh || ''}
                  onChange={(e) => setEditingWord({ ...editingWord, exampleKazakh: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Örnek Türkçe Çeviri:</label>
                <input
                  type="text"
                  value={editingWord.exampleTurkish || ''}
                  onChange={(e) => setEditingWord({ ...editingWord, exampleTurkish: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setEditingWord(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  İptal
                </button>
                <button
                  onClick={handleSaveWordEdit}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl"
                >
                  Güncelle ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: NEW WORD MODAL */}
      {/* ========================================================= */}
      {isNewWordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <form onSubmit={handleCreateWord} className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white">Sözlüğe Yeni Kelime Ekle</h3>
              <button type="button" onClick={() => setIsNewWordModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Eklenecek Ünite:</label>
                <select
                  value={newWordTargetUnitId}
                  onChange={(e) => {
                    setNewWordTargetUnitId(e.target.value);
                    const u = units.find(unit => unit.id === e.target.value);
                    if (u && u.lessons[0]) setNewWordTargetLessonId(u.lessons[0].id);
                  }}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
                >
                  {units.map(u => (
                    <option key={u.id} value={u.id}>[{u.level}] {u.titleTr}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Kazakça (Kiril):</label>
                <input
                  type="text"
                  placeholder="Қазақша жазылуы..."
                  value={newWordKzCyrillic}
                  onChange={(e) => setNewWordKzCyrillic(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Kazakça (Latin):</label>
                <input
                  type="text"
                  placeholder="Latynsha jazyluy..."
                  value={newWordKzLatin}
                  onChange={(e) => setNewWordKzLatin(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Türkçe Anlamı:</label>
                <input
                  type="text"
                  placeholder="Türkçe karşılığı..."
                  value={newWordTurkish}
                  onChange={(e) => setNewWordTurkish(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Kategori:</label>
                <input
                  type="text"
                  placeholder="Örn: Yiyecekler, Selamlaşma, İş..."
                  value={newWordCategory}
                  onChange={(e) => setNewWordCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewWordModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl"
                >
                  Kelimeyi Ekle ✓
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CHANGE ADMIN PASSWORD MODAL */}
      {/* ========================================================= */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Yönetici Şifresini Değiştir</h3>
                  <p className="text-[11px] text-slate-400">SHA-256 ile şifrelenir, kaynak kodda asla görünmez</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChangePasswordModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-bold">Yeni Yönetici Şifresi:</label>
                <input
                  type="password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  placeholder="En az 4 karakter"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-bold">Yeni Şifre (Tekrar):</label>
                <input
                  type="password"
                  value={confirmAdminPassword}
                  onChange={(e) => setConfirmAdminPassword(e.target.value)}
                  placeholder="Şifreyi tekrar giriniz"
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              {passwordChangeMessage && (
                <div className={`p-3 rounded-xl text-xs font-bold ${passwordChangeMessage.isError ? 'bg-rose-500/20 border border-rose-500/30 text-rose-300' : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'}`}>
                  {passwordChangeMessage.text}
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl transition shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Şifreyi Güncelle ✓</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
