import React from 'react';
import { Unit, Lesson, UserProfile, CefrLevel } from '../../types';
import { CheckCircle2, ChevronRight, Lock, BookOpen } from 'lucide-react';

interface LessonsListViewProps {
  units: Unit[];
  user: UserProfile;
  onSelectLesson: (unit: Unit, lesson: Lesson) => void;
  onSelectLevel: (level: CefrLevel) => void;
}

export const LessonsListView: React.FC<LessonsListViewProps> = ({
  units,
  user,
  onSelectLesson,
  onSelectLevel
}) => {
  const isTr = user.currentDirection === 'TR_TO_KZ';
  const activeUnits = units.filter(
    u => u.level === user.currentLevel && u.direction === user.currentDirection
  );

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-12">
      
      {/* Header and Level Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <span>MÜFREDAT DERSLERİ</span>
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">
            CEFR {user.currentLevel} Seviyesi Eğitim Modülleri
          </p>
        </div>

        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold">
          {(['A1', 'A2', 'B1', 'B2', 'C1'] as CefrLevel[]).map(lvl => (
            <button
              key={lvl}
              onClick={() => onSelectLevel(lvl)}
              className={`px-2.5 py-1 rounded-lg transition ${
                user.currentLevel === lvl ? 'bg-teal-600 text-white shadow-2xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Units & Lessons */}
      <div className="space-y-4">
        {activeUnits.map(unit => (
          <div key={unit.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 bg-gradient-to-r from-teal-50 to-white border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-teal-800 tracking-wider">
                  {unit.level} • Ünite {unit.unitNumber}
                </span>
                <h3 className="text-xs font-black text-slate-900 mt-0.5">
                  {isTr ? unit.titleTr : unit.titleKz}
                </h3>
              </div>
              <span className="text-[11px] font-bold text-teal-700 bg-teal-100/70 px-2.5 py-0.5 rounded-full">
                {unit.lessons.length} Ders
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {unit.lessons.map(lesson => {
                const isCompleted = user.completedLessonIds.includes(lesson.id);
                return (
                  <div
                    key={lesson.id}
                    onClick={() => onSelectLesson(unit, lesson)}
                    className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition active:bg-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 ${
                        isCompleted ? 'bg-emerald-500 text-white shadow-xs' : 'bg-teal-100 text-teal-800'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : lesson.lessonNumber}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {isTr ? lesson.titleTr : lesson.titleKz}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {isTr ? lesson.summaryTr : lesson.summaryKz}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
