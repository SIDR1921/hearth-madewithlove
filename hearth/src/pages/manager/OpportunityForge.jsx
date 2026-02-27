import React, { useState } from 'react';
import { forgeMatch } from '../../utils/api';
import { Hammer, Sparkles, Loader2, Plus, X, UserCheck, TrendingUp } from 'lucide-react';

export function OpportunityForge() {
    const [name, setName] = useState('Siddharth Rao');
    const [skills, setSkills] = useState(['Python', 'Technical Writing', 'Database Design']);
    const [narrative, setNarrative] = useState('The Database Firefighter');
    const [orgGaps, setOrgGaps] = useState('');
    const [newSkill, setNewSkill] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addSkill = () => { if (newSkill.trim() && !skills.includes(newSkill.trim())) { setSkills([...skills, newSkill.trim()]); setNewSkill(''); } };

    const forge = async () => {
        setLoading(true); setError(null); setResult(null);
        try { const res = await forgeMatch(name, skills, narrative, orgGaps); setResult(res); }
        catch { setError('The forge needs more fuel. Try again.'); }
        finally { setLoading(false); }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8 animate-enter">
                <span className="label flex items-center gap-2"><Hammer size={11} /> Opportunity Forge</span>
                <h1 className="font-serif text-3xl text-cream mt-2">Synthesize Residency Paths</h1>
                <p className="text-stone text-sm mt-1">AI creates dignifying roles from human potential × organizational need.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div>
                        <span className="label">Name</span>
                        <input value={name} onChange={e => setName(e.target.value)} className="input-field" />
                    </div>
                    <div>
                        <span className="label">Narrative Identity</span>
                        <input value={narrative} onChange={e => setNarrative(e.target.value)} className="input-field font-serif italic" />
                    </div>
                    <div>
                        <span className="label">Skills</span>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {skills.map(s => (
                                <span key={s} className="flex items-center gap-1 text-xs px-3 py-1.5 card text-sand">
                                    {s} <X size={11} className="cursor-pointer hover:text-rose" onClick={() => setSkills(skills.filter(x => x !== s))} />
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} placeholder="Add skill..." className="flex-1 input-field" />
                            <button onClick={addSkill} className="px-3 card hover:bg-white/[0.04] transition-colors"><Plus size={14} className="text-stone" /></button>
                        </div>
                    </div>
                    <div>
                        <span className="label">Org Gaps (Optional)</span>
                        <textarea value={orgGaps} onChange={e => setOrgGaps(e.target.value)} placeholder="Known needs, project gaps..." rows={2} className="input-field resize-none" />
                    </div>
                    <button onClick={forge} disabled={loading || !name || skills.length === 0} className="btn-primary w-full justify-center">
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        {loading ? 'Forging...' : 'Forge Match'}
                    </button>
                </div>

                <div>
                    {error && <div className="text-rose text-center py-12">{error}</div>}
                    {!result && !error && !loading && (
                        <div className="border border-dashed border-white/[0.06] rounded-xl flex flex-col items-center justify-center py-20 gap-3">
                            <Hammer size={28} className="text-stone/20" />
                            <p className="text-stone font-mono text-sm">Awaiting Forge</p>
                        </div>
                    )}

                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <Loader2 size={24} className="text-flame animate-spin" />
                            <p className="text-stone text-sm font-serif italic">Allocating 2026 Reskilling Funds...</p>
                        </div>
                    )}

                    {result && (
                        <div className="card p-6 border-l-2 border-l-flame animate-enter">
                            <div className="flex justify-between items-start mb-1">
                                <span className="label text-flame mb-0">AI-Synthesized Role</span>
                                <span className="text-[10px] font-mono text-sage border border-sage/20 bg-sage/5 px-2 py-0.5 rounded">2026 RESKILLING FUND MATCH</span>
                            </div>

                            <h3 className="font-serif text-2xl text-cream mb-5">{result.title}</h3>
                            <div className="space-y-3">
                                <div className="card-warm p-4 flex items-start gap-3">
                                    <UserCheck size={14} className="text-sage shrink-0 mt-0.5" />
                                    <div>
                                        <span className="label mb-0">Matched To</span>
                                        <p className="text-sand text-sm">{result.matched_to}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="card-warm p-3">
                                        <span className="label mb-0">Duration</span>
                                        <span className="text-sand text-sm">{result.duration}</span>
                                    </div>
                                    <div className="card-warm p-3">
                                        <span className="label mb-0">ESG Alignment</span>
                                        <span className="text-sand text-sm">UN SDG {result.un_sdg_alignment || '8'}</span>
                                    </div>
                                </div>
                                <div className="card-warm p-4">
                                    <span className="label mb-0">Basis (Why this match?)</span>
                                    <p className="text-sand text-sm">{result.basis}</p>
                                </div>
                                <div className="bg-sage/5 border border-sage/15 rounded-lg p-4">
                                    <span className="label text-sage mb-0 flex items-center gap-1"><TrendingUp size={10} /> Growth & Retention Trajectory</span>
                                    <p className="text-sand text-sm">{result.growth_opportunity}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-5">
                                <button className="btn-primary flex-1 justify-center border border-flame/30 hover:bg-flame/20 bg-flame/10 text-flame">Draft FTE Parity Contract</button>
                                <button onClick={forge} className="btn-ghost">Re-forge</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
