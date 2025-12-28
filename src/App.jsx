import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, MapPin, Camera, ShieldAlert, 
  Menu, X, Sparkles, Navigation, Map, BookOpen, Phone 
} from 'lucide-react';
import { chatWithGuide } from './services/api';

// --- COMPOSANT PRINCIPAL ---
const App = () => {
  // État pour gérer quelle "page" est affichée : 'guide', 'tour', 'safety', 'carnet'
  const [activeView, setActiveView] = useState('guide');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fonction pour changer de vue depuis la Sidebar
  const handleNavigate = (view) => {
    setActiveView(view);
    setMobileMenuOpen(false); // Ferme le menu mobile au clic
  };

  return (
    <div className="flex h-[100dvh] w-full font-sans overflow-hidden text-slate-800 relative">
      
      {/* Overlay Mobile */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* --- SIDEBAR --- */}
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
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-white/80 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NavItem 
            icon={<Sparkles size={20}/>} 
            label="Guide Royal IA" 
            isActive={activeView === 'guide'} 
            onClick={() => handleNavigate('guide')} 
          />
          <NavItem 
            icon={<Map size={20}/>} 
            label="Grand Tour" 
            isActive={activeView === 'tour'} 
            onClick={() => handleNavigate('tour')} 
          />
          <NavItem 
            icon={<ShieldAlert size={20}/>} 
            label="Sécurité Voyage" 
            isActive={activeView === 'safety'} 
            onClick={() => handleNavigate('safety')} 
          />
          <NavItem 
            icon={<BookOpen size={20}/>} 
            label="Carnet de Route" 
            isActive={activeView === 'carnet'} 
            onClick={() => handleNavigate('carnet')} 
          />
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

      {/* --- CONTENU PRINCIPAL (Dynamique) --- */}
      <main className="flex-1 flex flex-col h-full relative min-w-0 bg-kech-sand bg-zellij-pattern">
        
        {/* Header Mobile */}
        <header className="lg:hidden p-4 bg-kech-primary text-white flex justify-between items-center shadow-md flex-shrink-0 z-30">
          <h1 className="font-serif text-lg font-bold text-kech-accent">ZELIG</h1>
          <button onClick={() => setMobileMenuOpen(true)} className="p-1">
            <Menu size={24} />
          </button>
        </header>

        {/* Le Switcher de Vues */}
        <div className="flex-1 overflow-hidden relative">
          {activeView === 'guide' && <ChatView />}
          {activeView === 'tour' && <TourView />}
          {activeView === 'safety' && <SafetyView />}
          {activeView === 'carnet' && <CarnetView />}
        </div>

      </main>
    </div>
  );
};

// ------------------------------------------------------------------
// --- SOUS-COMPOSANTS (LES VUES) ---
// ------------------------------------------------------------------

// 1. Vue Chat (La vue par défaut)
const ChatView = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Salam ! Je suis ton guide à travers le Royaume. Des montagnes de l\'Atlas aux plages d\'Essaouira, que veux-tu découvrir aujourd\'hui ?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setLoading(true);
    
    // Appel API
    try {
      const response = await chatWithGuide(userText);
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Désolé, je rencontre un problème de connexion." }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-6 pb-4">
          {messages.length < 3 && (
            <div className="text-center py-8 lg:py-16 animate-fade-in px-2">
              <div className="inline-flex p-4 lg:p-5 rounded-full bg-white/90 shadow-lg mb-4 ring-1 ring-kech-secondary/20 backdrop-blur-sm">
                <MapPin className="text-kech-secondary w-8 h-8 lg:w-10 lg:h-10" />
              </div>
              <h2 className="text-3xl lg:text-5xl font-serif text-kech-primary font-bold mb-4 drop-shadow-sm">
                Explorez le Royaume
              </h2>
              <p className="text-base lg:text-xl text-gray-700 max-w-2xl mx-auto font-light bg-kech-sand/60 rounded-lg p-2 backdrop-blur-[2px]">
                Posez vos questions sur Marrakech, Fès, le Désert ou la culture locale.
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[90%] lg:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3 items-end`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-md mb-1 ${msg.role === 'user' ? 'bg-kech-secondary text-white' : 'bg-white border border-kech-primary/20 text-kech-primary'}`}>
                  {msg.role === 'user' ? 'Moi' : <Sparkles size={16} />}
                </div>
                <div className={`p-4 lg:p-6 rounded-2xl shadow-sm text-base lg:text-lg leading-relaxed backdrop-blur-sm ${msg.role === 'user' ? 'bg-kech-primary text-white rounded-br-none' : 'bg-white/95 border border-white/50 text-slate-800 rounded-bl-none'}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {loading && <div className="pl-14 text-sm text-gray-500 italic">Zelig écrit...</div>}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-3 lg:p-6 bg-white/70 backdrop-blur-md border-t lg:border-none border-gray-100 z-20 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="relative flex items-center gap-2 lg:gap-4 bg-white p-2 lg:pl-6 rounded-full shadow-lg border border-gray-200">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Posez votre question sur le Maroc..." className="flex-1 bg-transparent border-none outline-none text-gray-700 text-base lg:text-lg h-10 lg:h-12 pl-3 lg:pl-0" />
            <button type="submit" disabled={loading || !input.trim()} className="w-10 h-10 lg:w-12 lg:h-12 bg-kech-secondary hover:bg-orange-700 text-white rounded-full flex items-center justify-center shadow">
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// 2. Vue Grand Tour (Carte Interactive - Placeholder)
const TourView = () => (
  <div className="h-full overflow-y-auto p-8 animate-fade-in">
    <h2 className="text-4xl font-serif text-kech-primary font-bold mb-6">Le Grand Tour</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Carte Fake */}
      <div className="bg-white p-4 rounded-xl shadow-glass border border-white/50 h-64 flex items-center justify-center bg-blue-50/50">
        <div className="text-center opacity-50">
          <Map size={48} className="mx-auto mb-2 text-kech-primary"/>
          <p>Carte Interactive du Maroc (Bientôt)</p>
        </div>
      </div>
      
      {/* Itinéraires Suggerés */}
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-kech-secondary">
          <h3 className="font-bold text-xl text-slate-800">Les Villes Impériales</h3>
          <p className="text-gray-600 mt-2">7 Jours • Marrakech, Rabat, Fès, Meknès</p>
          <button className="mt-4 text-sm font-bold text-kech-secondary hover:underline">Voir le détail →</button>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-kech-primary">
          <h3 className="font-bold text-xl text-slate-800">La Route des Mille Kasbahs</h3>
          <p className="text-gray-600 mt-2">5 Jours • Ouarzazate, Skoura, Merzouga</p>
          <button className="mt-4 text-sm font-bold text-kech-primary hover:underline">Voir le détail →</button>
        </div>
      </div>
    </div>
  </div>
);

// 3. Vue Sécurité (Dashboard)
const SafetyView = () => (
  <div className="h-full overflow-y-auto p-8 animate-fade-in">
    <h2 className="text-4xl font-serif text-kech-primary font-bold mb-6">Sécurité Voyage</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-red-50 p-6 rounded-xl border border-red-100">
        <div className="flex items-center gap-3 mb-2">
          <Phone className="text-red-600" />
          <h3 className="font-bold text-red-800">Police Touristique</h3>
        </div>
        <p className="text-2xl font-bold text-red-600">19</p>
      </div>
      <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
         <div className="flex items-center gap-3 mb-2">
          <ShieldAlert className="text-orange-600" />
          <h3 className="font-bold text-orange-800">Ambulance / Pompiers</h3>
        </div>
        <p className="text-2xl font-bold text-orange-600">15</p>
      </div>
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
         <div className="flex items-center gap-3 mb-2">
          <ShieldAlert className="text-blue-600" />
          <h3 className="font-bold text-blue-800">Gendarmerie Royale</h3>
        </div>
        <p className="text-2xl font-bold text-blue-600">177</p>
      </div>
    </div>

    <h3 className="text-2xl font-serif text-slate-800 mb-4">Conseils en Direct</h3>
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-sm space-y-4">
      <div className="flex gap-4">
        <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded h-fit">SÛR</span>
        <div>
          <h4 className="font-bold">Les Taxis</h4>
          <p className="text-sm text-gray-600">Exigez toujours le compteur ("Counter please"). À Marrakech, les petits taxis sont beiges. À Casa, ils sont rouges.</p>
        </div>
      </div>
      <div className="w-full h-px bg-gray-200"></div>
      <div className="flex gap-4">
        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded h-fit">ATTENTION</span>
        <div>
          <h4 className="font-bold">Guides non officiels</h4>
          <p className="text-sm text-gray-600">Dans les Médinas, ne suivez pas les gens qui vous proposent de vous "montrer la route". Utilisez votre GPS ou un guide badgé.</p>
        </div>
      </div>
    </div>
  </div>
);

// 4. Vue Carnet (Placeholder)
const CarnetView = () => (
  <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in">
    <div className="bg-white p-6 rounded-full shadow-lg mb-6">
      <BookOpen size={64} className="text-kech-accent" />
    </div>
    <h2 className="text-3xl font-serif text-kech-primary font-bold mb-2">Votre Carnet de Route</h2>
    <p className="text-gray-600 max-w-md">
      Sauvegardez ici vos lieux préférés, vos restaurants favoris et vos notes personnelles sur le Maroc.
    </p>
    <button className="mt-8 px-6 py-3 bg-kech-secondary text-white rounded-lg font-bold shadow hover:bg-orange-700 transition">
      Créer une note
    </button>
  </div>
);

// Composant Bouton Nav (Modifié pour gérer le clic)
const NavItem = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 lg:py-4 rounded-xl transition-all duration-200 group mb-1 text-left
    ${isActive 
      ? 'bg-white/10 text-white border-r-4 border-kech-accent font-semibold shadow-inner' 
      : 'text-blue-100 hover:bg-white/5 hover:text-white'
    }`}>
    <span className={`${isActive ? 'text-kech-accent' : 'group-hover:text-white transition-colors'}`}>{icon}</span>
    <span className="text-sm lg:text-base tracking-wide">{label}</span>
  </button>
);

export default App;
