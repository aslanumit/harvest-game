
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Participant, 
  Strategy, 
  TournamentSummary, 
  Move, 
  Reaction,
  MatchResult,
  ScoringMatrix,
  VillagePreset
} from './types';
import { PREMADE_AVATARS, ELDER_AVATAR } from './assets';
import { runTournament } from './services/gameEngine';
import { DEFAULT_SCORING } from './constants';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

// --- Stardew Retro Components ---

const PixelFrame: React.FC<{ children: React.ReactNode, title?: string, color?: string, className?: string }> = ({ children, title, className = "" }) => (
  <div className={`relative p-1 mb-8 border-[4px] border-[#5d3a1a] shadow-[4px_4px_0_rgba(0,0,0,0.2)] ${className}`}>
    <div className="bg-[#f4d29c] p-6 relative">
      {title && (
        <div className="absolute -top-5 left-4 bg-[#5d3a1a] px-3 py-1 text-lg uppercase font-bold text-white tracking-widest border-2 border-[#b17b4c] z-20">
          {title}
        </div>
      )}
      {children}
    </div>
  </div>
);

const StardewButton: React.FC<{ onClick: () => void, children: React.ReactNode, disabled?: boolean, variant?: 'primary' | 'danger' | 'success' | 'warning', className?: string, type?: "button" | "submit" | "reset" }> = ({ onClick, children, disabled, variant = 'primary', className = "", type = "button" }) => {
  const colors = {
    primary: 'bg-[#b17b4c] border-[#5d3a1a] text-white hover:bg-[#8b5a2b]',
    success: 'bg-[#348e3a] border-[#1e5d23] text-white hover:bg-[#2a702e]',
    danger: 'bg-[#aa0000] border-[#5a0000] text-white hover:bg-[#800000]',
    warning: 'bg-[#ffcc00] border-[#997a00] text-[#3e2723] hover:bg-[#e6b800]',
  };
  
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`border-[3px] ${colors[variant]} px-6 py-4 text-lg tracking-tighter uppercase transition-all active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_0_rgba(0,0,0,0.2)] font-mono font-bold ${className}`}
    >
      {children}
    </button>
  );
};

const ScenicBackground: React.FC<{ bgUrl: string | null }> = ({ bgUrl }) => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#2e7d32]">
    {bgUrl && (
      <img 
        src={bgUrl} 
        alt="Village Background" 
        className="w-full h-full object-cover pixelated backdrop-blur-sm opacity-80"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    )}
    {!bgUrl && (
      <div className="w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
    )}
    <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>
  </div>
);

const RankingCard: React.FC<{ ranking: any; index: number; participants: Participant[] }> = ({ ranking, index, participants }) => {
  const p = participants.find(part => part.id === ranking.participantId);
  if (!p) return null;

  const formatReaction = (r: Reaction) => {
    if (r === 'COOPERATE') return 'SHARE';
    if (r === 'DEFECT') return 'HOG';
    return 'RANDOM';
  };

  const { strategy } = p;

  return (
    <div className={`flex items-center p-4 border-2 ${index === 0 ? 'border-[#ffcc00] bg-[#fff9c4]' : 'border-[#5d3a1a] bg-[#fdf2e9]'}`}>
      <div className={`w-12 h-12 flex items-center justify-center text-2xl font-bold mr-6 border-2 border-[#5d3a1a] ${index === 0 ? 'bg-[#ffcc00] text-[#3e2723]' : 'bg-[#b17b4c] text-white'}`}>
        {index + 1}
      </div>
      <div className="flex-grow flex items-center gap-4">
        {p.avatarUrl && (
          <img src={p.avatarUrl} alt={p.name} className={`w-12 h-12 border-2 bg-[#f4d29c] object-contain pixelated ${index === 0 ? 'border-[#ffcc00]' : 'border-[#5d3a1a]'}`} />
        )}
        <div className="overflow-hidden">
          <h3 className="text-xl md:text-2xl uppercase leading-none mb-1 font-bold truncate">{p.name}</h3>
          <div className="font-mono text-xs md:text-sm text-amber-900 uppercase tracking-tighter">
            <span className="font-bold opacity-70">Starts:</span> {formatReaction(strategy.initialMove)} | 
            <span className="font-bold opacity-70"> If HOG:</span> {formatReaction(strategy.onOpponentDefect)} | 
            <span className="font-bold opacity-70"> If SHARE:</span> {formatReaction(strategy.onOpponentCooperate)} | 
            <span className="font-bold opacity-70"> Ends:</span> {formatReaction(strategy.finalMove)}
          </div>
        </div>
      </div>
      <div className="text-right flex-shrink-0 ml-4">
        <div className="text-2xl font-mono font-bold text-[#5d3a1a]">{ranking.totalScore}</div>
        <div className="text-lg text-amber-800 uppercase">Pounds</div>
      </div>
    </div>
  );
};

// --- Village Elder Intro Component ---

const IntroPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const fullText = "Welcome, young villagers. Our village thrives on trust, but the harvest season tests even the strongest bonds. During each day of the season, you and your neighbor must decide: will you SHARE your tools and seeds for a collective bounty, or HOG them for yourself? If you both SHARE, the village grows strong (+3 each). But if one HOGS while the other SHARES, the selfish one takes all (+5), leaving the kind soul with nothing. If both HOG... well, the fields go dry and everyone barely scrapes by (+1). Choose your strategies' carefully... the prosperity of our village depends on it!";
  
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const typingSpeed = 60; // ms per char

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + fullText[index]);
        setIndex(prev => prev + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else {
      setIsFinished(true);
    }
  }, [index, fullText]);

  const handleFastForward = () => {
    setDisplayedText(fullText);
    setIndex(fullText.length);
    setIsFinished(true);
  };

  const handleReplay = () => {
    setDisplayedText("");
    setIndex(0);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="max-w-3xl w-full">
        <PixelFrame title="VILLAGE ELDER">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="flex-shrink-0">
              <div className="bg-[#e6c9a3] border-[4px] border-[#5d3a1a] p-4 shadow-lg animate-bounce-slow">
                <img src={ELDER_AVATAR} alt="Village Elder" className="w-32 h-32 pixelated" />
              </div>
            </div>
            <div className="flex-grow flex flex-col justify-between min-h-[200px]">
              <div className="text-2xl font-mono font-bold text-[#3e2723] leading-relaxed mb-8">
                {displayedText}
                {!isFinished && <span className="inline-block w-2 h-6 bg-[#5d3a1a] ml-1 animate-pulse"></span>}
              </div>
              
              <div className="flex flex-wrap gap-4 mt-auto">
                {isFinished ? (
                  <StardewButton onClick={handleReplay} variant="primary">
                    REPLAY ↺
                  </StardewButton>
                ) : (
                  <StardewButton onClick={handleFastForward} variant="primary">
                    FAST FORWARD ⏭
                  </StardewButton>
                )}
                <StardewButton onClick={onClose} variant="success">
                  LET'S HARVEST!
                </StardewButton>
              </div>
            </div>
          </div>
        </PixelFrame>
      </div>
    </div>
  );
};

// --- Arena Animation Components ---

const SpeechBubble: React.FC<{ move: Move; score: number; side: 'left' | 'right'; isVisible: boolean }> = ({ move, score, side, isVisible }) => (
  <div className={`absolute top-0 ${side === 'left' ? 'right-full mr-2' : 'left-full ml-2'} z-[70] transition-all duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275) transform ${isVisible ? 'opacity-100 scale-100 translate-y-0 translate-x-0' : 'opacity-0 scale-50 translate-y-8 ' + (side === 'left' ? 'translate-x-4' : '-translate-x-4')}`}>
    <div className={`relative bg-white text-[#3e2723] p-3 border-[4px] border-[#5d3a1a] min-w-[110px] shadow-[6px_6px_0_rgba(0,0,0,0.15)] ${isVisible ? 'animate-bounce-slow' : ''}`}>
      <div className="text-xs font-black uppercase tracking-widest mb-1 border-b-2 border-gray-100 font-mono flex items-center gap-1 justify-center whitespace-nowrap">
        {move === 'COOPERATE' ? 'SHARE' : 'HOG'}
      </div>
      <div className={`text-2xl font-mono font-black text-center ${score >= 3 ? 'text-green-600' : 'text-red-600'}`}>+{score}</div>
      <div className={`absolute top-6 ${side === 'left' ? '-right-[11px] border-r-[4px] border-t-[4px]' : '-left-[11px] border-l-[4px] border-b-[4px]'} w-5 h-5 bg-white border-[#5d3a1a] rotate-45`}></div>
    </div>
  </div>
);

const StrategySelect: React.FC<{ label: string; value: Reaction; onChange: (val: Reaction) => void; labelColor?: string }> = ({ label, value, onChange, labelColor = 'text-green-700' }) => (
  <div className="p-3 border-2 border-[#5d3a1a] bg-[#fdf2e9] relative font-mono group">
    <label className={`block text-xl ${labelColor} mb-2 uppercase font-bold tracking-tight`}>{label}</label>
    <div className="relative">
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value as Reaction)} 
        className="w-full bg-transparent text-[#3e2723] outline-none cursor-pointer font-bold appearance-none pr-8 text-xl"
      >
        <option value="COOPERATE">SHARING</option>
        <option value="DEFECT">HOGGING</option>
        <option value="RANDOM">RANDOM</option>
      </select>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#5d3a1a] text-xl transition-transform group-focus-within:rotate-180">
        ▼
      </div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>("/background.jpg");
  
  const [participants, setParticipants] = useState<Participant[]>(() => {
    const saved = localStorage.getItem('harvest_participants');
    return saved ? JSON.parse(saved) : [];
  });

  const [numRounds, setNumRounds] = useState<number>(() => {
    const saved = localStorage.getItem('harvest_rounds');
    return saved ? Number(saved) : 5;
  });

  const [scoring, setScoring] = useState<ScoringMatrix>(() => {
    const saved = localStorage.getItem('harvest_scoring');
    return saved ? JSON.parse(saved) : DEFAULT_SCORING;
  });

  const [presets, setPresets] = useState<VillagePreset[]>(() => {
    const saved = localStorage.getItem('harvest_village_presets');
    return saved ? JSON.parse(saved) : [];
  });

  const [presetName, setPresetName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('harvest_participants', JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    localStorage.setItem('harvest_rounds', numRounds.toString());
  }, [numRounds]);

  useEffect(() => {
    localStorage.setItem('harvest_scoring', JSON.stringify(scoring));
  }, [scoring]);

  useEffect(() => {
    localStorage.setItem('harvest_village_presets', JSON.stringify(presets));
  }, [presets]);

  const [newName, setNewName] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const [initialMove, setInitialMove] = useState<Reaction>('COOPERATE');
  const [onDefect, setOnDefect] = useState<Reaction>('DEFECT');
  const [onCooperate, setOnCooperate] = useState<Reaction>('COOPERATE');
  const [finalMove, setFinalMove] = useState<Reaction>('COOPERATE');
  
  const [summary, setSummary] = useState<TournamentSummary | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const [currentMatchIdx, setCurrentMatchIdx] = useState(0);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [isGap, setIsGap] = useState(false);
  const [tempScores, setTempScores] = useState<Record<string, number>>({});
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  useEffect(() => {
    let timer: number;
    if (isRunning && summary) {
      const currentMatch = summary.matches[currentMatchIdx];
      if (currentMatch) {
        if (currentRoundIdx < currentMatch.rounds.length) {
          if (!isGap) {
            if (currentRoundIdx === 0) {
              setIsEntering(true);
              timer = window.setTimeout(() => {
                const firstRound = currentMatch.rounds[0];
                setTempScores(prev => ({
                  ...prev,
                  [currentMatch.p1Id]: (prev[currentMatch.p1Id] || 0) + firstRound.p1Score,
                  [currentMatch.p2Id]: (prev[currentMatch.p2Id] || 0) + firstRound.p2Score,
                }));
                setCurrentRoundIdx(1);
                setIsEntering(false);
              }, 800);
              return;
            }
            timer = window.setTimeout(() => {
              setIsGap(true);
            }, 1000);
          } else {
            timer = window.setTimeout(() => {
              const nextIdx = currentRoundIdx;
              if (nextIdx < currentMatch.rounds.length) {
                const round = currentMatch.rounds[nextIdx];
                setTempScores(prev => ({
                  ...prev,
                  [currentMatch.p1Id]: (prev[currentMatch.p1Id] || 0) + round.p1Score,
                  [currentMatch.p2Id]: (prev[currentMatch.p2Id] || 0) + round.p2Score,
                }));
                setCurrentRoundIdx(prev => prev + 1);
                setIsGap(false);
              } else {
                setIsGap(false);
              }
            }, 400);
          }
        } else {
          if (currentMatchIdx < summary.matches.length - 1) {
            timer = window.setTimeout(() => {
              setCurrentMatchIdx(prev => prev + 1);
              setCurrentRoundIdx(0);
              setIsGap(false);
              setIsEntering(true);
            }, 1500);
          } else {
            timer = window.setTimeout(() => {
              setIsRunning(false);
            }, 2000);
          }
        }
      }
    }
    return () => clearTimeout(timer);
  }, [isRunning, summary, currentMatchIdx, currentRoundIdx, isGap]);

  const handleArrowClick = (direction: 'left' | 'right') => {
    const next = direction === 'left' ? selectedIndex - 1 : selectedIndex + 1;
    if (next >= 0 && next < PREMADE_AVATARS.length) {
      setSelectedIndex(next);
    }
  };

  const addParticipant = () => {
    if (!newName.trim()) return;
    const newParticipant: Participant = {
      id: `p-${Date.now()}`,
      name: newName,
      avatarUrl: PREMADE_AVATARS[selectedIndex],
      strategy: {
        id: `s-${Date.now()}`,
        name: 'Neighbor Strategy',
        initialMove,
        onOpponentDefect: onDefect,
        onOpponentCooperate: onCooperate,
        finalMove,
        description: 'Logic for the harvest season.'
      }
    };
    setParticipants(prev => [...prev, newParticipant]);
    setNewName('');
    setSelectedIndex(Math.floor(Math.random() * PREMADE_AVATARS.length));
    setSummary(null);
  };

  const deleteParticipant = (id: string) => {
    setParticipants(prev => prev.filter(x => x.id !== id));
    setSummary(null);
  };

  const clearParticipants = () => {
    if (window.confirm("Are you sure you want to clear the entire village square?")) {
      setParticipants([]);
      setSummary(null);
      setIsSimulating(false);
      setIsRunning(false);
    }
  };

  const updateScoring = (key: keyof ScoringMatrix, index: 0 | 1, val: string) => {
    const num = parseInt(val) || 0;
    setScoring(prev => {
      const newPair = [...prev[key]] as [number, number];
      newPair[index] = num;
      return { ...prev, [key]: newPair };
    });
    setSummary(null);
  };

  const handleSimulateInstant = async () => {
    if (participants.length < 2) return;
    setIsLeftPanelOpen(false);
    setIsSimulating(true);
    setIsRunning(false);
    setSummary(null);
    
    setTimeout(async () => {
      const results = runTournament(participants, numRounds, scoring);
      setSummary(results);
      setIsSimulating(false);
    }, 1500);
  };

  const handleRunAnimated = () => {
    if (participants.length < 2) return;
    setIsLeftPanelOpen(false);
    const results = runTournament(participants, numRounds, scoring);
    setSummary(results);
    setIsRunning(true);
    setIsSimulating(false);
    setCurrentMatchIdx(0);
    setCurrentRoundIdx(0);
    setIsGap(false);
    setTempScores({});
    setIsEntering(true);
  };

  const saveVillagePreset = () => {
    if (!presetName.trim() || participants.length === 0) return;
    const newPreset: VillagePreset = {
      id: `preset-${Date.now()}`,
      name: presetName,
      participants: [...participants],
      scoring: { ...scoring },
      numRounds: numRounds,
      timestamp: Date.now()
    };
    setPresets(prev => [...prev, newPreset]);
    setPresetName("");
  };

  const loadVillagePreset = (preset: VillagePreset) => {
    if (window.confirm(`Load the village "${preset.name}"? This will replace your current logbook.`)) {
      setParticipants(preset.participants);
      setScoring(preset.scoring);
      setNumRounds(preset.numRounds);
      setSummary(null);
      setIsLeftPanelOpen(true);
    }
  };

  const deleteVillagePreset = (id: string) => {
    if (window.confirm("Are you sure you want to delete this village archive?")) {
      setPresets(prev => prev.filter(p => p.id !== id));
    }
  };

  const exportArchives = () => {
    if (presets.length === 0) return;
    const blob = new Blob([JSON.stringify(presets, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `village_archives_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importArchives = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const imported = JSON.parse(text);
        
        if (!Array.isArray(imported)) {
          alert("Invalid archive format: expected a list of villages.");
          return;
        }
        
        if (imported.length === 0) {
          alert("The imported file contains no villages.");
          return;
        }

        setPresets(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newPresets = imported.filter(p => !existingIds.has(p.id));
          return [...prev, ...newPresets];
        });

        const villageToLoad = imported[imported.length - 1];
        if (villageToLoad) {
          setParticipants(villageToLoad.participants);
          setScoring(villageToLoad.scoring);
          setNumRounds(villageToLoad.numRounds);
          setSummary(null);
          setIsLeftPanelOpen(true);
          alert(`Imported ${imported.length} archives.\nLoaded village: "${villageToLoad.name}"`);
        }
        
      } catch (err) {
        console.error("Import error:", err);
        alert("Error importing file. Please ensure it is a valid JSON archive.");
      } finally {
        if (e.target) e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleBackToSquare = () => {
    setSummary(null);
    setIsLeftPanelOpen(true);
  };

  const chartData = useMemo(() => {
    if (!summary) return [];
    return summary.rankings.map(r => {
      const p = participants.find(part => part.id === r.participantId);
      return { name: p?.name, score: r.totalScore };
    });
  }, [summary, participants]);

  const activeMatch = summary?.matches[currentMatchIdx];
  const p1 = participants.find(p => p.id === activeMatch?.p1Id);
  const p2 = participants.find(p => p.id === activeMatch?.p2Id);
  const currentRound = activeMatch?.rounds[currentRoundIdx - 1];

  return (
    <div className="relative min-h-screen p-10 overflow-hidden">
      <ScenicBackground bgUrl={backgroundUrl} />

      {showIntro && <IntroPopup onClose={() => setShowIntro(false)} />}
      
      <div className="relative z-10 w-full">
        <div className="text-center mb-12">
          <div className="inline-block relative">
            <h1 className="text-9xl font-bold tracking-tight text-[#ffcc00] mb-10 drop-shadow-[6px_6px_0_#5d3a1a]">
              THE HARVEST GAME
            </h1>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <div className={`transition-all duration-500 ease-in-out overflow-hidden flex-shrink-0 ${isLeftPanelOpen ? 'w-full lg:w-[40%] opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}>
            <div className="min-w-[320px] lg:min-w-[480px]">
              <PixelFrame title="">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xl uppercase text-amber-900 mb-2 font-bold tracking-widest font-mono">Add Player</label>
                    <input type="text" placeholder="ENTER NAME..." value={newName} onChange={(e) => setNewName(e.target.value.toUpperCase())} className="w-full bg-[#fdf2e9] border-[3px] border-[#5d3a1a] p-4 text-2xl font-mono text-[#3e2723] outline-none focus:bg-white transition-colors uppercase font-bold" />
                  </div>
                  <div>
                    <label className="block text-xl uppercase text-amber-900 mb-2 font-bold tracking-widest text-center font-mono">Avatar</label>
                    <div className="relative flex items-center justify-center">
                      <button type="button" onClick={() => handleArrowClick('left')} disabled={selectedIndex === 0} className="absolute left-[-20px] z-30 w-12 h-12 bg-[#b17b4c] border-[3px] border-[#5d3a1a] text-white flex items-center justify-center hover:bg-[#8b5a2b] transition-all active:scale-90 disabled:opacity-20 shadow-[0_4px_0_rgba(0,0,0,0.2)]"><span className="text-2xl pointer-events-none">◀</span></button>
                      <div className="w-full relative bg-[#e6c9a3] border-[3px] border-[#5d3a1a] p-2 overflow-hidden shadow-inner">
                        <div ref={scrollRef} className="flex gap-4 overflow-x-hidden scroll-smooth py-12 px-[35%]" style={{ scrollSnapType: 'x mandatory' }}>
                          {PREMADE_AVATARS.map((url, idx) => (
                            <div key={idx} ref={el => { itemRefs.current[idx] = el; }} onClick={() => setSelectedIndex(idx)} className={`flex-shrink-0 w-28 h-28 border-[3px] cursor-pointer transition-all snap-center p-2 bg-[#f4d29c] relative ${selectedIndex === idx ? 'border-green-600 scale-125 z-20 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'border-[#5d3a1a] opacity-60 hover:opacity-100'}`}>
                              <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-contain pixelated" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <button type="button" onClick={() => handleArrowClick('right')} disabled={selectedIndex === PREMADE_AVATARS.length - 1} className="absolute right-[-20px] z-30 w-12 h-12 bg-[#b17b4c] border-[3px] border-[#5d3a1a] text-white flex items-center justify-center hover:bg-[#8b5a2b] transition-all active:scale-90 disabled:opacity-20 shadow-[0_4px_0_rgba(0,0,0,0.2)]"><span className="text-2xl pointer-events-none">▶</span></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 font-mono">
                    <StrategySelect label="Starts By" value={initialMove} onChange={setInitialMove} />
                    <StrategySelect label="Ends By" value={finalMove} onChange={setFinalMove} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 font-mono">
                    <StrategySelect label="If Opponent Hogs" value={onDefect} onChange={setOnDefect} labelColor="text-green-700" />
                    <StrategySelect label="If Opponent Shares" value={onCooperate} onChange={setOnCooperate} labelColor="text-green-700" />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <StardewButton onClick={addParticipant} variant="success">INVITE NEIGHBOR</StardewButton>
                    {participants.length > 0 && <StardewButton onClick={clearParticipants} variant="warning">RESET</StardewButton>}
                  </div>
                </div>
              </PixelFrame>

              <PixelFrame title="SEASON SETTINGS">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between font-mono">
                        <span className="text-xl uppercase font-bold text-amber-900">Days in Season:</span>
                        <input type="number" value={numRounds} onChange={(e) => setNumRounds(Math.max(1, Number(e.target.value)))} className="bg-[#fdf2e9] border-[3px] border-[#5d3a1a] w-24 p-2 text-center text-2xl font-mono text-[#3e2723] focus:border-green-600 outline-none font-bold" />
                    </div>
                    <div className="border-t-2 border-[#5d3a1a] pt-6">
                      <label className="block text-xl uppercase font-bold text-amber-900 mb-6 font-mono">Harvest Payoffs Matrix</label>
                      <div className="grid grid-cols-[100px_1fr_1fr] gap-3 font-mono text-center">
                          <div className="col-start-2 text-lg uppercase font-black text-amber-800 self-end pb-2 border-b-4 border-[#5d3a1a]">Neighbor Shares</div>
                          <div className="col-start-3 text-lg uppercase font-black text-amber-800 self-end pb-2 border-b-4 border-[#5d3a1a]">Neighbor Hogs</div>
                          <div className="flex items-center justify-end pr-2 text-lg uppercase font-black text-amber-800 border-r-4 border-[#5d3a1a]">You Share</div>
                          <div className="bg-green-100/50 p-4 border-[2px] border-[#5d3a1a] flex flex-col items-center justify-center gap-1 shadow-sm overflow-hidden">
                              <div className="flex gap-1 items-center">
                                  <input type="number" value={scoring.CC[0]} onChange={(e) => updateScoring('CC', 0, e.target.value)} className="w-12 p-1 text-center bg-white border-2 border-[#5d3a1a] font-bold text-xl" />
                                  <span className="text-xl font-black text-[#5d3a1a]">,</span>
                                  <input type="number" value={scoring.CC[1]} onChange={(e) => updateScoring('CC', 1, e.target.value)} className="w-12 p-1 text-center bg-white border-2 border-[#5d3a1a] font-bold text-xl" />
                              </div>
                          </div>
                          <div className="bg-red-50/50 p-4 border-[2px] border-[#5d3a1a] flex flex-col items-center justify-center gap-1 shadow-sm overflow-hidden">
                              <div className="flex gap-1 items-center">
                                  <input type="number" value={scoring.CD[0]} onChange={(e) => updateScoring('CD', 0, e.target.value)} className="w-12 p-1 text-center bg-white border-2 border-[#5d3a1a] font-bold text-xl" />
                                  <span className="text-xl font-black text-[#5d3a1a]">,</span>
                                  <input type="number" value={scoring.CD[1]} onChange={(e) => updateScoring('CD', 1, e.target.value)} className="w-12 p-1 text-center bg-white border-2 border-[#5d3a1a] font-bold text-xl" />
                              </div>
                          </div>
                          <div className="flex items-center justify-end pr-2 text-lg uppercase font-black text-amber-800 border-r-4 border-[#5d3a1a]">You Hog</div>
                          <div className="bg-green-50/50 p-4 border-[2px] border-[#5d3a1a] flex flex-col items-center justify-center gap-1 shadow-sm overflow-hidden">
                              <div className="flex gap-1 items-center">
                                  <input type="number" value={scoring.DC[0]} onChange={(e) => updateScoring('DC', 0, e.target.value)} className="w-12 p-1 text-center bg-white border-2 border-[#5d3a1a] font-bold text-xl" />
                                  <span className="text-xl font-black text-[#5d3a1a]">,</span>
                                  <input type="number" value={scoring.DC[1]} onChange={(e) => updateScoring('DC', 1, e.target.value)} className="w-16 p-1 text-center bg-white border-2 border-[#5d3a1a] font-bold text-xl" />
                              </div>
                          </div>
                          <div className="bg-red-100/50 p-4 border-[2px] border-[#5d3a1a] flex flex-col items-center justify-center gap-1 shadow-sm overflow-hidden">
                              <div className="flex gap-1 items-center">
                                  <input type="number" value={scoring.DD[0]} onChange={(e) => updateScoring('DD', 0, e.target.value)} className="w-12 p-1 text-center bg-white border-2 border-[#5d3a1a] font-bold text-xl" />
                                  <span className="text-xl font-black text-[#5d3a1a]">,</span>
                                  <input type="number" value={scoring.DD[1]} onChange={(e) => updateScoring('DD', 1, e.target.value)} className="w-12 p-1 text-center bg-white border-2 border-[#5d3a1a] font-bold text-xl" />
                              </div>
                          </div>
                      </div>
                    </div>
                  </div>
              </PixelFrame>

              <PixelFrame title="VILLAGE ARCHIVES">
                <div className="space-y-6">
                  <div className="flex gap-2">
                    <input type="text" placeholder="ARCHIVE NAME..." value={presetName} onChange={(e) => setPresetName(e.target.value.toUpperCase())} className="flex-grow bg-[#fdf2e9] border-[3px] border-[#5d3a1a] p-3 text-xl font-mono text-[#3e2723] outline-none focus:bg-white uppercase font-bold" />
                    <StardewButton onClick={saveVillagePreset} disabled={!presetName.trim() || participants.length === 0} variant="primary" className="px-4 py-2">SAVE 📜</StardewButton>
                  </div>
                  {presets.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                      {presets.map(p => (
                        <div key={p.id} className="flex items-center justify-between p-3 border-2 border-[#5d3a1a] bg-[#fdf2e9] hover:bg-[#fff9c4] transition-colors group">
                          <div className="flex flex-col">
                            <span className="text-xl font-bold font-mono uppercase text-[#5d3a1a]">{p.name}</span>
                            <span className="text-sm font-mono text-amber-800 uppercase">{p.participants.length} Neighbors • {p.numRounds} Days</span>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button type="button" onClick={() => loadVillagePreset(p)} className="p-2 bg-green-100 border-2 border-[#5d3a1a] hover:bg-green-200" title="Load">✔️</button>
                            <button type="button" onClick={() => deleteVillagePreset(p.id)} className="p-2 bg-red-100 border-2 border-[#5d3a1a] hover:bg-red-200" title="Delete">❌</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center font-mono text-amber-800 uppercase text-lg italic">No archived villages yet...</p>
                  )}
                  <div className="grid grid-cols-2 gap-2 mt-4 border-t-2 border-[#5d3a1a] pt-4">
                    <StardewButton onClick={exportArchives} disabled={presets.length === 0} variant="primary" className="py-2 text-base">EXPORT ALL</StardewButton>
                    <StardewButton onClick={() => fileInputRef.current?.click()} variant="warning" className="py-2 text-base">IMPORT VILLAGE</StardewButton>
                    <input type="file" ref={fileInputRef} onChange={importArchives} accept=".json" className="hidden" />
                  </div>
                </div>
              </PixelFrame>

              <div className="mt-4 pb-12">
                <StardewButton onClick={clearParticipants} variant="danger" className="w-full text-2xl py-6 flex items-center justify-center gap-4">RESET EVERYTHING</StardewButton>
              </div>
            </div>
          </div>

          <div className="flex-grow w-full">
            {isSimulating && !isRunning && (
                <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-[#f4d29c]/90 border-[4px] border-[#5d3a1a] p-12 shadow-lg">
                    <div className="w-32 h-32 mb-8 animate-spin text-5xl flex items-center justify-center">🌀</div>
                    <h2 className="text-3xl text-[#5d3a1a] font-bold animate-pulse uppercase tracking-widest text-center font-mono">SIMULATING ALL THE GAMES...</h2>
                </div>
            )}
            {(isRunning || (!summary && !isSimulating)) && (
              <div className="h-full min-h-[866px] flex flex-col bg-[#fdf2e9]/20 border-[4px] border-[#5d3a1a] shadow-inner relative overflow-hidden p-8 animate-in backdrop-blur-[4px]">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2e7d32 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="relative z-10 w-full h-full flex flex-col">
                  <h2 className="relative z-20 text-3xl text-[#5d3a1a] mb-40 font-bold tracking-tight font-mono uppercase text-center bg-[#f4d29c] inline-block px-6 py-2 border-2 border-[#5d3a1a] mx-auto block w-fit shadow-[4px_4px_0_rgba(0,0,0,0.1)]">Village Square</h2>
                  <div className={`relative z-10 flex-grow transition-opacity duration-500 ${isRunning ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
                    {participants.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                        <div className="bg-[#b17b4c] border-4 border-[#5d3a1a] p-6 shadow-[8px_8px_0_rgba(0,0,0,0.1)] relative">
                          <p className="font-mono text-white text-2xl uppercase font-bold leading-none">The Square is Quiet...</p>
                          <p className="font-mono text-[#f4d29c] uppercase mt-2 text-lg">Invite neighbors to begin the season</p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-full flex flex-col">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 p-4">
                          {participants.map(p => (
                            <div key={p.id} className="flex flex-col items-center group relative">
                              <div className="relative bg-[#f4d29c] border-[3px] border-[#5d3a1a] p-4 shadow-[6px_6px_0_rgba(0,0,0,0.1)] transition-all group-hover:-translate-y-2 group-hover:shadow-[8px_8px_0_rgba(0,0,0,0.15)] group-hover:bg-[#fff9c4]">
                                <img src={p.avatarUrl} alt={p.name} className="w-24 h-24 pixelated object-contain" />
                                <button type="button" onClick={() => deleteParticipant(p.id)} className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 border-2 border-[#5d3a1a] text-white font-mono font-bold flex items-center justify-center hover:bg-red-700 transition-colors shadow-[2px_2px_0_rgba(0,0,0,0.2)] active:scale-90" title="Send Home">X</button>
                              </div>
                              <div className="mt-3 bg-[#5d3a1a] text-white px-4 py-1 text-xl font-mono font-bold uppercase tracking-tighter whitespace-nowrap shadow-[2px_2px_0_rgba(0,0,0,0.2)] truncate max-w-full">{p.name}</div>
                            </div>
                          ))}
                        </div>
                        {participants.length >= 2 && !isRunning && !isSimulating && (
                          <div className="mt-12 mb-8 flex flex-col items-center justify-center z-20">
                            <div className="flex flex-col items-center gap-6 bg-[#fdf2e9]/95 backdrop-blur-sm p-8 border-[4px] border-[#5d3a1a] shadow-[8px_8px_0_rgba(0,0,0,0.2)] animate-in zoom-in duration-300">
                              <p className="font-mono text-[#5d3a1a] text-lg uppercase font-bold animate-pulse tracking-widest text-center border-b-2 border-[#5d3a1a]/20 pb-4 w-full">Ready for the Tournament?</p>
                              <div className="flex flex-col md:flex-row gap-6 w-full">
                                <StardewButton onClick={handleRunAnimated} disabled={isRunning} variant="warning" className="w-full md:w-auto text-xl py-4 min-w-[240px]">WATCH THE TOURNAMENT</StardewButton>
                                <StardewButton onClick={handleSimulateInstant} disabled={isSimulating} variant="primary" className="w-full md:w-auto text-xl py-4 min-w-[240px]">SIMULATE</StardewButton>
                              </div>
                              
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {isRunning && activeMatch && p1 && p2 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 p-4 mt-60">
                      <div className="bg-[#a5d6a7] border-[6px] border-[#5d3a1a] shadow-[12px_12px_0_rgba(0,0,0,0.2)] p-12 w-full max-w-2xl relative animate-in-zoom">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#5d3a1a] text-white px-8 py-2 text-2xl font-bold uppercase font-mono border-2 border-[#b17b4c] z-[60]">DAY {Math.max(1, currentRoundIdx)} / {numRounds}</div>
                        <div className="flex w-full items-center justify-between relative pointer-events-auto px-12 h-64">
                          <div className={`flex flex-col items-center gap-4 relative transition-all duration-700 ease-out transform ${isEntering ? '-translate-x-32 opacity-0' : 'translate-x-0 opacity-100'}`}>
                            <div className="relative">
                              <img src={p1.avatarUrl} alt={p1.name} className={`w-32 h-32 pixelated border-[6px] border-[#5d3a1a] bg-[#f4d29c] shadow-2xl ${!isGap ? 'animate-active-bounce' : 'animate-bounce-slow'}`} />
                              {currentRound && <SpeechBubble move={currentRound.p1Move} score={currentRound.p1Score} side="left" isVisible={!isGap} />}
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold uppercase text-[#5d3a1a] drop-shadow-sm font-mono whitespace-nowrap">{p1.name}</div>
                              <div className="text-4xl font-mono font-black text-green-900 mt-2 bg-white/60 px-5 py-1 rounded-full border-2 border-[#5d3a1a]">{tempScores[p1.id] || 0}</div>
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-2">
                            <div className="text-4xl font-black text-amber-900 animate-pulse bg-white/80 p-5 rounded-full border-4 border-[#5d3a1a] font-mono shadow-lg relative z-10">VS</div>
                          </div>
                          <div className={`flex flex-col items-center gap-4 relative transition-all duration-700 ease-out transform ${isEntering ? 'translate-x-32 opacity-0' : 'translate-x-0 opacity-100'}`}>
                            <div className="relative">
                              <img src={p2.avatarUrl} alt={p2.name} className={`w-32 h-32 pixelated border-[6px] border-[#5d3a1a] bg-[#f4d29c] shadow-2xl ${!isGap ? 'animate-active-bounce' : 'animate-bounce-slow'}`} />
                              {currentRound && <SpeechBubble move={currentRound.p2Move} score={currentRound.p2Score} side="right" isVisible={!isGap} />}
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold uppercase text-[#5d3a1a] drop-shadow-sm font-mono whitespace-nowrap">{p2.name}</div>
                              <div className="text-4xl font-mono font-black text-green-900 mt-2 bg-white/60 px-5 py-1 rounded-full border-2 border-[#5d3a1a]">{tempScores[p2.id] || 0}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {summary && !isSimulating && !isRunning && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <PixelFrame title="TOWN HALL RANKINGS">
                        <div className="space-y-4">
                            {summary.rankings.map((r, idx) => (
                                <RankingCard key={r.participantId} ranking={r} index={idx} participants={participants} />
                            ))}
                        </div>
                        <div className="mt-8 flex justify-center">
                          <StardewButton onClick={handleBackToSquare} variant="primary">BACK TO SQUARE ⛲</StardewButton>
                        </div>
                    </PixelFrame>
                    <PixelFrame title="HARVEST DISTRIBUTION">
                        <div className="h-[400px] bg-white/30 p-4 border-2 border-[#5d3a1a]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis dataKey="name" stroke="#5d3a1a" fontSize={18} tick={{fontFamily: 'VT323', fontWeight: 'bold'}} />
                                    <YAxis stroke="#5d3a1a" fontSize={18} tick={{fontFamily: 'VT323', fontWeight: 'bold'}} />
                                    <Tooltip contentStyle={{backgroundColor: '#fdf2e9', border: '3px solid #5d3a1a', color: '#5d3a1a', fontFamily: 'VT323', fontSize: '1.5rem'}} cursor={{fill: 'rgba(93,58,26,0.1)'}} />
                                    <Bar dataKey="score">
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#ffcc00' : '#b17b4c'} stroke="#5d3a1a" strokeWidth={2} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </PixelFrame>
                </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 0px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #fdf2e9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #b17b4c; border: 2px solid #5d3a1a; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes active-bounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1) translateY(-10px); } }
        @keyframes zoom-in-stardew { from { transform: scale(0.8) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        .animate-in { animation: fade-in 0.8s ease-out forwards; }
        .animate-bounce-slow { animation: bounce-slow 2s infinite ease-in-out; }
        .animate-active-bounce { animation: active-bounce 0.6s infinite ease-in-out; }
        .animate-in-zoom { animation: zoom-in-stardew 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .pixelated { image-rendering: pixelated; }
        select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
        input[type="number"]::-webkit-inner-spin-button, 
        input[type="number"]::-webkit-outer-spin-button { opacity: 1; }
      `}</style>
    </div>
  );
}
