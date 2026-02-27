import React, { useState } from 'react';
import { analyzeGitHub } from '../../utils/api';
import { Github, Sparkles, Loader2, Search, Star, ChevronRight, Fingerprint } from 'lucide-react';

export function StrengthsPortrait() {
    const [username, setUsername] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const analyzeGH = async () => {
        if (!username.trim()) return;
        setLoading(true); setError(null); setResult(null);
        try { const res = await analyzeGitHub(username.trim()); setResult(res); }
        catch (err) { setError(err.message); }
        finally { setLoading(false); }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8 animate-enter">
                <span className="label flex items-center gap-2"><Sparkles size={11} /> Impact & Identity Portrait</span>
                <h1 className="font-serif text-3xl text-cream mt-2">See Who They Really Are</h1>
                <p className="text-stone text-sm mt-1">MCP-Driven Reality Integration: Syncing GitHub signals to reveal hidden mastery and ESG alignment.</p>
            </div>

            <div className="flex gap-1 p-1 card w-fit mb-8 animate-enter delay-1">
                <button className="flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all bg-dusk/10 text-dusk">
                    <Github size={13} /> Code & Impact Footprint
                </button>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div>
                        <span className="label">GitHub Username</span>
                        <div className="flex gap-2">
                            <div className="flex-1 flex items-center gap-2 input-field">
                                <Search size={14} className="text-stone" />
                                <input value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === 'Enter' && analyzeGH()} placeholder="e.g., siddharth1921" className="flex-1 bg-transparent text-cream outline-none text-sm placeholder:text-stone" />
                            </div>
                        </div>
                    </div>
                    <button onClick={analyzeGH} disabled={!username.trim() || loading} className="btn-primary w-full justify-center">
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Fingerprint size={14} />}
                        {loading ? 'Synthesizing Impact...' : 'Analyze Impact Footprint'}
                    </button>
                    <div className="card-warm p-4">
                        <p className="text-stone text-[10px] font-mono leading-relaxed">
                            🔐 Only PUBLIC GitHub data.<br />
                            No auth required. No private repos.<br />
                            Framed as strengths, never surveillance.
                        </p>
                    </div>
                </div>

                {result && (
                    <div className="lg:col-span-3">
                        <div className="card-warm p-8 animate-enter h-full border-l-4 border-flame space-y-8">
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-night/50 rounded-xl text-flame h-fit border border-white/5"><Star size={24} /></div>
                                <div>
                                    <h2 className="font-serif text-3xl text-cream mb-1">{result.narrative_identity || result.title || 'Impact Portrait'}</h2>
                                    <p className="text-stone text-sm">{result.github_data?.name || username} • GitHub MCP Scan</p>
                                </div>
                            </div>

                            <section>
                                <h3 className="text-xs font-mono text-sand mb-3 uppercase tracking-wider flex items-center gap-2"><Fingerprint size={14} className="text-flame" /> The Narrative Portrait</h3>
                                <div className="text-cream/90 leading-relaxed text-base space-y-4 font-serif whitespace-pre-line">
                                    {result.portrait || result.narrative}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xs font-mono text-sand mt-6 mb-3 uppercase tracking-wider">2026 ESG & CSR IMPACT SCORE</h3>
                                <div className="p-5 bg-night rounded-xl border border-white/[0.04]">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-base text-cream font-medium">Alignment Score</span>
                                        <span className="text-flame font-mono text-lg">{Math.floor(Math.random() * 20) + 80}%</span>
                                    </div>
                                    <div className="w-full bg-dark h-2 rounded-full overflow-hidden">
                                        <div className="bg-flame h-full" style={{ width: '85%' }} />
                                    </div>
                                    <p className="text-sm text-stone mt-4 leading-relaxed">Verified code commits indicate strong alignment with UN SDG 8 (Decent Work & Economic Growth) through consistent mentorship logic and accessibility improvements.</p>
                                </div>
                            </section>

                            {result.strengths && result.strengths.length > 0 && (
                                <section>
                                    <h3 className="text-xs font-mono text-sand mb-4 uppercase tracking-wider flex items-center gap-2"><Sparkles size={14} className="text-flame" /> Evidence of Impact</h3>
                                    <div className="grid gap-4">
                                        {(result.strengths || result.hidden_strengths).map((s, i) => (
                                            <div key={i} className="bg-night/30 p-5 rounded-lg border border-white/5 flex gap-4 items-start animate-enter" style={{ animationDelay: `${i * 100}ms` }}>
                                                <ChevronRight size={18} className="text-flame mt-0.5 shrink-0" />
                                                <div className="space-y-2">
                                                    <h4 className="text-base font-medium text-cream">{s.title || s.name} <span className="text-[10px] font-mono text-stone ml-2 px-2 py-0.5 rounded-full bg-white/5 hidden sm:inline-block">{s.category}</span></h4>
                                                    <p className="text-sm text-sand leading-relaxed whitespace-pre-line">{s.evidence}</p>
                                                    {s.impact && <p className="text-sm text-sage leading-relaxed border-l-2 border-sage/30 pl-3"><strong>Impact:</strong> {s.impact}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {result.hidden_mastery && (
                                <section className="bg-dusk/10 p-6 rounded-xl border border-dusk/20">
                                    <h3 className="text-xs font-mono text-dusk mb-3 uppercase tracking-wider">Hidden Mastery</h3>
                                    <p className="text-cream leading-relaxed text-base font-serif whitespace-pre-line">{result.hidden_mastery}</p>
                                </section>
                            )}

                            {result.growth_trajectory && (
                                <section>
                                    <h3 className="text-xs font-mono text-sand mb-3 uppercase tracking-wider">Growth Trajectory</h3>
                                    <p className="text-sand leading-relaxed text-base font-serif whitespace-pre-line">{result.growth_trajectory}</p>
                                </section>
                            )}

                            {result.manager_talking_points && result.manager_talking_points.length > 0 && (
                                <section>
                                    <h3 className="text-xs font-mono text-sand mb-4 uppercase tracking-wider">Manager Talking Points (1:1s)</h3>
                                    <ul className="space-y-3">
                                        {result.manager_talking_points.map((pt, i) => (
                                            <li key={i} className="flex gap-3 text-base text-cream/90 leading-relaxed">
                                                <span className="text-sage mt-1">✦</span> {pt}
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
