import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, FileText, Search, Sparkles, BookOpen, Quote, 
  HelpCircle, Settings, ClipboardList, PenTool, CheckSquare, 
  Compass, ArrowRight, Database, Send, AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const aiTools = [
  { id: 'lit-review', label: 'AI Literature Review', desc: 'Scan and synthesize 200M+ research papers for literature review.', icon: Search, color: 'text-blue-500' },
  { id: 'assistant', label: 'AI Research Assistant', desc: 'Draft outlines, refine methodologies, and structure research.', icon: Sparkles, color: 'text-amber-500' },
  { id: 'summary', label: 'AI Paper Summary', desc: 'Extract key insights, claims, and limitations instantly.', icon: BookOpen, color: 'text-indigo-500' },
  { id: 'citation', label: 'AI Citation Generator', desc: 'Generate correct formatted citations in APA, MLA, Harvard, BibTeX.', icon: Quote, color: 'text-emerald-500' },
  { id: 'gap-finder', label: 'AI Research Gap Finder', desc: 'Analyze existing corpus to pinpoint unexplored avenues.', icon: Brain, color: 'text-purple-500' },
  { id: 'methodology', label: 'AI Methodology Generator', desc: 'Synthesize optimal experiment setups and validation metrics.', icon: ClipboardList, color: 'text-rose-500' },
  { id: 'reviewer', label: 'AI Paper Reviewer', desc: 'Simulate peer reviewer critiques and detect structural errors.', icon: CheckSquare, color: 'text-cyan-500' },
  { id: 'proposal', label: 'AI Proposal Generator', desc: 'Structure research proposal narratives for NIH, NSF, Horizon.', icon: PenTool, color: 'text-orange-500' },
  { id: 'thesis', label: 'AI Thesis Assistant', desc: 'Co-pilot drafting chapters, literature gaps, and introductions.', icon: FileText, color: 'text-teal-500' },
  { id: 'pdf-chat', label: 'AI PDF Chat', desc: 'Upload research PDFs and converse directly with the paper.', icon: FileText, color: 'text-pink-500' },
  { id: 'dataset-finder', label: 'AI Dataset Finder', desc: 'Discover public repositories and open datasets.', icon: Database, color: 'text-violet-500' },
  { id: 'journal', label: 'AI Journal Recommendation', desc: 'Match your manuscript abstract to optimal high-impact journals.', icon: Compass, color: 'text-lime-500' },
  { id: 'conference', label: 'AI Conference Recommendation', desc: 'Find relevant IEEE, ACM, or Nature-approved call for papers.', icon: Compass, color: 'text-fuchsia-500' },
];

const AiWorkspacePage = () => {
  const [activeToolId, setActiveToolId] = useState('lit-review');
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Academic Research Co-pilot. Select any workspace tool on the left to begin compiling insights, drafting sections, or generating citations.' }
  ]);
  const [loading, setLoading] = useState(false);

  const activeTool = aiTools.find(t => t.id === activeToolId);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMsg = { role: 'user', content: userInput };
    setMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setLoading(true);

    setTimeout(() => {
      let botResponse = '';
      switch (activeToolId) {
        case 'lit-review':
          botResponse = `### Synthesis Report: "${userInput}"\n\nBased on your query, we scanned and synthesized research papers:\n\n1. **Dynamic Attention Networks**: Recent works (2025) suggest incorporating multi-modal transformer attention to speed up extraction matrices.\n2. **Performance Constraints**: Bottlenecks remain in resource-constrained environments (e.g. edge devices).\n\n*Would you like me to compile the bibliography or draft the methodology?*`;
          break;
        case 'gap-finder':
          botResponse = `### Research Gaps Identified:\n\nFor the domain "${userInput}", we found the following unexplored areas:\n\n- **Cross-modal alignment latency**: No current study compares low-overhead transformer structures directly on mobile neural engines.\n- **Longitudinal validation**: Lack of clinical assessments over a 12-month window.`;
          break;
        case 'citation':
          botResponse = `### Citations Generated:\n\n- **APA**: Chen, D., & Miller, R. (2026). *Attention Multi-Modal Search in Informatics*. Journal of Research Connect, 14(2), 112-120.\n- **BibTeX**:\n\`\`\`bibtex\n@article{chen2026attention,\n  author = {Chen, David and Miller, Robert},\n  title = {Attention Multi-Modal Search in Informatics},\n  journal = {Journal of Research Connect},\n  year = {2026}\n}\n\`\`\``;
          break;
        default:
          botResponse = `I have received your request for **${activeTool.label}** regarding:\n\n"${userInput}"\n\nI am compiling relevant academic repositories and drafting the synthesis report. This will be automatically synced with your profile.`;
      }
      setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
      setLoading(false);
    }, 1500);
  };

  const handleToolChange = (toolId) => {
    setActiveToolId(toolId);
    const selected = aiTools.find(t => t.id === toolId);
    setMessages([
      { role: 'assistant', content: `Switched to **${selected.label}**. ${selected.desc} How can I assist you in this workspace?` }
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-80px)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-stretch">
        
        {/* LEFT SIDE PANEL - TOOLS MENU (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col overflow-hidden h-full">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-3 text-left">
            <h2 className="font-black text-slate-900 dark:text-white text-base tracking-tight flex items-center gap-1.5">
              <Brain className="w-5 h-5 text-indigo-650 animate-pulse" /> AI Workspace
            </h2>
            <p className="text-[11px] text-slate-450 mt-0.5">Premium LLM tools for researchers & authors.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 text-left scrollbar-thin">
            {aiTools.map(tool => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => handleToolChange(tool.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all border ${
                    activeToolId === tool.id 
                      ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/50' 
                      : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-850 ${tool.color}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </span>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">{tool.label}</h4>
                    <p className="text-[10px] text-slate-450 line-clamp-1 mt-0.5">{tool.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT CHAT INTERFACE PANEL (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col overflow-hidden h-full">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between text-left">
            <div className="flex items-center gap-3">
              <span className={`p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 ${activeTool?.color}`}>
                {activeTool && React.createElement(activeTool.icon, { className: "w-5 h-5" })}
              </span>
              <div>
                <h3 className="font-extrabold text-sm text-slate-950 dark:text-white">{activeTool?.label}</h3>
                <p className="text-[10px] text-slate-450">{activeTool?.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-full text-[10px] font-bold">
              <Sparkles className="w-3 h-3 animate-spin" /> GPT-4o Enhanced
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 text-left">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-50 dark:bg-slate-850 text-slate-850 dark:text-slate-200 border border-slate-100 dark:border-slate-800/80 whitespace-pre-line'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-50 dark:bg-slate-850 text-slate-450 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 text-xs flex items-center gap-2 font-bold">
                  <Brain className="w-4 h-4 text-indigo-650 animate-bounce" /> Co-pilot is analyzing corpus...
                </div>
              </div>
            )}
          </div>

          {/* User Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/50 flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              placeholder={`Enter prompt or topic for ${activeTool?.label}...`}
              className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white"
            />
            <button
              type="submit"
              disabled={loading || !userInput.trim()}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-sm flex items-center justify-center"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};

export default AiWorkspacePage;
