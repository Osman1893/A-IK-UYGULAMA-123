/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Bell, X } from 'lucide-react';
import { Navbar } from './components/layout/Navbar';
import { MobileFrame } from './components/mobile/MobileFrame';
import { StudentHome } from './components/student/StudentHome';
import { LessonsListView } from './components/student/LessonsListView';
import { LessonView } from './components/student/LessonView';
import { GrammarHubView } from './components/student/GrammarHubView';
import { PrompterReadingView } from './components/student/PrompterReadingView';
import { StoryReaderView } from './components/student/StoryReaderView';
import { SohbetView } from './components/student/SohbetView';
import { DictionaryView } from './components/student/DictionaryView';
import { SpacedRepetitionView } from './components/student/SpacedRepetitionView';
import { ProfileSettingsView } from './components/student/ProfileSettingsView';
import { LeaderboardView } from './components/student/LeaderboardView';
import { StageQuestMapView } from './components/student/StageQuestMapView';
import { SpeakPracticeView } from './components/student/SpeakPracticeView';
import { WordMatchingGameModal } from './components/student/WordMatchingGameModal';
import { PlacementTestModal } from './components/student/PlacementTestModal';
import { KazakhAlphabetVoiceGuide } from './components/student/KazakhAlphabetVoiceGuide';
import { BottomNavBar, MainStudentTab } from './components/student/BottomNavBar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { ReportErrorModal } from './components/student/ReportErrorModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';

import { 
  UserProfile, 
  Unit, 
  Lesson, 
  VocabItem, 
  LanguageDirection, 
  CefrLevel 
} from './types';
import { storageService } from './services/storageService';
import { audioService } from './services/audioService';
import { notificationService, DailyReminderEvent } from './services/notificationService';

export default function App() {
  // Application Data States
  const [user, setUser] = useState<UserProfile>(() => storageService.getCurrentUser());
  const [units, setUnits] = useState<Unit[]>(() => storageService.getUnits());

  // View States: Responsive Modern Web View (default), Mobile Simulator, or Super Admin Panel
  const [viewMode, setViewMode] = useState<'mobile' | 'web' | 'admin'>('web');
  const [studentTab, setStudentTab] = useState<MainStudentTab>('home');
  const [activeLessonPair, setActiveLessonPair] = useState<{ unit: Unit; lesson: Lesson } | null>(null);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [isAlphabetGuideOpen, setIsAlphabetGuideOpen] = useState(false);
  const [isMatchGameOpen, setIsMatchGameOpen] = useState(false);
  const [isPlacementTestOpen, setIsPlacementTestOpen] = useState(false);
  const [placementCallback, setPlacementCallback] = useState<((lvl: CefrLevel) => void) | null>(null);
  const [reportWord, setReportWord] = useState<VocabItem | null>(null);
  const [activeReminderAlert, setActiveReminderAlert] = useState<DailyReminderEvent | null>(null);

  // Daily Study Reminder Scheduler
  useEffect(() => {
    notificationService.startDailyReminderScheduler(() => ({
      enabled: user.notificationsEnabled !== false,
      reminderTime: user.reminderTime || '20:00',
      streakDays: user.streakDays,
      targetXp: user.dailyXpTarget || 50
    }));

    const unsubscribe = notificationService.onDailyReminder((event) => {
      setActiveReminderAlert(event);
      audioService.playFeedbackSound('complete');
    });

    return () => {
      notificationService.stopDailyReminderScheduler();
      unsubscribe();
    };
  }, [user.notificationsEnabled, user.reminderTime, user.streakDays, user.dailyXpTarget]);

  const handleOpenAuth = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  // Switch Language Direction
  const handleDirectionChange = (direction: LanguageDirection) => {
    const updated = storageService.setLanguageDirection(direction);
    setUser({ ...updated });
    audioService.playFeedbackSound('click');
  };

  // Switch CEFR Level
  const handleSelectLevel = (level: CefrLevel) => {
    const updated = storageService.setLevel(level);
    setUser({ ...updated });
    audioService.playFeedbackSound('click');
  };

  // Select Lesson to Start Learning
  const handleSelectLesson = (unit: Unit, lesson: Lesson) => {
    setActiveLessonPair({ unit, lesson });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Complete Lesson and Earn Points
  const handleCompleteLesson = (lessonId: string, earnedXp: number) => {
    const updated = storageService.completeLesson(lessonId, earnedXp);
    setUser({ ...updated });
  };

  // Toggle Word Mastery
  const handleToggleMastery = (wordId: string, mastered: boolean) => {
    const updated = storageService.toggleWordMastery(wordId, mastered);
    setUser({ ...updated });
  };

  // Toggle Favorite Word (Zorlandığım Kelimeler)
  const handleToggleFavorite = (wordId: string) => {
    const updated = storageService.toggleFavoriteWord(wordId);
    setUser({ ...updated });
  };

  // Super Admin Login (requires admin verification password)
  const handleAdminLogin = (password: string) => {
    const res = storageService.loginAsSuperAdmin(password);
    if (res.success && res.user) {
      setUser({ ...res.user });
      setIsAuthModalOpen(false);
      audioService.playFeedbackSound('complete');
      return { success: true };
    }
    audioService.playFeedbackSound('wrong');
    return { success: false, error: res.error || 'Hatalı yönetici şifresi!' };
  };

  // Handle Login with Target Language Selection & Level
  const handleLogin = (
    email: string, 
    direction: LanguageDirection, 
    level: CefrLevel, 
    password?: string
  ) => {
    const res = storageService.loginWithEmail(email, direction, level, password);
    if (!res.success) {
      audioService.playFeedbackSound('wrong');
      return { success: false, error: res.error || 'Giriş başarısız oldu.' };
    }
    setUser({ ...res.user });
    setIsAuthModalOpen(false);
    audioService.playFeedbackSound('correct');
    return { success: true };
  };

  // Handle Registration with Target Language Selection, Initial Level & Nickname
  const handleRegister = (
    email: string, 
    name: string, 
    direction: LanguageDirection, 
    level: CefrLevel, 
    nickname?: string,
    password?: string
  ) => {
    const registeredUser = storageService.registerWithEmail(email, name, direction, level, nickname, password);
    setUser({ ...registeredUser });
    setIsAuthModalOpen(false);
    audioService.playFeedbackSound('complete');
  };

  // Handle Logout (clears session and returns to mandatory registration/login screen)
  const handleLogout = () => {
    const guestUser = storageService.logout();
    setUser({ ...guestUser });
    setActiveLessonPair(null);
    setStudentTab('home');
    setViewMode('mobile');
    setAuthModalTab('login');
    setIsAuthModalOpen(true);
    audioService.playFeedbackSound('click');
  };

  // Trigger Placement Test from Registration modal
  const handleTriggerPlacementFromAuth = (callback: (lvl: CefrLevel) => void) => {
    setPlacementCallback(() => callback);
    setIsPlacementTestOpen(true);
  };

  // Placement Test result handler
  const handlePlacementResult = (level: CefrLevel) => {
    if (placementCallback) {
      placementCallback(level);
      setPlacementCallback(null);
    } else {
      handleSelectLevel(level);
    }
  };

  // Submit Translation Error Ticket
  const handleSubmitErrorTicket = (
    wordOrPhrase: string, 
    currentVal: string, 
    correction: string, 
    explanation: string
  ) => {
    storageService.submitErrorTicket({
      reportedByEmail: user.email,
      reportedByName: user.name,
      wordOrPhrase,
      currentTranslation: currentVal,
      suggestedCorrection: correction,
      explanation
    });
  };

  const allVocabulary = storageService.getAllVocabulary();

  // Active Screen Content in Student Mode
  const renderStudentContent = () => {
    if (activeLessonPair) {
      return (
        <LessonView
          unit={activeLessonPair.unit}
          lesson={activeLessonPair.lesson}
          user={user}
          onBack={() => setActiveLessonPair(null)}
          onCompleteLesson={handleCompleteLesson}
          onToggleMastery={handleToggleMastery}
          onToggleFavorite={handleToggleFavorite}
        />
      );
    }

    switch (studentTab) {
      case 'home':
        return (
          <StudentHome
            user={user}
            units={units}
            onSelectLesson={handleSelectLesson}
            onNavigateTab={(tab) => setStudentTab(tab)}
            onSelectLevel={handleSelectLevel}
            onOpenMatchGame={() => setIsMatchGameOpen(true)}
            onOpenPlacementTest={() => setIsPlacementTestOpen(true)}
            onUpdateUser={(updated) => setUser({ ...updated })}
          />
        );
      case 'stages':
        return (
          <StageQuestMapView
            user={user}
            units={units}
            onSelectLesson={handleSelectLesson}
            onOpenMatchGame={() => setIsMatchGameOpen(true)}
            onNavigateTab={(tab) => setStudentTab(tab)}
            onEarnXp={(xp) => {
              const updated = storageService.addXp(xp);
              setUser({ ...updated });
            }}
          />
        );
      case 'speak':
        return (
          <SpeakPracticeView
            user={user}
            onBack={() => setStudentTab('home')}
            onEarnXp={(xp) => {
              const updated = storageService.addXp(xp);
              setUser({ ...updated });
            }}
          />
        );
      case 'lessons':
        return (
          <LessonsListView
            units={units}
            user={user}
            onSelectLesson={handleSelectLesson}
            onSelectLevel={handleSelectLevel}
            onUpdateUser={(updated) => setUser({ ...updated })}
            onNavigateTab={(tab) => setStudentTab(tab)}
          />
        );
      case 'grammar':
        return (
          <GrammarHubView
            onOpenAlphabetGuide={() => setIsAlphabetGuideOpen(true)}
          />
        );
      case 'prompter':
        return (
          <StoryReaderView
            user={user}
            onEarnXp={(xp) => {
              const updated = storageService.addXp(xp);
              setUser({ ...updated });
            }}
            onNavigatePrompter={() => setStudentTab('prompter_flow' as any)}
          />
        );
      case 'prompter_flow' as any:
        return (
          <PrompterReadingView />
        );
      case 'sohbet':
        return (
          <SohbetView
            user={user}
          />
        );
      case 'leaderboard':
        return (
          <LeaderboardView
            user={user}
          />
        );
      case 'dictionary':
        return (
          <DictionaryView
            vocabulary={allVocabulary}
            user={user}
            onToggleMastery={handleToggleMastery}
            onToggleFavorite={handleToggleFavorite}
            onReportError={(w) => setReportWord(w)}
          />
        );
      case 'review':
        return (
          <SpacedRepetitionView
            user={user}
            vocabulary={allVocabulary}
            onToggleMastery={handleToggleMastery}
            onBackToHome={() => setStudentTab('home')}
          />
        );
      case 'profile':
        return (
          <ProfileSettingsView
            user={user}
            onUpdateUser={(updated) => setUser({ ...updated })}
            onDirectionChange={handleDirectionChange}
            onOpenAdmin={() => setViewMode('admin')}
            onOpenAuth={(tab) => handleOpenAuth(tab)}
            onLogout={handleLogout}
            onNavigateTab={(tab) => setStudentTab(tab)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans">
      
      {/* Top Universal Navbar */}
      <Navbar
        user={user}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onDirectionChange={handleDirectionChange}
        onOpenAuth={(tab) => handleOpenAuth(tab)}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      {viewMode === 'admin' && user.isSuperAdmin ? (
        /* SUPER ADMIN EXECUTIVE DASHBOARD - EXCLUSIVE TO VERIFIED SUPER ADMIN */
        <AdminDashboard
          user={user}
          units={units}
          onUnitsChange={(newUnits) => setUnits(newUnits)}
          onExitAdmin={() => setViewMode('web')}
        />
      ) : viewMode === 'mobile' ? (
        /* REALISTIC SMARTPHONE PREVIEW (MATCHING USER'S MOCKUP) */
        <div className="flex-1 flex flex-col justify-center">
          <MobileFrame>
            <OfflineIndicator />
            <div className="flex-1 flex flex-col">
              {renderStudentContent()}
            </div>
            {!activeLessonPair && (
              <BottomNavBar
                currentTab={studentTab}
                direction={user.currentDirection}
                onTabChange={(t) => setStudentTab(t)}
              />
            )}
          </MobileFrame>
        </div>
      ) : (
        /* WIDE RESPONSIVE WEB APP VIEW */
        <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex-1 flex flex-col">
            <OfflineIndicator />
            {renderStudentContent()}
            {!activeLessonPair && (
              <BottomNavBar
                currentTab={studentTab}
                direction={user.currentDirection}
                onTabChange={(t) => setStudentTab(t)}
              />
            )}
          </div>
        </div>
      )}

      {/* Auth Modal (Giriş Yap / E-posta ile Kayıt Ol) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        isMandatory={false}
        initialTab={authModalTab}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onOpenPlacementModal={handleTriggerPlacementFromAuth}
      />

      {/* Academic Kazakh Phonetic & 42-Letter Audio Atlas Modal */}
      <KazakhAlphabetVoiceGuide
        isOpen={isAlphabetGuideOpen}
        onClose={() => setIsAlphabetGuideOpen(false)}
      />

      {/* Duolingo Style Fast Word Matching Game Modal */}
      <WordMatchingGameModal
        isOpen={isMatchGameOpen}
        onClose={() => setIsMatchGameOpen(false)}
        vocabulary={allVocabulary}
      />

      {/* 10-Question CEFR Placement Test Modal */}
      <PlacementTestModal
        isOpen={isPlacementTestOpen}
        onClose={() => setIsPlacementTestOpen(false)}
        onSetLevel={handlePlacementResult}
      />

      {/* Report Translation Error Modal */}
      <ReportErrorModal
        isOpen={Boolean(reportWord)}
        word={reportWord}
        onClose={() => setReportWord(null)}
        onSubmit={handleSubmitErrorTicket}
      />

      {/* Daily Study Reminder In-App Floating Alert */}
      {activeReminderAlert && (
        <div className="fixed top-4 left-4 right-4 max-w-md mx-auto bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-4 rounded-3xl shadow-2xl border-2 border-amber-300 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-white animate-bounce" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-100">
                  {activeReminderAlert.title}
                </h4>
                <p className="text-xs font-bold text-white mt-0.5 leading-snug">
                  {activeReminderAlert.message}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveReminderAlert(null)}
              className="text-white/80 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-end gap-2 pt-2 border-t border-white/20">
            <button
              onClick={() => setActiveReminderAlert(null)}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition cursor-pointer"
            >
              Sonra
            </button>
            <button
              onClick={() => {
                setActiveReminderAlert(null);
                setActiveLessonPair(null);
                setStudentTab('lessons');
              }}
              className="px-4 py-1.5 rounded-xl bg-white text-amber-900 hover:bg-amber-50 text-xs font-black shadow-md transition cursor-pointer"
            >
              Şimdi Derse Başla →
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
