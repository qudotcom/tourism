import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, MapPin, Camera, ShieldAlert, 
  Menu, X, Sparkles, Navigation 
} from 'lucide-react';
import { chatWithGuide } from './services/api';

const App = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      content: 'Salam ! Bienvenue au Maroc. Je suis ton guide personnel à travers le Royaume. Des montagnes de l\'Atlas aux plages d\'Essaouira, que veux-tu découvrir ?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setLoading(true);

    const response = await chatWithGuide(userText);
    
    setMessages(prev => [...prev, { role: 'ai', content: response }]);
    setLoading(false);
  };

  return (
    <div className="flex h-[100dvh] w-full font-sans overflow-hidden text-slate-800 relative">
      
      {/* --- OVERLAY MOBILE --- */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* --- SIDEBAR (Gauche) --- */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-kech-primary text-white transition-transform duration-300 ease-in-out shadow-2xl flex flex-col
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:relative lg:translate-x-0 flex-shrink-0`}
      >
        <div className="p-6 lg:p-8 border-b border-white/10 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl lg:text-3xl font-bold tracking-widest text-kech-accent">ZELIG</h1>
            <p className="text-[10px] lg:text-xs text-blue-200 tracking-wider mt-1 uppercase">Digital Morocco</p>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-white/80 hover:text-white p-2">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NavItem icon={<Sparkles size={20}/>} label="Guide Royal IA" active />
          <NavItem icon={<Navigation size={20}/>} label="Grand Tour" />
          <NavItem icon={<ShieldAlert size={20}/>} label="Sécurité Voyage" />
          <NavItem icon={<Camera size={20}/>} label="Carnet de Route" />
        </nav>

        <div className="p-6 border-t border-white/10 bg-black/20 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-kech-accent flex items-center justify-center text-kech-primary font-bold font-serif shadow-lg">
              M
            </div>
            <div>
              <p className="text-sm font-bold">Profil Voyageur</p>
              <p className="text-xs text-blue-200">Préférences</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- CONTENU PRINCIPAL (Droite avec Texture) --- */}
      <main className="flex-1 flex flex-col h-full relative min-w-0 bg-kech-sand bg-zellij-pattern">
        
        {/* Header Mobile */}
        <header className="lg:hidden p-4 bg-kech-primary text-white flex justify-between items-center shadow-md flex-shrink-0 z-30">
          <h1 className="font-serif text-lg font-bold text-kech-accent">ZELIG</h1>
          <button onClick={() => setMobileMenuOpen(true)} className="p-1 active:scale-95 transition-transform">
            <Menu size={24} />
          </button>
        </header>

        {/* --- ZONE DE CHAT --- */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth" onClick={() => setMobileMenuOpen(false)}>
          <div className="max-w-4xl mx-auto space-y-6 pb-4">
            
            {/* Bannière de Bienvenue */}
            {messages.length < 3 && (
              <div className="text-center py-8 lg:py-16 animate-fade-in px-2">
                <div className="inline-flex p-4 lg:p-5 rounded-full bg-white/90 shadow-lg mb-4 lg:mb-6 ring-1 ring-kech-secondary/20 backdrop-blur-sm">
                  <MapPin className="text-kech-secondary w-8 h-8 lg:w-10 lg:h-10" />
                </div>
                <h2 className="text-3xl lg:text-5xl font-serif text-kech-primary font-bold mb-3 lg:mb-4 leading-tight drop-shadow-sm">
                  Explorez le Royaume
                </h2>
                <p className="text-base lg:text-xl text-gray-700 max-w-2xl mx-auto font-light leading-relaxed bg-kech-sand/60 rounded-lg p-2 backdrop-blur-[2px]">
                  Votre compagnon intelligent à travers le Maroc. Villes impériales, désert, sécurité et culture.
                </p>
              </div>
            )}

            {/* Messages */}
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[90%] lg:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3 items-end`}>
                  
                  {/* Avatar */}
                  <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex-shrink-0 flex items-center justify-center shadow-md mb-1
                    ${msg.role === 'user' ? 'bg-kech-secondary text-white' : 'bg-white border border-kech-primary/20 text-kech-primary'}`}>
                    {msg.role === 'user' ? 'Moi' : <Sparkles size={16} />}
                  </div>

                  {/* Bulle */}
                  <div className={`p-4 lg:p-6 rounded-2xl shadow-sm text-base lg:text-lg leading-relaxed relative backdrop-blur-sm
                    ${msg.role === 'user' 
                      ? 'bg-kech-primary text-white rounded-br-none shadow-kech-primary/20' 
                      : 'bg-white/95 border border-white/50 text-slate-800 rounded-bl-none shadow-sm'
                    }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex w-full justify-start pl-12 lg:pl-14">
                <div className="bg-white/90 px-4 py-3 rounded-2xl rounded-bl-none flex gap-2 items-center shadow-sm border border-gray-100 backdrop-blur-sm">
                   <span className="w-2 h-2 bg-kech-primary rounded-full animate-bounce"></span>
                   <span className="w-2 h-2 bg-kech-primary rounded-full animate-bounce delay-100"></span>
                   <span className="w-2 h-2 bg-kech-primary rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* --- ZONE DE SAISIE --- */}
        <div className="p-3 lg:p-6 bg-white/70 backdrop-blur-md border-t lg:border-none border-gray-100 z-20 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <form 
              onSubmit={handleSend}
              className="relative flex items-center gap-2 lg:gap-4 bg-white p-2 lg:pl-6 rounded-full shadow-lg border border-gray-200 focus-within:ring-2 focus-within:ring-kech-secondary/50 transition-all"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez votre question sur le Maroc..."
                className="flex-1 bg-transparent border-none outline-none text-gray-700 text-base lg:text-lg placeholder:text-gray-400 h-10 lg:h-12 pl-3 lg:pl-0"
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="w-10 h-10 lg:w-12 lg:h-12 bg-kech-secondary hover:bg-orange-700 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow active:scale-95"
              >
                <Send size={18} className="lg:w-5 lg:h-5" />
              </button>
            </form>
            <div className="text-center mt-2 lg:mt-3 hidden lg:block">
               <p className="text-[10px] lg:text-xs text-gray-500 font-medium tracking-wide shadow-sm">
                 PROPULSÉ PAR ATLAS AI & GEMINI • CONTEXTE MAROCAIN
               </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-4 px-4 py-3 lg:py-4 rounded-xl transition-all duration-200 group mb-1
    ${active 
      ? 'bg-white/10 text-white border-r-4 border-kech-accent font-semibold' 
      : 'text-blue-100 hover:bg-white/5 hover:text-white'
    }`}>
    <span className={`${active ? 'text-kech-accent' : 'group-hover:text-white transition-colors'}`}>{icon}</span>
    <span className="text-sm lg:text-base tracking-wide">{label}</span>
  </button>
);

export default App;
