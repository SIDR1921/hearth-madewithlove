import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Flame, ArrowRight, Mic, Github, Heart, Brain } from 'lucide-react';

const features = [
    { icon: Mic, title: 'Aria', sub: 'Voice AI Listener', detail: 'Hindi · Kannada · English' },
    { icon: Github, title: 'Strengths Portrait', sub: 'GitHub Analyzer', detail: 'Hidden mastery detection' },
    { icon: Heart, title: 'Humane Transitions', sub: 'Layoff Support', detail: 'Migrant employee care' },
    { icon: Brain, title: 'Multi-Agent', sub: 'Parallel AI', detail: '3 agents working together' },
];

export function Landing() {
    const navigate = useNavigate();
    const setRole = useAppStore(s => s.setRole);

    const enter = (role, path) => {
        setRole(role);
        navigate(path);
    };

    return (
        <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
            {/* ── Hero ── */}
            <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative">
                {/* Subtle ambient */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-flame/[0.04] blur-[120px]" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto">
                    {/* Mark */}
                    <div className="animate-enter mb-10">
                        <Flame size={28} className="text-flame mx-auto" />
                    </div>

                    {/* Headline */}
                    <h1 className="animate-enter delay-1 font-serif text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.95] text-cream mb-6">
                        You are not<br />
                        <em className="text-flame">a resource.</em>
                    </h1>

                    <p className="animate-enter delay-2 text-sand/80 text-lg max-w-lg mx-auto leading-relaxed mb-14">
                        A cultural operating system that treats people
                        as people — not headcount.
                    </p>

                    {/* Feature row */}
                    <div className="animate-enter delay-3 grid grid-cols-2 md:grid-cols-4 gap-3 mb-16 max-w-2xl mx-auto">
                        {features.map((f, i) => (
                            <div key={f.title} className="card p-4 text-left" style={{ animationDelay: `${i * 60}ms` }}>
                                <f.icon size={16} className="text-sand mb-3" />
                                <div className="text-cream text-[13px] font-medium leading-snug">{f.title}</div>
                                <div className="text-stone text-[11px] mt-0.5">{f.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Portal cards */}
                    <div className="animate-enter delay-5 grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                        <button
                            onClick={() => enter('employee', '/employee/home')}
                            className="group card p-7 text-left hover:border-flame/20 transition-all cursor-pointer"
                        >
                            <div className="text-flame text-xs font-mono tracking-wider uppercase mb-4">Employee</div>
                            <h3 className="font-serif text-2xl text-cream mb-2">Dignity & Growth</h3>
                            <p className="text-stone text-sm leading-relaxed mb-4">
                                Active listener · Seneschal incubator · Identity
                            </p>
                            <span className="inline-flex items-center gap-1.5 text-flame text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                Enter <ArrowRight size={14} />
                            </span>
                        </button>

                        <button
                            onClick={() => enter('manager', '/manager/service')}
                            className="group card p-7 text-left hover:border-sage/20 transition-all cursor-pointer"
                        >
                            <div className="text-sage text-xs font-mono tracking-wider uppercase mb-4">Manager</div>
                            <h3 className="font-serif text-2xl text-cream mb-2">Service Vanguard</h3>
                            <p className="text-stone text-sm leading-relaxed mb-4">
                                Bench paranoia mitigator · Forgiveness weaver · Roles
                            </p>
                            <span className="inline-flex items-center gap-1.5 text-sage text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                Enter <ArrowRight size={14} />
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            <footer className="text-center py-6 border-t border-white/[0.03]">
                <p className="text-[10px] text-stone font-mono tracking-wider">
                    Employee-sovereign · E2E encrypted · Love as a Strategy
                </p>
            </footer>
        </div>
    );
}
