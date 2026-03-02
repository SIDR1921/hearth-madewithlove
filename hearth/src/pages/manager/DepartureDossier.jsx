import React, { useState } from 'react';
import { FileDown, Sparkles, Loader2, Info, CheckCircle2, ShieldAlert } from 'lucide-react';
import { generateDepartureDossier } from '../../utils/api';

export function DepartureDossier() {
    const [name, setName] = useState('Sarah Chen');
    const [role, setRole] = useState('Senior Product Designer');
    const [projects, setProjects] = useState('Led the Q3 design system overhaul and mentored two junior UI engineers.');
    const [isMigrant, setIsMigrant] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dossier, setDossier] = useState(null);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const data = await generateDepartureDossier(name, role, projects, isMigrant);
            setDossier(data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* NO-PRINT: Generator UI */}
            <div className="print:hidden">
                <div className="mb-8 animate-enter">
                    <span className="label flex items-center gap-2 text-rose"><ShieldAlert size={11} /> Offboarding Compassion Protocol</span>
                    <h1 className="font-serif text-3xl text-cream mt-2">The Departure Dossier</h1>
                    <p className="text-stone text-sm mt-1">Structurally humanize the layoff process. Generate a dignified, print-ready document to protect their mental health and migrating safety.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    <div className="space-y-4">
                        <div>
                            <span className="label">Employee Name</span>
                            <input value={name} onChange={e => setName(e.target.value)} className="input-field" />
                        </div>
                        <div>
                            <span className="label">Last Held Role</span>
                            <input value={role} onChange={e => setRole(e.target.value)} className="input-field" />
                        </div>
                        <div>
                            <span className="label">Core Projects & "Invisible Labor"</span>
                            <textarea value={projects} onChange={e => setProjects(e.target.value)} rows={3} className="input-field resize-none" placeholder="What did they actually achieve here?" />
                        </div>
                        <label className="flex items-center gap-3 p-4 bg-night rounded border border-white/5 cursor-pointer hover:bg-white/[0.02] transition-colors">
                            <input type="checkbox" checked={isMigrant} onChange={e => setIsMigrant(e.target.checked)} className="rounded border-none bg-stone text-flame focus:ring-1 focus:ring-flame" />
                            <div>
                                <span className="block text-sm text-sand font-medium mb-0.5">Migrant Worker (Visa Holder)</span>
                                <span className="block text-xs text-stone">Ensure explicit 60-day grave period and immigration safety guidance is provided in the packet.</span>
                            </div>
                        </label>

                        <button onClick={handleGenerate} disabled={loading || !name} className="btn-primary w-full justify-center bg-rose/10 text-rose border-rose/30 hover:bg-rose/20">
                            {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                            {loading ? 'Synthesizing Layoff Dignity...' : 'Generate Departure Dossier'}
                        </button>
                    </div>

                    <div className="card border-l-2 border-l-rose flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose/5 via-night to-night">
                        <Info size={28} className="text-rose/40 mb-4" />
                        <h3 className="font-serif text-cream text-lg mb-2">The "Moral Injury" Antidote</h3>
                        <p className="text-stone text-sm leading-relaxed">
                            Traditional layoffs leave lasting trauma on both management and the departing employee. This dossier ensures they do not leave empty-handed. They leave with a beautifully written letter of recommendation, a translated history of their structural impact, and immediate mental/migrant safety guidance.
                        </p>
                    </div>
                </div>

                {dossier && (
                    <div className="flex justify-end mb-6">
                        <button onClick={() => window.print()} className="btn-primary">
                            <FileDown size={14} /> Download / Print PDF for {name}
                        </button>
                    </div>
                )}
            </div>

            {/* DOSSIER RENDER - Optimized for Print */}
            {dossier && (
                <div className="bg-white text-black p-12 rounded shadow-2xl print:shadow-none print:p-0 animate-enter print:block font-serif max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="border-b-2 border-black pb-8 mb-10 flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-2">Hearth.</h1>
                            <p className="font-mono text-sm tracking-widest text-gray-500 uppercase">A People-First Culture</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600 font-mono">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p className="text-sm font-bold mt-1">Official Departure Dossier for {name}</p>
                        </div>
                    </div>

                    {/* Letter of Recommendation */}
                    <div className="mb-12">
                        <h2 className="text-xs font-mono tracking-widest uppercase text-gray-500 mb-4 border-b border-gray-200 pb-2">Part I: Letter of Recommendation</h2>
                        <div className="text-base leading-loose whitespace-pre-line text-gray-800">
                            {dossier.recommendation_letter}
                        </div>
                        <div className="mt-8 pt-8 w-64 border-t border-gray-400">
                            <p className="text-sm font-bold">Authorized Signature</p>
                            <p className="text-sm text-gray-600 italic">Hearth Leadership Team</p>
                        </div>
                    </div>

                    <div className="page-break-before-always print:mt-16">&nbsp;</div>

                    {/* Legacy Contributions */}
                    <div className="mb-12">
                        <h2 className="text-xs font-mono tracking-widest uppercase text-gray-500 mb-6 border-b border-gray-200 pb-2">Part II: Structural Impact & Human Legacy</h2>
                        <p className="text-sm italic text-gray-600 mb-8">What follows is a verified translation of {name}'s unwritten contributions to our organizational resilience.</p>

                        <div className="space-y-8">
                            {dossier.legacy_contributions.map((legacy, idx) => (
                                <div key={idx} className="bg-gray-50 p-6 rounded-sm border-l-4 border-gray-800">
                                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                        <CheckCircle2 size={16} /> {legacy.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-gray-700">{legacy.impact}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Support Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 bg-gray-100 p-8 rounded-sm">
                        <div>
                            <h2 className="text-xs font-mono tracking-widest uppercase text-gray-600 mb-4 flex items-center gap-2"><ShieldAlert size={14} /> Part III: Psychological Transition</h2>
                            <p className="text-sm leading-relaxed text-gray-800">{dossier.mental_health_support}</p>
                        </div>

                        {dossier.migrant_safety_guidance && (
                            <div className="border-l-2 border-gray-300 pl-8">
                                <h2 className="text-xs font-mono tracking-widest uppercase text-gray-600 mb-4 flex items-center gap-2"><Info size={14} /> Visa Grace-Period Safety</h2>
                                <p className="text-sm leading-relaxed text-gray-800 bg-white p-4 border border-gray-200 shadow-sm">{dossier.migrant_safety_guidance}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
