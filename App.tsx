import React, { useState } from 'react';
import { PlanDisplay } from './components/PlanDisplay';
import { generateProject } from './services/geminiService';
import { StudentProject } from './types';
import { Sparkles, Loader2, Server, AlertCircle, Terminal, Database } from 'lucide-react';

const App: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [project, setProject] = useState<StudentProject | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const generatedProject = await generateProject(idea);
      setProject(generatedProject);
    } catch (err: any) {
      console.error("Application Error:", err);
      setError(err.message || "Something went wrong while generating the project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    "Build a Calculator",
    "To-Do List App",
    "Weather Dashboard",
    "Currency Converter"
  ];

  if (project) {
    return (
      <div className="min-h-screen bg-[#020617] p-2 md:p-4 text-slate-200 flex items-center justify-center">
        <PlanDisplay project={project} onReset={() => setProject(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#020617] text-slate-200 font-sans">
      
      <div className="w-full max-w-3xl mx-auto text-center space-y-8 animate-fade-in-up">
        
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 rounded-2xl shadow-inner border border-indigo-500/20 mb-4">
            <Server size={48} className="text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
            Full-Stack Project <span className="text-indigo-400">Builder</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Convert any idea into a mandatory <strong>Python Flask + HTML/JS</strong> application.
            Perfect for academic requirements.
          </p>
        </div>

        <div className="bg-[#0f172a] p-3 rounded-2xl shadow-2xl border border-slate-800 transition-all focus-within:ring-2 focus-within:ring-indigo-500/50">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. 'Build a calculator' (Will include Python Backend)"
              className="w-full h-32 p-4 text-lg bg-transparent border-none focus:ring-0 resize-none placeholder:text-slate-600 text-slate-200 font-medium font-mono"
              disabled={loading}
            />
            <div className="flex justify-between items-center px-4 pb-2 border-t border-slate-800 pt-3">
               <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                 <Database size={12} />
                 Includes Python Backend API
               </span>
               <button
                type="submit"
                disabled={!idea.trim() || loading}
                className={`
                  flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white transition-all
                  ${!idea.trim() || loading 
                    ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-95'}
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Architecting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>Build Full-Stack</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Error Display Component */}
        {error && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mx-auto max-w-2xl bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 text-left">
              <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="text-red-400 font-semibold text-sm">Generation Failed</h3>
                <p className="text-red-300/80 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-8">
           <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">Try these academic ideas</p>
           <div className="flex flex-wrap justify-center gap-3">
             {examples.map((ex, i) => (
               <button
                 key={i}
                 onClick={() => setIdea(ex)}
                 className="px-4 py-2 bg-[#1e293b] border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800 text-slate-300 text-sm rounded-lg transition-all font-medium"
               >
                 {ex}
               </button>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default App;