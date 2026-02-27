import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Sparkles, ArrowRight } from 'lucide-react';

export function EmployeeHome() {
    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="p-8 max-w-3xl mx-auto">
            {/* MIP Card */}
            <div className="paper rounded-xl p-8 mb-8 animate-enter">
                <div className="text-xs font-mono text-flame/80 tracking-wider uppercase mb-3 flex items-center gap-2">
                    <Sparkles size={12} /> Monday Ignition Protocol
                </div>
                <h1 className="font-serif text-3xl text-[#2a2622] mb-6">{greeting}, Siddharth.</h1>

                <div className="mb-6">
                    <div className="text-[10px] font-mono text-[#8a8580] uppercase tracking-wider mb-2">Last week's one true win</div>
                    <div className="border-l-2 border-gold pl-4 py-1">
                        <p className="text-[#3a3632] text-[15px]">Unblocked the UI team — Thursday refactor</p>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="text-[10px] font-mono text-[#8a8580] uppercase tracking-wider mb-2">Tomorrow's gentle start</div>
                    <div className="space-y-2">
                        <div className="flex items-start gap-2 text-[#3a3632] text-sm">
                            <ArrowRight size={14} className="text-sage mt-0.5 shrink-0" />
                            20-min doc update (your words, not ours)
                        </div>
                        <div className="flex items-start gap-2 text-[#3a3632] text-sm">
                            <ArrowRight size={14} className="text-sage mt-0.5 shrink-0" />
                            Ping Priya at 10 AM — you two build great energy
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#d4cec4]">
                    <span className="text-[11px] text-[#8a8580]">🔐 Private to you</span>
                    <button className="btn-primary text-sm py-2 px-5">Begin Monday</button>
                </div>
            </div>
        </div>
    );
}
