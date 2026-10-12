/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Navbar } from './components/layout/Navbar';
import { MobileFrame } from './components/mobile/MobileFrame';
import { StudentHome } from './components/student/StudentHome';
import { LessonsListView } from './components/student/LessonsListView';
import { LessonView } from './components/student/LessonView';
import { GrammarHubView } from './components/student/GrammarHubView';
import { PrompterReadingView } from './components/student/PrompterReadingView';
import { SohbetView } from './components/student/SohbetView';
import { DictionaryView } from './components/student/DictionaryView';
import { SpacedRepetitionView } from './components/student/SpacedRepetitionView';
import { ProfileSettingsView } from './components/student/ProfileSettingsView';
import { ForumCommunityView } from './components/student/ForumCommunityView';
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

export default function App() {
  // Application Data States
  const [user, setUser] = useState<UserProfile>(() => storageService.getCurrentUser());
  const [units, setUnits] = useState<Unit[]>(() => storageService.getUnits());

  // Enforcement: Misafir kullanımı kapalıdır, üyelik zorunludur (Requirement 1)
  const isGuestUser = Boolean(!user || user.isGuest);

  // View States: Mobile Simulator, Wide Web View, or Executive Super Admin Panel
  const [viewMode, setViewMode] = useState<'mobile' | 'web' | 'admin'>('mobile');
  const [studentTab, setStudentTab] = useState<MainStudentTab>('home');
  const [activeLessonPair, setActiveLessonPair] = useState<{ unit: Unit; lesson: Lesson } | null>(null);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'admin'>('login');
  const [isAlphabetGuideOpen, setIsAlphabetGuideOpen] = useState(false);
  const [isMatchGameOpen, setIsMatchGameOpen] = useState(false);
  const [isPlacementTestOpen, setIsPlacementTestOpen] = useState(false);
  const [placementCallback, setPlacementCallback] = useState<((lvl: CefrLevel) => void) | null>(null);
  const [reportWord, setReportWord] = useState<VocabItem | null>(null);

  const handleOpenAuth = (tab: 'login' | 'register' | 'admin' = 'login') => {
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
          <PrompterReadingView />
        );
      case 'forum':
        return (
          <ForumCommunityView
            user={user}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onNavigateTab={(tab) => setStudentTab(tab)}
          />
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
          onExitAdmin={() => setViewMode('mobile')}
        />
      ) : viewMode === 'mobile' ? (
        /* REALISTIC SMARTPHONE PREVIEW (MATCHING USER'S MOCKUP) */
        <div className="flex-1 flex flex-col justify-center">
          <MobileFrame>
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

      {/* Auth Modal (Giriş Yap / E-posta ile Kayıt Ol / Yönetici Girişi) */}
      <AuthModal
        isOpen={isAuthModalOpen || isGuestUser}
        isMandatory={isGuestUser}
        initialTab={authModalTab}
        onClose={() => {
          if (!isGuestUser) {
            setIsAuthModalOpen(false);
          }
        }}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onAdminLogin={handleAdminLogin}
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

    </div>
  );
}
