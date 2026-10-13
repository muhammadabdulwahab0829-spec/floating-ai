import React, { useState } from 'react';
import { X, Plus, Trash2, Brain, Sparkles } from 'lucide-react';
import { senseBrain, CustomKnowledgeItem } from '../services/senseBrain';

interface TeachBrainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export const TeachBrainModal: React.FC<TeachBrainModalProps> = ({ isOpen, onClose, onUpdated }) => {
  const [trigger, setTrigger] = useState('');
  const [answer, setAnswer] = useState('');
  const [facts, setFacts] = useState<CustomKnowledgeItem[]>(senseBrain.getCustomFacts());

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trigger.trim() || !answer.trim()) return;

    senseBrain.addCustomFact(trigger, answer);
    setFacts([...senseBrain.getCustomFacts()]);
    setTrigger('');
    setAnswer('');
    onUpdated();
  };

  const handleDelete = (id: string) => {
    senseBrain.deleteCustomFact(id);
    setFacts([...senseBrain.getCustomFacts()]);
    onUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-xs">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Teach Kitty's Mini-Brain</h3>
              <p className="text-xs text-slate-500">Add custom offline senses, answers, and memories</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200/80 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form to teach */}
        <div className="p-6 border-b border-slate-100 overflow-y-auto">
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                When I say / ask (Trigger phrase)
              </label>
              <input
                type="text"
                placeholder='e.g. "Who is the boss?", "Where is my keys?"'
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-500 focus:bg-white transition-all text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Kitty responds with
              </label>
              <textarea
                placeholder='e.g. "You are the boss of this house, Jay!"'
                rows={2}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-500 focus:bg-white transition-all text-slate-900 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={!trigger.trim() || !answer.trim()}
              className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Save into Mini-Brain</span>
            </button>
          </form>
        </div>

        {/* Stored Memories List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Learned Memories ({facts.length})
            </span>
            <span className="text-xs text-sky-600 flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3" />
              100% Offline Rule Brain
            </span>
          </div>

          {facts.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No custom memories taught yet. Type a phrase above to train Kitty's senses!
            </div>
          ) : (
            facts.map((fact) => (
              <div
                key={fact.id}
                className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-start justify-between gap-3 group"
              >
                <div className="flex-1 space-y-1">
                  <div className="text-xs font-semibold text-slate-800">
                    Q: &ldquo;{fact.trigger}&rdquo;
                  </div>
                  <div className="text-xs text-slate-600">
                    A: {fact.answer}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(fact.id)}
                  className="opacity-60 group-hover:opacity-100 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
