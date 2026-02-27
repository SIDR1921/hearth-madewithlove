import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { getCoachingScript, getLearningPath } from '../../utils/api';
import { Scroll, Sparkles, Loader2, RefreshCw, Play, GraduationCap, ExternalLink } from 'lucide-react';

const presets = [
    { id: 1, title: 'Overwork Pattern', situation: 'Employee has averaged 52+ hours for 3 consecutive weeks. A recent deadline was missed after sprint overload.', employee: 'Priya' },
    { id: 2, title: 'Silent Disengagement', situation: 'Previously vocal contributor has gone quiet in meetings for 2 weeks. No PTO, no complaints.', employee: 'Raj' },
    { id: 3, title: 'Team Friction', situation: 'Two engineers on the same squad have stopped collaborating. PRs are being reviewed by outsiders.', employee: 'Priya & Alex' },
];

export function ForgivenessWeaver() {
    const language = useAppStore(s => s.language);
    const [tab, setTab] = useState('scripts');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [custom, setCustom] = useState({ situation: '', employee: '' });
    const [lastReq, setLastReq] = useState(null);
    const [learningResult, setLearningResult] = useState(null);
    const [learningLoading, setLearningLoading] = useState(false);
    const [learningForm, setLearningForm] = useState({ name: '', role: '', gaps: '', context: '' });

    const generate = async (situation, employee) => {
        setLoading(true); setError(null); setResult(null);
        setLastReq({ situation, employee });
        try {
            const lang = language === 'हिं' ? 'हिं' : language === 'ಕನ್ನ' ? 'ಕನ್ನ' : 'EN';
            const res = await getCoachingScript(situation, employee, lang);
            setResult(res);
        } catch { setError('Could not generate the script.'); }
        finally { setLoading(false); }
    };

    const generateLearning = async () => {
        setLearningLoading(true); setLearningResult(null);
        try {
            const gaps = learningForm.gaps.split(',').map(s => s.trim()).filter(Boolean);
            const res = await getLearningPath(learningForm.name, learningForm.role, gaps, learningForm.context);
            setLearningResult(res);
        } catch { setLearningResult({ error: true }); }
        finally { setLearningLoading(false); }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8 animate-enter">
                <span className="label flex items-center gap-2"><Scroll size={11} /> Coaching & Growth</span>
                <h1 className="font-serif text-3xl text-cream mt-2">Scripts & Learning Paths</h1>
                <p className="text-stone text-sm mt-1">AI-generated scripts for difficult conversations + personalized YouTube learning.</p>
            </div>

            <div className="flex gap-1 p-1 card w-fit mb-8 animate-enter delay-1">
                <button onClick={() => setTab('scripts')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all ${tab === 'scripts' ? 'bg-flame/10 text-flame' : 'text-stone hover:text-sand'}`}>
                    <Scroll size={13} /> Coaching Scripts
                </button>
                <button onClick={() => setTab('learning')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all ${tab === 'learning' ? 'bg-dusk/10 text-dusk' : 'text-stone hover:text-sand'}`}>
                    <GraduationCap size={13} /> YouTube Learning
                    <span className="badge bg-dusk/15 text-dusk ml-1">New</span>
                </button>
            </div>

            {/* ── COACHING SCRIPTS ── */}
            {tab === 'scripts' && (
                <div className="grid lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-2 space-y-3">
                        <span className="label">Quick Contexts</span>
                        {presets.map(p => (
                            <button key={p.id} onClick={() => generate(p.situation, p.employee)} className="w-full text-left card p-4 hover:border-flame/15 transition-all">
                                <h4 className="text-cream text-sm font-medium mb-0.5">{p.title}</h4>
                                <span className="text-stone text-[10px] font-mono">Employee: {p.employee}</span>
                            </button>
                        ))}
                        <div className="pt-4 border-t border-white/[0.04]">
                            <span className="label mb-2">Custom Context</span>
                            <input value={custom.employee} onChange={e => setCustom({ ...custom, employee: e.target.value })} placeholder="Employee name..." className="input-field mb-2" />
                            <textarea value={custom.situation} onChange={e => setCustom({ ...custom, situation: e.target.value })} placeholder="Describe the situation..." rows={3} className="input-field resize-none" />
                            <button onClick={() => generate(custom.situation, custom.employee)} disabled={!custom.situation || !custom.employee || loading} className="btn-primary w-full mt-3 justify-center">Generate Script</button>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="card min-h-[450px] p-7 relative">
                            {loading && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"><Loader2 size={20} className="text-flame animate-spin" /><p className="text-stone text-sm font-serif italic">Crafting your script...</p></div>}
                            {error && <div className="flex items-center justify-center h-full text-rose">{error}</div>}
                            {!loading && !error && !result && <div className="flex flex-col items-center justify-center h-full gap-2"><Sparkles size={24} className="text-stone/30" /><p className="text-stone font-mono text-sm">Select a context</p></div>}
                            {!loading && result && (
                                <div className="animate-enter space-y-5">
                                    <div className="card-warm p-4">
                                        <span className="label text-flame mb-1">{result.title}</span>
                                        <p className="text-sand text-sm">{result.context_summary}</p>
                                    </div>
                                    <span className="label">Suggested Opening</span>
                                    {result.script?.map((line, i) => <p key={i} className="font-serif text-lg text-cream/90 italic leading-relaxed animate-enter" style={{ animationDelay: `${i * 200}ms` }}>"{line}"</p>)}
                                    {result.tone_guidance && (
                                        <div className="card-warm p-4 mt-3">
                                            <span className="label text-dusk mb-1">Tone Guidance</span>
                                            <p className="text-sand text-sm font-serif italic">{result.tone_guidance}</p>
                                        </div>
                                    )}
                                    <div className="flex gap-3 mt-4">
                                        <button className="btn-primary">Practice this script</button>
                                        <button onClick={() => generate(lastReq.situation, lastReq.employee)} className="btn-ghost"><RefreshCw size={13} /> Regenerate</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── YOUTUBE LEARNING ── */}
            {tab === 'learning' && (
                <div className="grid lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-2">
                        <div className="card p-5 space-y-3">
                            <span className="label">Employee Details</span>
                            <div>
                                <span className="label">Name</span>
                                <input value={learningForm.name} onChange={e => setLearningForm({ ...learningForm, name: e.target.value })} placeholder="e.g., Priya Sharma" className="input-field" />
                            </div>
                            <div>
                                <span className="label">Role</span>
                                <input value={learningForm.role} onChange={e => setLearningForm({ ...learningForm, role: e.target.value })} placeholder="e.g., Frontend Engineer" className="input-field" />
                            </div>
                            <div>
                                <span className="label">Skill Gaps</span>
                                <input value={learningForm.gaps} onChange={e => setLearningForm({ ...learningForm, gaps: e.target.value })} placeholder="public speaking, system design..." className="input-field" />
                                <span className="text-stone text-[10px] mt-1 block">Comma-separated</span>
                            </div>
                            <div>
                                <span className="label">Coaching Context</span>
                                <textarea value={learningForm.context} onChange={e => setLearningForm({ ...learningForm, context: e.target.value })} placeholder="Growth goals or challenges..." rows={3} className="input-field resize-none" />
                            </div>
                            <button onClick={generateLearning} disabled={!learningForm.name || !learningForm.role || learningLoading} className="btn-primary w-full justify-center">
                                {learningLoading ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
                                {learningLoading ? 'Generating...' : 'Generate Learning Path'}
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="card min-h-[450px] p-7 relative">
                            {learningLoading && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"><Loader2 size={20} className="text-dusk animate-spin" /><p className="text-stone text-sm font-serif italic">Curating learning path...</p></div>}
                            {!learningLoading && !learningResult && <div className="flex flex-col items-center justify-center h-full gap-2"><GraduationCap size={24} className="text-stone/30" /><p className="text-stone font-mono text-sm">Enter details to generate</p></div>}
                            {!learningLoading && learningResult && !learningResult.error && (
                                <div className="animate-enter space-y-5">
                                    <div className="bg-dusk/5 border border-dusk/15 rounded-lg p-4">
                                        <span className="label text-dusk mb-1">Learning Theme</span>
                                        <h3 className="font-serif text-xl text-cream italic">{learningResult.learning_theme}</h3>
                                    </div>
                                    <span className="label">📺 Recommended Videos</span>
                                    {learningResult.videos?.map((v, i) => (
                                        <a key={i} href={`https://youtube.com/results?search_query=${encodeURIComponent(v.search_query || v.title)}`} target="_blank" rel="noreferrer" className="block p-4 rounded-lg card group hover:border-dusk/15 transition-all">
                                            <div className="flex items-start gap-3">
                                                <Play size={14} className="text-rose shrink-0 mt-0.5" />
                                                <div className="flex-1">
                                                    <span className="text-cream text-sm group-hover:text-flame transition-colors flex items-center gap-1">{v.title} <ExternalLink size={10} className="text-stone opacity-0 group-hover:opacity-100" /></span>
                                                    <p className="text-stone text-xs mt-1">{v.why}</p>
                                                    <div className="flex gap-3 mt-2">
                                                        {v.duration_est && <span className="text-[10px] font-mono text-stone">⏱ {v.duration_est}</span>}
                                                        {v.difficulty && <span className={`badge ${v.difficulty === 'Beginner' ? 'bg-sage/10 text-sage' : v.difficulty === 'Intermediate' ? 'bg-gold/10 text-gold' : 'bg-rose/10 text-rose'}`}>{v.difficulty}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                    {learningResult.weekly_plan && (
                                        <div className="card-warm p-5 mt-3">
                                            <span className="label text-sage mb-2">📅 4-Week Plan</span>
                                            <p className="text-sand text-sm whitespace-pre-line">{learningResult.weekly_plan}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
