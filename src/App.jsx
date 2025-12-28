import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, MapPin, Camera, ShieldAlert, 
  Menu, X, Sparkles, Navigation 
} from 'lucide-react';
import { chatWithGuide } from './services/api';

// --- Composant Principal ---
const App = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      content: 'Salam ! Bienvenue dans la Ville Rouge. Je suis ton guide personnel pour Marrakech. Une question sur la Medina, les prix ou la sécurité ?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

    // Appel au Backend
    const response = await chatWithGuide(userText);
    
    setMessages(prev => [...prev, { role: 'ai', content: response }]);
    setLoading(false);
  };

  return (
    <div className="flex h-screen overflow-hidden text-slate-800 font-sans">
      
      {/* --- Sidebar (Navigation) --- */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-kech-primary text-white transition-transform duration-300 ease-in-out transform 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 shadow-2xl flex flex-col`}
      >
        {/* Logo */}
        <div className="p-8 border-b border-white/10 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-widest text-kech-accent">ZELIG</h1>
            <p className="text-xs text-blue-200 tracking-wider mt-1 uppercase">Digital Marrakech</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/80">
            <X size={24} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          <NavItem icon={<Sparkles size={20}/>} label="Guide IA" active />
          <NavItem icon={<Navigation size={20}/>} label="Planificateur" />
          <NavItem icon={<ShieldAlert size={20}/>} label="Scanner Sécurité" />
          <NavItem icon={<Camera size={20}/>} label="Moments Sociaux" />
        </nav>

        {/* Footer Sidebar */}
        <div className="p-6 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-kech-accent flex items-center justify-center text-kech-primary font-bold font-serif">
              T
            </div>
            <div>
              <p className="text-sm font-bold">Profil Touriste</p>
              <p className="text-xs text-blue-200">Préférences</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- Contenu Principal --- */}
      <main className="flex-1 flex flex-col h-full relative bg-kech-sand">
        
        {/* Header Mobile */}
        <header className="md:hidden p-4 bg-kech-primary text-white flex justify-between items-center shadow-md">
          <h1 className="font-serif text-xl font-bold text-kech-accent">ZELIG</h1>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
        </header>

        {/* Zone de Chat */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 scroll-smooth">
          {/* Bannière de Bienvenue */}
          {messages.length < 3 && (
            <div className="max-w-3xl mx-auto text-center mb-12 mt-10">
              <div className="inline-block p-4 rounded-full bg-kech-secondary/10 mb-4">
                <MapPin className="text-kech-secondary w-8 h-8" />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-kech-primary font-bold mb-4">
                Explorez la Ville Rouge
              </h2>
              <p className="text-lg text-gray-600 max-w-xl mx-auto font-light">
                Demandez les meilleurs Riads, vérifiez la sécurité des rues, ou trouvez un atelier de Zellige authentique.
              </p>
            </div>
          )}

          {/* Boucle des Messages */}
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-4`}>
                
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center shadow-md
                  ${msg.role === 'user' ? 'bg-kech-secondary text-white' : 'bg-white border border-kech-primary/20 text-kech-primary'}`}>
                  {msg.role === 'user' ? 'Moi' : <Sparkles size={18} />}
                </div>

                {/* Bulle de message */}
                <div className={`p-6 rounded-2xl shadow-sm text-base leading-7 relative
                  ${msg.role === 'user' 
                    ? 'bg-kech-primary text-white rounded-tr-none shadow-kech-primary/30' 
                    : 'bg-white/80 backdrop-blur-md border border-white/50 text-slate-800 rounded-tl-none shadow-sm'
                  }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {/* Indicateur de chargement */}
          {loading && (
            <div className="flex w-full justify-start">
               <div className="flex max-w-[70%] gap-4">
                 <div className="w-10 h-10 rounded-full bg-white border border-kech-primary/20 flex items-center justify-center">
                    <Sparkles size={18} className="text-kech-primary animate-spin" />
                 </div>
                 <div className="bg-white/80 p-4 rounded-2xl rounded-tl-none flex gap-2 items-center">
                    <span className="w-2 h-2 bg-kech-primary rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-kech-primary rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-kech-primary rounded-full animate-bounce delay-200"></span>
                 </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie */}
        <div className="p-4 md:p-8 bg-gradient-to-t from-kech-sand via-kech-sand to-transparent">
          <form 
            onSubmit={handleSend}
            className="max-w-4xl mx-auto relative flex items-center gap-4 bg-white p-2 pl-6 rounded-full shadow-2xl border border-white/50"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question à Zelig..."
              className="flex-1 bg-transparent border-none outline-none text-gray-700 text-lg placeholder:text-gray-400 font-light"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="w-12 h-12 bg-kech-secondary hover:bg-orange-700 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-orange-500/30 transform hover:scale-105"
            >
              <Send size={20} />
            </button>
          </form>
          <div className="text-center mt-3">
             <p className="text-xs text-gray-400">Propulsé par Atlas AI & Gemini • Contexte Marocain</p>
          </div>
        </div>

      </main>
    </div>
  );
};

// --- Sous-composant pour les éléments du menu ---
const NavItem = ({ icon, label, active = false }) => (
  <button className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
    ${active 
      ? 'bg-white/10 text-white border-l-4 border-kech-accent' 
      : 'text-blue-200 hover:bg-white/5 hover:text-white'
    }`}>
    <span className={`${active ? 'text-kech-accent' : 'group-hover:text-white'}`}>{icon}</span>
    <span className="font-medium tracking-wide">{label}</span>
  </button>
);

export default App;
