import React, { useState } from 'react';
import { Compass, Lightbulb, Shield, Layers, Users, Heart, ArrowRight, Loader2, Play } from 'lucide-react';
import { generateIncubatorProject } from '../../utils/api';

export function SeneschalIncubator() {
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState(null);

    const generateProject = async () => {
        setLoading(true);
        try {
            // Hardcoded user details for proof of concept
            const res = await generateIncubatorProject('Alexia', ['React', 'Python', 'System Design']);
            setProject(res);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto pb-24">
            <div className="mb-8 animate-enter">
                <span className="label flex items-center gap-2 text-indigo-400"><Compass size={11} /> Unassigned Innovation</span>
                <h1 className="font-serif text-3xl text-cream mt-2">Seneschal Incubator</h1>
                <p className="text-stone text-sm mt-1 max-w-2xl">
                    The bench is not a waiting room—it is an incubator. When you are unassigned, you have the rare luxury of time to solve deep internal problems aligned with Softway's 6 Pillars. Claim a project, build value, and stay visible.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Generation Control */}
                <div className="card p-6 border-l-2 border-l-indigo-500 animate-enter delay-1">
                    <span className="label text-indigo-400 mb-4 flex justify-between pr-2">
                        <span>Project Synthesizer</span>
                        <span>Status: Awaiting Mission</span>
                    </span>
                    <p className="text-stone text-sm mb-6 leading-relaxed">
                        The AI synthesizes internal open-source or process-improvement projects based on your skills and our operational bottlenecks. These projects are fully funded and leadership-reviewed.
                    </p>

                    <button onClick={generateProject} disabled={loading} className="btn-primary w-full justify-center bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border-indigo-500/30">
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Lightbulb size={14} />}
                        {loading ? 'Synthesizing internal gaps...' : 'Generate 6-Pillars Protocol'}
                    </button>

                    <div className="mt-6 pt-5 border-t border-white/[0.04] grid grid-cols-2 gap-4">
                        <div className="bg-night p-3 rounded">
                            <Shield size={14} className="text-sage mb-2" />
                            <span className="text-[10px] text-stone uppercase block mb-1">Accountability</span>
                            <span className="text-xs text-cream">Radical Ownership</span>
                        </div>
                        <div className="bg-night p-3 rounded">
                            <Heart size={14} className="text-rose mb-2" />
                            <span className="text-[10px] text-stone uppercase block mb-1">Empathy</span>
                            <span className="text-xs text-cream">Human-First Design</span>
                        </div>
                    </div>
                </div>

                {/* AI Result */}
                {project && (
                    <div className="card p-6 animate-enter border-t-2 border-t-indigo-500 space-y-6">
                        <div className="flex justify-between items-center pb-4 border-b border-white/[0.04]">
                            <div>
                                <h3 className="text-xl text-cream font-serif">{project.project_title}</h3>
                                <span className="text-xs text-stone mt-1 block">{project.pillar_alignment}</span>
                            </div>
                            <span className="badge bg-indigo-500/20 text-indigo-400">Duration: {project.estimated_duration}</span>
                        </div>

                        <div>
                            <span className="label text-stone">The Problem</span>
                            <p className="text-sand text-sm leading-relaxed">{project.problem_statement}</p>
                        </div>

                        <div>
                            <span className="label text-indigo-400 flex items-center gap-2"><ArrowRight size={10} /> Proposed Architecture</span>
                            <div className="bg-night p-4 border border-white/[0.04] rounded mt-2">
                                <p className="text-sand text-sm leading-relaxed">{project.solution_architecture}</p>
                            </div>
                        </div>

                        <div className="pt-4 mt-2">
                            <button className="btn-primary w-full justify-center">
                                <Play size={14} className="mr-1" /> Claim Project & Start Building
                            </button>
                            <p className="text-center text-[10px] text-stone mt-3">Claiming this project notifies your manager and updates your utilization metric to "Internal Innovation".</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
