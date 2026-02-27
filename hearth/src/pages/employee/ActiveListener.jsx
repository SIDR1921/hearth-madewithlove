import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { askListener } from '../../utils/api';
import { Send, Mic, MicOff, Volume2 } from 'lucide-react';

export function ActiveListener() {
    const language = useAppStore(s => s.language);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(false);
    const endRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    useEffect(() => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SR) {
            setSpeechSupported(true);
            const r = new SR();
            r.continuous = false;
            r.interimResults = true;
            r.lang = ({ 'EN': 'en-IN', 'हिं': 'hi-IN', 'ಕನ್ನ': 'kn-IN' })[language] || 'en-IN';
            r.onresult = (e) => setInput(Array.from(e.results).map(r => r[0].transcript).join(''));
            r.onend = () => setIsListening(false);
            r.onerror = () => setIsListening(false);
            recognitionRef.current = r;
        }
    }, [language]);

    const toggleVoice = () => {
        if (!recognitionRef.current) return;
        if (isListening) { recognitionRef.current.stop(); setIsListening(false); }
        else { setInput(''); recognitionRef.current.start(); setIsListening(true); }
    };

    const audioRef = useRef(null);

    const speak = async (text) => {
        // Stop any currently playing audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        window.speechSynthesis?.cancel();

        try {
            // Use Gemini TTS with Kore voice (softer, highly empathetic)
            const res = await fetch('http://localhost:8000/api/tts/speak', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, voice: 'Kore' }),
            });

            if (!res.ok) throw new Error('TTS failed');

            const audioBlob = await res.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.volume = 0.85;
            audioRef.current = audio;
            audio.onended = () => URL.revokeObjectURL(audioUrl);
            await audio.play();
        } catch {
            // Fallback to browser TTS if Gemini TTS fails
            if (!window.speechSynthesis) return;
            const u = new SpeechSynthesisUtterance(text);
            const lang = ({ 'EN': 'en-IN', 'हिं': 'hi-IN', 'ಕನ್ನ': 'kn-IN' })[language] || 'en-IN';
            u.lang = lang;
            u.rate = 0.82;
            u.pitch = 1.05;
            u.volume = 0.85;
            window.speechSynthesis.speak(u);
        }
    };

    const send = async () => {
        const text = input.trim();
        if (!text || loading) return;
        setInput('');
        if (isListening && recognitionRef.current) { recognitionRef.current.stop(); setIsListening(false); }
        setMessages(prev => [...prev, { role: 'user', text }]);
        setLoading(true);
        try {
            const history = messages.map(m => `${m.role}: ${m.text}`);
            const res = await askListener(text, language, '', history);
            setMessages(prev => [...prev, {
                role: 'aria', text: res.response,
                emotion: res.detected_emotion, detectedLang: res.detected_language,
                action: res.suggested_action,
            }]);
            speak(res.response);
        } catch {
            setMessages(prev => [...prev, { role: 'aria', text: "I'm having trouble connecting right now... but I'm here. Try again?", emotion: 'connection' }]);
        } finally { setLoading(false); }
    };

    const starters = [
        { en: "I'm feeling overwhelmed", hi: "मैं बहुत थक गया हूँ", kn: "ನನಗೆ ತುಂಬಾ ಒತ್ತಡ ಆಗ್ತಿದೆ" },
        { en: "Need to talk about my team", hi: "टीम के बारे में बात करनी है", kn: "ನನ್ನ ತಂಡದ ಬಗ್ಗೆ ಮಾತಾಡಬೇಕು" },
        { en: "Celebrating a quiet win", hi: "एक छोटी जीत मनानी है", kn: "ಒಂದು ಸಣ್ಣ ಗೆಲುವು ಆಚರಿಸಬೇಕು" },
    ];

    return (
        <div className="h-[calc(100vh-3.5rem)] flex flex-col">
            {/* Header */}
            <div className="px-8 py-5 border-b border-white/[0.04]">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-serif text-2xl text-cream">Aria</h1>
                        <p className="text-stone text-sm mt-0.5">Your safe space. Speak or type — in any language.</p>
                    </div>
                    {speechSupported && (
                        <span className="text-[10px] font-mono text-stone">Voice {isListening ? 'Active' : 'Ready'}</span>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center gap-6">
                        <div>
                            <Mic size={24} className="text-stone mx-auto mb-4" />
                            <p className="font-serif text-xl text-sand/80 italic text-center">What's been on your mind?</p>
                            <p className="text-stone text-xs text-center mt-2">Hindi, Kannada, or English — Aria responds in your language</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 max-w-md">
                            {starters.map((s, i) => {
                                const text = language === 'हिं' ? s.hi : language === 'ಕನ್ನ' ? s.kn : s.en;
                                return (
                                    <button key={i} onClick={() => setInput(text)} className="px-4 py-2 rounded-lg card text-sand text-sm hover:text-cream transition-colors">
                                        {text}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-enter`}>
                        <div className={`max-w-[70%] px-5 py-3 rounded-xl ${msg.role === 'user'
                            ? 'bg-flame/10 border border-flame/15 text-cream rounded-br-sm'
                            : 'card text-parchment rounded-bl-sm'
                            }`}>
                            {msg.role === 'aria' && <span className="text-[10px] font-mono text-flame/60 block mb-1">Aria</span>}
                            <p className={`text-sm leading-relaxed ${msg.role === 'aria' ? 'font-serif italic text-[15px]' : ''}`}>{msg.text}</p>
                            {msg.role === 'aria' && (
                                <div className="mt-2 flex items-center gap-2 flex-wrap">
                                    {msg.emotion && <span className="badge bg-dusk/15 text-dusk">{msg.emotion}</span>}
                                    {msg.action && <span className="text-[10px] text-sage font-mono">💡 {msg.action}</span>}
                                    <button onClick={() => speak(msg.text)} className="text-stone hover:text-sand transition-colors ml-auto"><Volume2 size={12} /></button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start animate-enter">
                        <div className="card rounded-xl rounded-bl-sm px-5 py-4 flex gap-1.5">
                            {[0, 150, 300].map(d => <span key={d} className="w-1.5 h-1.5 rounded-full bg-flame/50 animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                        </div>
                    </div>
                )}
                <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-5 border-t border-white/[0.04] bg-night/90">
                <div className={`flex gap-3 items-center card px-4 py-3 ${isListening ? '!border-sage/30' : ''}`}>
                    {speechSupported && (
                        <button onClick={toggleVoice} className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isListening ? 'bg-sage/15 text-sage' : 'text-stone hover:text-sand'} transition-all`}>
                            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                        </button>
                    )}
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
                        placeholder={isListening ? 'Listening...' : 'Type or speak — any language...'}
                        className="flex-1 bg-transparent outline-none text-cream placeholder:text-stone text-sm"
                        disabled={loading}
                    />
                    <button onClick={send} disabled={!input.trim() || loading} className="w-9 h-9 rounded-lg bg-flame/10 hover:bg-flame/20 flex items-center justify-center text-flame transition-all disabled:opacity-20 shrink-0">
                        <Send size={14} />
                    </button>
                </div>
                <p className="text-[10px] text-center text-stone mt-2 font-mono">
                    Private · Not stored · Not used for evaluation · Helpline: iCall 9152987821
                </p>
            </div>
        </div>
    );
}
