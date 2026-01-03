import React, { useState } from 'react';
import { StudentProject } from '../types';
import { 
  FileCode, 
  Copy, 
  Check, 
  Terminal, 
  ArrowLeft,
  FolderTree,
  Play,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Monitor,
  Server,
  Network
} from 'lucide-react';

interface PlanDisplayProps {
  project: StudentProject;
  onReset: () => void;
}

export const PlanDisplay: React.FC<PlanDisplayProps> = ({ project, onReset }) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'guide'>('code');

  const activeFile = project.files[activeFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] bg-[#0f172a] rounded-xl border border-slate-800 shadow-2xl overflow-hidden animate-fade-in text-slate-300 font-sans">
      
      {/* Header */}
      <div className="bg-[#1e293b] border-b border-slate-800 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onReset}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
            title="New Project"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              {project.projectTitle}
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
                <Server size={10} /> Full-Stack
              </span>
            </h1>
            <p className="text-xs text-slate-400">Stack: HTML/JS + Python Flask</p>
          </div>
        </div>
        
        <div className="flex bg-slate-800/50 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'code' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode size={16} /> Code
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'guide' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen size={16} /> Guide & Viva
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar (Always visible on desktop) */}
        <div className="w-72 bg-[#0f172a] border-r border-slate-800 flex flex-col shrink-0 hidden md:flex">
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FolderTree size={14} /> Project Structure
            </h3>
            <pre className="text-[10px] leading-tight font-mono text-indigo-400/80 overflow-x-auto whitespace-pre font-bold">
              {project.folderStructure}
            </pre>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2 mt-2">Files</h3>
            <div className="space-y-1">
              {project.files.map((file, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveFileIndex(idx);
                    setActiveTab('code');
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2 transition-all font-mono ${
                    activeFileIndex === idx && activeTab === 'code'
                      ? 'bg-indigo-900/30 text-indigo-400 border border-indigo-500/30' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <FileCode size={14} className="shrink-0" />
                  <span className="truncate" title={file.fileName}>{file.fileName}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
          
          {activeTab === 'code' ? (
            <div className="flex flex-col h-full">
              {/* Code Toolbar */}
              <div className="h-12 bg-[#1e293b] border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
                <span className="text-sm font-mono text-indigo-400 font-medium">{activeFile?.fileName}</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-xs transition-colors"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy Content"}
                </button>
              </div>
              {/* Code Editor */}
              <div className="flex-1 overflow-auto bg-[#0b1120]">
                <pre className="p-6 text-sm font-mono leading-relaxed text-slate-300 tab-4">
                  <code>{activeFile?.code}</code>
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-[#0f172a]">
              
              {/* How to Run */}
              <section className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Play size={20} className="text-emerald-400" /> 
                  How to Run
                </h2>
                <div className="space-y-3">
                  {project.howToRun.map((step, i) => (
                    <div key={i} className="flex gap-3 items-start text-slate-300">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold mt-0.5">
                        {i + 1}
                      </span>
                      <p className="leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* API Flow */}
              <section className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 shadow-sm">
                 <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Network size={20} className="text-indigo-400" /> 
                  API Architecture
                </h2>
                <div className="bg-[#0f172a] p-4 rounded-lg border border-slate-800 text-slate-300 text-sm font-mono leading-relaxed whitespace-pre-wrap">
                  {project.apiFlowExplanation}
                </div>
              </section>

              {/* Logic Explanation */}
              <section className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Monitor size={20} className="text-blue-400" /> 
                  Project Logic
                </h2>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                  {project.conceptExplanation}
                </p>
              </section>

              {/* Viva Questions */}
              <section className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <HelpCircle size={20} className="text-amber-400" /> 
                  Viva Questions
                </h2>
                <div className="grid gap-4">
                  {project.vivaQuestions.map((q, i) => (
                    <div key={i} className="bg-[#0f172a] p-4 rounded-lg border border-slate-800">
                      <p className="font-semibold text-amber-100 mb-2">Q: {q.question}</p>
                      <p className="text-slate-400 text-sm pl-4 border-l-2 border-amber-500/30">
                        {q.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Enhancements */}
              <section className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Lightbulb size={20} className="text-purple-400" /> 
                  Future Enhancements
                </h2>
                <ul className="space-y-2">
                  {project.futureEnhancements.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300">
                      <Check size={16} className="text-purple-400 mt-1 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};