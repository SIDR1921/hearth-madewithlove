import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Flame, Home, Mic, Compass, Scroll, Hammer, ArrowLeft, Github, Shield } from 'lucide-react';

const employeeNav = [
    { path: '/employee/home', label: 'Home', icon: Home },
    { path: '/employee/listener', label: 'Listener', icon: Mic, badge: 'Voice' },
    { path: '/employee/incubator', label: 'Incubator', icon: Compass, badge: 'New' }
];

const managerNav = [
    { path: '/manager/service', label: 'Service Vanguard', icon: Shield, badge: 'New' },
    { path: '/manager/strengths', label: 'GitHub Strengths', icon: Github },
    { path: '/manager/forgiveness', label: 'Coaching', icon: Scroll },
    { path: '/manager/forge', label: 'Forge', icon: Hammer },
];

export function Shell() {
    const location = useLocation();
    const role = useAppStore(s => s.role);
    const setRole = useAppStore(s => s.setRole);
    const language = useAppStore(s => s.language);
    const setLanguage = useAppStore(s => s.setLanguage);
    const isLanding = location.pathname === '/';
    const navItems = role === 'manager' ? managerNav : employeeNav;

    return (
        <div className="min-h-screen bg-night text-cream">
            {/* ── Top Bar ── */}
            <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-5 bg-night/90 backdrop-blur-sm border-b border-white/[0.04]">
                <Link to="/" onClick={() => setRole(null)} className="flex items-center gap-3">
                    <Flame size={18} className="text-flame" />
                    <span className="font-serif text-lg text-cream">Hearth</span>
                </Link>

                <div className="flex items-center gap-3">
                    {!isLanding && (
                        <span className="text-[10px] font-mono text-muted tracking-wider">
                            Gemini 3 Flash
                        </span>
                    )}
                    <div className="flex gap-0.5 border border-white/[0.06] rounded-md p-0.5">
                        {['EN', 'हिं', 'ಕನ್ನ'].map(lang => (
                            <button
                                key={lang}
                                onClick={() => setLanguage(lang)}
                                className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${language === lang
                                    ? 'bg-cream text-night'
                                    : 'text-stone hover:text-sand'
                                    }`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* ── Sidebar ── */}
            {!isLanding && role && (
                <nav className="fixed left-0 top-14 bottom-0 w-52 bg-dark border-r border-white/[0.04] z-40 flex flex-col py-4">
                    <div className="px-3 mb-5">
                        <Link
                            to="/"
                            onClick={() => setRole(null)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone hover:text-sand transition-colors text-xs"
                        >
                            <ArrowLeft size={13} />
                            Back to portals
                        </Link>
                    </div>

                    <div className="px-6 mb-3">
                        <span className="label mb-0">{role === 'manager' ? 'Leader Tools' : 'Your Space'}</span>
                    </div>

                    <div className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                        {navItems.map(item => {
                            const active = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-all ${active
                                        ? 'bg-flame/10 text-flame'
                                        : 'text-sand hover:text-cream hover:bg-white/[0.02]'
                                        }`}
                                >
                                    <item.icon size={15} strokeWidth={active ? 2 : 1.5} />
                                    <span className="flex-1">{item.label}</span>
                                    {item.badge && (
                                        <span className={`badge ${item.badge === 'New' ? 'bg-sage/15 text-sage' : 'bg-dusk/15 text-dusk'}`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="px-6 py-4 border-t border-white/[0.04]">
                        <p className="text-[10px] text-stone font-mono leading-relaxed">
                            Employee-sovereign data<br />
                            End-to-end encrypted
                        </p>
                    </div>
                </nav>
            )}

            <main className={`pt-14 min-h-screen ${!isLanding && role ? 'pl-52' : ''}`}>
                <Outlet />
            </main>
        </div>
    );
}
