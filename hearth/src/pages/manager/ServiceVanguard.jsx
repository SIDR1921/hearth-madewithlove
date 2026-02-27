import React, { useState } from 'react';
import { Shield, Radar, Target, ArrowRight, Loader2 } from 'lucide-react';
import { generateServiceRadar } from '../../utils/api';

export function ServiceVanguard() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const runRadar = async () => {
        setLoading(true);
        try {
            const res = await generateServiceRadar('Raj Engineer', ['React', 'Node'], 'Project Nexus', ['React', 'GraphQL', 'AWS']);
            setResult(res);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8 animate-enter">
                <span className="label flex items-center gap-2 text-sage"><Shield size={11} /> Bench Paranoia Mitigator</span>
                <h1 className="font-serif text-3xl text-cream mt-2">Next-Role Radar</h1>
                <p className="text-stone text-sm mt-1">Replacing the terror of the bench with transparent, funded upskilling paths into the active pipeline.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="card p-6 border-l-2 border-l-sage animate-enter delay-1">
                    <span className="label text-sage mb-4 flex justify-between pr-2"><span>Resource Management Engine</span> <span>Status: Unassigned</span></span>
                    <p className="text-stone text-sm mb-6 leading-relaxed">
                        The resource management process shouldn't be a black box. The Radar instantly maps your existing skills against upcoming pipeline opportunities to give you transparent upskilling paths instead of sitting idly on the bench.
                    </p>

                    <div className="space-y-4 mb-6">
                        <div className="bg-night p-3 rounded border border-white/[0.04]">
                            <span className="text-xs text-stone uppercase tracking-wider block mb-1">Target Engagement Recommendation</span>
                            <span className="text-cream text-sm flex justify-between"><span>Acme Corp — Nexus Platform</span> <span className="text-sage text-xs">Starts in 3wks</span></span>
                        </div>
                    </div>

                    <button onClick={runRadar} disabled={loading} className="btn-primary w-full justify-center">
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Radar size={14} />}
                        {loading ? 'Scanning Pipeline...' : 'Run Pipeline Scan & Match'}
                    </button>
                </div>

                {result && (
                    <div className="card-warm p-6 animate-enter">
                        <div className="flex justify-between items-center mb-5">
                            <span className="label mb-0 text-sage">AI Radar Match</span>
                            <div className="flex items-center gap-2 text-sage bg-sage/10 px-3 py-1 rounded-full text-xs font-mono font-medium">
                                <Target size={12} /> {result.match_percentage} Match
                            </div>
                        </div>

                        <p className="text-cream text-sm leading-relaxed mb-6">{result.empathetic_message}</p>

                        <span className="label text-stone">Missing Skills to Bridge</span>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {result.missing_skills.map((s, i) => <span key={i} className="badge bg-night text-sand border border-white/[0.04]">{s}</span>)}
                        </div>

                        <span className="label text-sage flex items-center gap-2"><ArrowRight size={10} /> Paid Upskilling Path (2026 Reskilling Fund)</span>
                        <div className="space-y-2 mt-2">
                            {result.learning_path.map((step, i) => (
                                <div key={i} className="flex gap-3 text-sm bg-white/[0.02] p-3 rounded border border-white/[0.02]">
                                    <span className="text-sage font-mono">Day {step.day}</span>
                                    <span className="text-stone">{step.focus}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
