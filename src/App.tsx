import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StudentsDashboard } from './components/StudentsDashboard';
import { StudentDetailModal } from './components/StudentDetailModal';
import { EarlyWarningFormModal } from './components/EarlyWarningFormModal';
import { DiagnosticActivitiesView } from './components/DiagnosticActivitiesView';
import { InterventionsGuideView } from './components/InterventionsGuideView';
import { CrisisProtocolModal } from './components/CrisisProtocolModal';
import { Student } from './types';
import { INITIAL_STUDENTS } from './data/mockData';
import { 
  HeartHandshake, 
  ShieldAlert, 
  CheckCircle2, 
  Info, 
  LifeBuoy, 
  Sparkles,
  PhoneCall
} from 'lucide-react';

const STORAGE_KEY = 'acolher_aprender_students_v1';

export default function App() {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_STUDENTS;
      }
    }
    return INITIAL_STUDENTS;
  });

  const [currentTab, setCurrentTab] = useState<'dashboard' | 'form' | 'activities' | 'interventions' | 'crisis'>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }
  }, [students]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenNewStudent = () => {
    setStudentToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setStudentToEdit(student);
    setIsFormModalOpen(true);
  };

  const handleGenerateAIReport = async (student: Student) => {
    try {
      const response = await fetch('/api/psychopedagogy/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student,
          assessment: student.earlyWarning,
        }),
      });

      const data = await response.json();
      if (data?.report) {
        const updatedStudent: Student = {
          ...student,
          calculatedRisk: data.report.riskLevel || student.calculatedRisk,
          lastReport: {
            ...data.report,
            generatedAt: new Date().toLocaleString('pt-BR'),
          },
        };

        setStudents(prev => prev.map(s => s.id === student.id ? updatedStudent : s));
        if (selectedStudent?.id === student.id) {
          setSelectedStudent(updatedStudent);
        }
        showToast(`Parecer psicopedagógico gerado com sucesso para ${student.name}!`);
      }
    } catch (error) {
      console.error('Falha ao gerar relatório:', error);
      showToast('Erro ao contatar o especialista de IA. Tente novamente.');
    }
  };

  const handleSaveStudent = async (studentData: Student, generateAI: boolean) => {
    let finalStudent = studentData;

    if (generateAI) {
      try {
        const response = await fetch('/api/psychopedagogy/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            student: studentData,
            assessment: studentData.earlyWarning,
          }),
        });

        const data = await response.json();
        if (data?.report) {
          finalStudent = {
            ...studentData,
            calculatedRisk: data.report.riskLevel || studentData.calculatedRisk,
            lastReport: {
              ...data.report,
              generatedAt: new Date().toLocaleString('pt-BR'),
            },
          };
        }
      } catch (err) {
        console.error('Erro na análise inicial de IA:', err);
      }
    }

    setStudents(prev => {
      const exists = prev.some(s => s.id === finalStudent.id);
      if (exists) {
        return prev.map(s => s.id === finalStudent.id ? finalStudent : s);
      }
      return [finalStudent, ...prev];
    });

    setSelectedStudent(finalStudent);
    showToast(
      generateAI 
        ? `Estudante ${finalStudent.name} salvo com Parecer Psicopedagógico gerado!` 
        : `Estudante ${finalStudent.name} salvo com sucesso!`
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col selection:bg-amber-100 selection:text-amber-900">
      {/* Global Header */}
      <Header
        students={students}
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'crisis') {
            setIsCrisisModalOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        onOpenNewStudent={handleOpenNewStudent}
        onOpenCrisisModal={() => setIsCrisisModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentTab === 'dashboard' && (
          <StudentsDashboard
            students={students}
            onSelectStudent={(student) => setSelectedStudent(student)}
            onEditStudent={handleEditStudent}
            onNewStudent={handleOpenNewStudent}
            onOpenCrisisModal={() => setIsCrisisModalOpen(true)}
          />
        )}

        {currentTab === 'activities' && (
          <DiagnosticActivitiesView />
        )}

        {currentTab === 'interventions' && (
          <InterventionsGuideView />
        )}
      </main>

      {/* Floating Emergency Life-Line bar on bottom mobile */}
      <div className="sm:hidden sticky bottom-3 mx-4 z-20">
        <div className="bg-rose-600 text-white p-3 rounded-2xl shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-bold">SOS Aluno em Crise?</span>
          </div>
          <button
            onClick={() => setIsCrisisModalOpen(true)}
            className="px-3 py-1 bg-white text-rose-700 rounded-xl text-xs font-extrabold shadow-xs"
          >
            Abrir Protocolo 188
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-fade-in border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Student Detail & Parecer Modal */}
      <StudentDetailModal
        student={selectedStudent}
        isOpen={Boolean(selectedStudent)}
        onClose={() => setSelectedStudent(null)}
        onEdit={(student) => {
          setSelectedStudent(null);
          handleEditStudent(student);
        }}
        onGenerateAIReport={handleGenerateAIReport}
        onOpenCrisisModal={() => setIsCrisisModalOpen(true)}
      />

      {/* Early Warning & Triage Form Modal */}
      <EarlyWarningFormModal
        studentToEdit={studentToEdit}
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setStudentToEdit(null);
        }}
        onSaveStudent={handleSaveStudent}
      />

      {/* Crisis Protocol Modal */}
      <CrisisProtocolModal
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">
              Acolher & Aprender • Programa de Psicologia Educacional e Prevenção Escolar
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Em apoio à Lei 13.935/2019 (Psicologia e Serviço Social na Educação Básica)</span>
            <span>•</span>
            <span className="text-rose-600 font-bold">CVV: 188</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
