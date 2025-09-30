import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Code, ArrowRight, Sparkles, Home, Laptop, Database, Globe, Server, Hammer, Drill, PaintBucket, Ruler, Zap, Shield, Cpu, Terminal, Cloud, Wifi } from 'lucide-react';

// ============================================================================
// CONTENT CONFIGURATION - Edit this section to update all text content
// ============================================================================

const CONTENT = {
  // Brand
  brand: {
    name: 'Quantum',
    nameSuffix: 'Handyman'
  },
  
  // Handyman Side
  handyman: {
    title: 'Handyman',
    subtitle: 'Professional repairs & home improvements with a tech-savvy edge',
    features: [
      'Home Repairs & Maintenance',
      'Smart Home Installation', 
      'Furniture Assembly',
      'Landscaping & Outdoor'
    ],
    stats: {
      experience: { value: '10+', label: 'Years' },
      jobs: { value: '15K+', label: 'Jobs' },
      pricing: { value: '$195', label: 'Starting' }
    },
    button: 'Enter Handyman',
    sideLabel: 'Handyman Services',
    
    // Right Brain Elements
    brainElements: {
      toolLabels: {
        repairs: 'Repairs',
        proPaint: 'Pro Paint',
        licensed: 'Licensed',
        voltage: '220V Ready',
        measurements: '±0.1mm',
        dimensions: "12'x14'",
        craftsman: 'Craftsman'
      },
      smartHub: {
        title: 'Smart Hub'
      },
      timeline: {
        label: 'Timeline',
        current: 'Day 1 of 3'
      },
      quality: {
        rating: '5.0',
        label: 'Rating'
      }
    }
  },
  
  // Web Dev Side
  web: {
    title: 'Web Dev',
    subtitle: 'Full-stack development from a CS-educated problem solver',
    features: [
      'Custom Web Applications',
      'E-commerce Solutions',
      'SEO & Performance',
      'AI Integration'
    ],
    stats: {
      education: { value: 'CS', label: 'Degree' },
      sites: { value: '50+', label: 'Sites' },
      pricing: { value: '$500', label: 'Starting' }
    },
    button: 'Enter Web Dev',
    sideLabel: 'Web Development',
    
    // Left Brain Elements
    brainElements: {
      codeBlocks: {
        brackets: '{ }',
        component: '<App />',
        router: '<Router>',
        ui: '<UI>'
      },
      binary: ['01001010', '11010110', '00110101'],
      api: {
        endpoint: 'GET /api/v1',
        status: '200 OK'
      },
      terminal: {
        command: '$ npm run build',
        output: '✓ Compiled'
      },
      database: {
        query: 'SELECT * FROM'
      },
      git: {
        action: 'git merge'
      },
      techStack: [
        { name: 'Node.js', icon: 'Server' },
        { name: 'AWS', icon: 'Cloud' }
      ],
      frameworks: ['React', 'Vue'],
      performance: {
        score: '98',
        max: '/100',
        label: 'Performance'
      }
    }
  },
  
  // UI Labels
  ui: {
    mobileHint: 'Tap to select your service',
    desktopHint: 'Hover & click to enter • Use arrow keys to navigate'
  }
};

// ============================================================================
// COMPONENT
// ============================================================================

const SplitLanding = ({ onWorldSelect }) => {
  const [hoveredSide, setHoveredSide] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animations on mount
    setIsLoaded(true);
    
    // Keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handleSelection('handyman');
      if (e.key === 'ArrowRight') handleSelection('web');
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Preload the main app chunks for faster transition
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'script';
        link.href = '/src/main.jsx';
        document.head.appendChild(link);
      });
    }
    
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelection = (world) => {
    // Store the selection
    localStorage.setItem('qh_world', world);
    localStorage.setItem('qh_entry_timestamp', new Date().toISOString());
    
    // Add fade out animation
    setIsLoaded(false);
    
    // Notify parent and navigate
    setTimeout(() => {
      onWorldSelect(world);
      navigate('/');
    }, 300);
  };

  return (
    <div className={`fixed inset-0 bg-near-black overflow-hidden transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background Brain Image */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <img 
          src="/brain.png" 
          alt="" 
          className={`w-full h-full max-w-4xl object-contain transition-all duration-1200 ${
            hoveredSide ? 'opacity-60 blur-none scale-110' : 'opacity-30 blur-sm scale-100'
          }`}
          style={{ 
            filter: `drop-shadow(0 0 ${hoveredSide ? '60px' : '20px'} rgba(255,255,255,0.2))`,
            transform: hoveredSide === 'handyman' ? 'translateX(-50px)' : hoveredSide === 'web' ? 'translateX(50px)' : 'translateX(0)',
            transitionDuration: '1200ms'
          }}
        />
        
        {/* Web Dev Creative Elements - LEFT BRAIN - Only visible when Web is hovered */}
        <div className={`absolute inset-0 transition-all duration-1200 ${
          hoveredSide === 'web' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          {/* LEFT BRAIN ELEMENTS - Logical/Analytical thinking */}
          
          {/* Floating Code Blocks with Glow */}
          <div className="absolute top-[18%] left-[12%] group">
            <div className="absolute inset-0 bg-green-400 blur-xl opacity-30 group-hover:opacity-60 transition-opacity" />
            <div className="relative text-green-400 text-5xl font-mono font-bold drop-shadow-2xl animate-pulse" 
              style={{textShadow: '0 0 20px rgba(74, 222, 128, 0.8)'}}>
              {CONTENT.web.brainElements.codeBlocks.brackets}
            </div>
          </div>
          
          {/* Algorithm Flowchart Lines */}
          <svg className="absolute top-[22%] left-[20%] w-32 h-32 text-blue-400 opacity-60" style={{animation: 'float 3s ease-in-out infinite'}}>
            <line x1="0" y1="0" x2="80" y2="40" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" 
              style={{animation: 'dash 2s linear infinite'}} />
            <circle cx="80" cy="40" r="8" fill="currentColor" />
            <line x1="80" y1="40" x2="40" y2="80" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" 
              style={{animation: 'dash 2s linear infinite', animationDelay: '0.3s'}} />
            <circle cx="40" cy="80" r="8" fill="currentColor" />
          </svg>
          
          {/* Binary Matrix Rain Effect */}
          <div className="absolute top-[35%] left-[8%] flex flex-col gap-1 font-mono text-xs text-emerald-400 opacity-40">
            {CONTENT.web.brainElements.binary.map((code, idx) => (
              <div key={idx} style={{animation: 'slideDown 4s linear infinite', animationDelay: `${idx * 0.5}s`}}>{code}</div>
            ))}
          </div>
          
          {/* React Component Tree */}
          <div className="absolute top-[28%] left-[32%] font-mono text-sm text-cyan-400 opacity-70">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="drop-shadow-lg">{CONTENT.web.brainElements.codeBlocks.component}</span>
            </div>
            <div className="ml-4 mt-1 flex items-center gap-1" style={{animation: 'fadeIn 0.8s ease-out 0.2s backwards'}}>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-xs text-blue-300">{CONTENT.web.brainElements.codeBlocks.router}</span>
            </div>
            <div className="ml-8 mt-0.5 flex items-center gap-1" style={{animation: 'fadeIn 0.8s ease-out 0.4s backwards'}}>
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" />
              <span className="text-xs text-purple-300">{CONTENT.web.brainElements.codeBlocks.ui}</span>
            </div>
          </div>
          
          {/* Database with Connection Lines */}
          <div className="absolute bottom-[28%] left-[14%] group">
            <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-20 group-hover:opacity-40 transition-all" />
            <Database className="relative w-14 h-14 text-purple-400 drop-shadow-2xl" 
              style={{
                animation: 'pulse 2s ease-in-out infinite',
                filter: 'drop-shadow(0 0 15px rgba(168, 85, 247, 0.6))'
              }} />
            {/* SQL Query Text */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-mono text-purple-300 opacity-60">
              {CONTENT.web.brainElements.database.query}
            </div>
          </div>
          
          {/* API Endpoint Box */}
          <div className="absolute top-[48%] left-[26%] bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-sm 
            border border-orange-400/30 rounded-lg px-3 py-1.5 shadow-xl" 
            style={{animation: 'float 4s ease-in-out infinite', animationDelay: '1s'}}>
            <div className="font-mono text-xs text-orange-300 font-semibold">{CONTENT.web.brainElements.api.endpoint}</div>
            <div className="flex gap-1 mt-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <div className="text-[10px] text-green-300 opacity-80">{CONTENT.web.brainElements.api.status}</div>
            </div>
          </div>
          
          {/* Terminal Window */}
          <div className="absolute top-[12%] left-[25%] bg-gray-900/40 backdrop-blur-sm rounded-lg border border-gray-700/50 
            shadow-2xl overflow-hidden" style={{animation: 'slideDown 0.6s ease-out'}}>
            <div className="bg-gray-800/60 px-3 py-1 flex gap-1.5">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
              <div className="w-2 h-2 bg-green-400 rounded-full" />
            </div>
            <div className="p-2 font-mono text-xs text-green-400">
              <div className="opacity-80">{CONTENT.web.brainElements.terminal.command}</div>
              <div className="text-gray-400 opacity-60 mt-0.5">{CONTENT.web.brainElements.terminal.output}</div>
            </div>
          </div>
          
          {/* Git Branch Graph */}
          <div className="absolute bottom-[15%] left-[22%]" style={{animation: 'fadeIn 0.8s ease-out 0.6s backwards'}}>
            <div className="flex items-center gap-2 text-xs font-mono text-pink-400">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="6" cy="6" r="3" fill="rgba(236, 72, 153, 0.3)" />
                <circle cx="18" cy="18" r="3" fill="rgba(236, 72, 153, 0.3)" />
                <path d="M6 9 L6 15 Q6 18 9 18 L18 18" strokeDasharray="2,2" />
              </svg>
              <span className="opacity-70">{CONTENT.web.brainElements.git.action}</span>
            </div>
          </div>
          
          {/* Tech Stack Icons with Labels */}
          <div className="absolute top-[58%] left-[10%] flex flex-col gap-3">
            {CONTENT.web.brainElements.techStack.map((tech, idx) => (
              <div key={tech.name} className="flex items-center gap-2 group" style={{animation: 'slideRight 0.6s ease-out backwards', animationDelay: `${0.2 + idx * 0.2}s`}}>
                {tech.icon === 'Server' && <Server className="w-8 h-8 text-blue-400 drop-shadow-lg group-hover:scale-110 transition-transform" 
                  style={{filter: 'drop-shadow(0 0 10px rgba(96, 165, 250, 0.5))'}} />}
                {tech.icon === 'Cloud' && <Cloud className="w-8 h-8 text-cyan-400 drop-shadow-lg group-hover:scale-110 transition-transform" 
                  style={{filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.5))'}} />}
                <span className="text-xs font-semibold text-blue-300 opacity-70">{tech.name}</span>
              </div>
            ))}
          </div>
          
          {/* Performance Metrics */}
          <div className="absolute bottom-[38%] left-[32%] bg-green-500/10 backdrop-blur-sm border border-green-400/30 
            rounded-md px-2 py-1 shadow-lg" style={{animation: 'float 3s ease-in-out infinite', animationDelay: '0.5s'}}>
            <div className="text-[10px] text-green-300 font-mono font-semibold">{CONTENT.web.brainElements.performance.label}</div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <div className="text-xl font-bold text-green-400">{CONTENT.web.brainElements.performance.score}</div>
              <div className="text-[10px] text-green-400 opacity-70">{CONTENT.web.brainElements.performance.max}</div>
            </div>
          </div>
          
          {/* Framework Badges */}
          <div className="absolute bottom-[48%] left-[8%] flex flex-col gap-1.5" style={{animation: 'fadeIn 0.8s ease-out 0.8s backwards'}}>
            {CONTENT.web.brainElements.frameworks.map((framework, idx) => (
              <div key={framework} className={`bg-gradient-to-r ${idx === 0 ? 'from-blue-600/30 to-cyan-600/30 border-blue-400/40 text-blue-200' : 'from-green-600/30 to-emerald-600/30 border-green-400/40 text-green-200'} backdrop-blur-sm border 
                rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-lg`}>{framework}</div>
            ))}
          </div>
          
          {/* Math/Algorithm Symbols */}
          <div className="absolute top-[42%] left-[36%] text-4xl text-indigo-400 opacity-40 font-serif" 
            style={{animation: 'float 5s ease-in-out infinite', textShadow: '0 0 20px rgba(129, 140, 248, 0.4)'}}>
            ∑
          </div>
          <div className="absolute bottom-[42%] left-[28%] text-3xl text-purple-400 opacity-40" 
            style={{animation: 'float 4s ease-in-out infinite', animationDelay: '1s'}}>
            λ
          </div>
        </div>
        
        {/* Handyman Creative Elements - RIGHT BRAIN - Only visible when Handyman is hovered */}
        <div className={`absolute inset-0 transition-all duration-1200 ${
          hoveredSide === 'handyman' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          {/* RIGHT BRAIN ELEMENTS - Creative/Spatial thinking */}
          
          {/* Professional Tool Set with Glow Effects */}
          <div className="absolute top-[22%] right-[16%] group">
            <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 group-hover:opacity-40 transition-all" />
            <Hammer className="relative w-14 h-14 text-yellow-400 drop-shadow-2xl" 
              style={{
                filter: 'drop-shadow(0 0 15px rgba(250, 204, 21, 0.6))',
                animation: 'bounce 2s ease-in-out infinite'
              }} />
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-yellow-300 opacity-70 font-semibold whitespace-nowrap">
              {CONTENT.handyman.brainElements.toolLabels.repairs}
            </div>
          </div>
          
          {/* Power Tool with Spin Effect */}
          <div className="absolute bottom-[32%] right-[24%] group">
            <div className="absolute inset-0 bg-orange-400 blur-xl opacity-20 group-hover:opacity-40 transition-all" />
            <Drill className="relative w-12 h-12 text-orange-400 drop-shadow-xl" 
              style={{
                transform: 'rotate(45deg)',
                filter: 'drop-shadow(0 0 12px rgba(251, 146, 60, 0.5))',
                animation: 'spin 8s linear infinite'
              }} />
          </div>
          
          {/* Precision Measuring Tool */}
          <div className="absolute bottom-[20%] right-[12%] group">
            <Ruler className="w-16 h-16 text-red-400 drop-shadow-xl opacity-80" 
              style={{
                transform: 'rotate(-30deg)',
                filter: 'drop-shadow(0 0 10px rgba(248, 113, 113, 0.4))'
              }} />
            <div className="absolute top-0 right-0 text-[10px] text-red-300 opacity-60 font-mono">{CONTENT.handyman.brainElements.toolLabels.measurements}</div>
          </div>
          
          {/* Smart Home Hub */}
          <div className="absolute top-[30%] right-[28%] bg-gradient-to-br from-purple-500/20 to-blue-500/20 
            backdrop-blur-sm border border-purple-400/30 rounded-xl p-3 shadow-2xl" 
            style={{animation: 'float 3s ease-in-out infinite'}}>
            <div className="flex items-center gap-2 mb-1.5">
              <Wifi className="w-5 h-5 text-purple-400 animate-pulse" />
              <span className="text-xs text-purple-200 font-semibold">{CONTENT.handyman.brainElements.smartHub.title}</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}} />
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.6s'}} />
            </div>
          </div>
          
          {/* Home Blueprint with Measurements */}
          <div className="absolute top-[15%] right-[32%]" style={{animation: 'fadeIn 0.8s ease-out 0.4s backwards'}}>
            <Home className="w-12 h-12 text-green-400 drop-shadow-xl" 
              style={{filter: 'drop-shadow(0 0 15px rgba(74, 222, 128, 0.4))'}} />
            {/* Measurement lines */}
            <div className="absolute -top-2 left-0 right-0 h-px bg-green-400/40" />
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-green-300 opacity-60 font-mono">{CONTENT.handyman.brainElements.toolLabels.dimensions}</div>
          </div>
          
          {/* Electrical/Smart System */}
          <div className="absolute bottom-[25%] right-[34%] group">
            <div className="absolute inset-0 bg-yellow-300 blur-xl opacity-30 animate-pulse" />
            <Zap className="relative w-10 h-10 text-yellow-300 drop-shadow-xl" 
              style={{
                filter: 'drop-shadow(0 0 15px rgba(253, 224, 71, 0.7))',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-yellow-200 opacity-70 whitespace-nowrap">
              {CONTENT.handyman.brainElements.toolLabels.voltage}
            </div>
          </div>
          
          {/* Blueprint Grid with Annotations */}
          <svg className="absolute top-[38%] right-[38%] w-24 h-24 opacity-20" style={{animation: 'fadeIn 1s ease-out 0.6s backwards'}}>
            <defs>
              <pattern id="blueprint-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(147, 197, 253, 0.4)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
            <circle cx="60" cy="60" r="15" fill="none" stroke="rgba(147, 197, 253, 0.5)" strokeWidth="1.5" />
            <line x1="10" y1="50" x2="40" y2="50" stroke="rgba(147, 197, 253, 0.6)" strokeWidth="1.5" />
          </svg>
          
          {/* Paint Color Palette */}
          <div className="absolute top-[12%] right-[20%] bg-white/10 backdrop-blur-sm rounded-lg p-2 shadow-xl border border-white/20" 
            style={{animation: 'slideDown 0.6s ease-out 0.3s backwards'}}>
            <PaintBucket className="w-8 h-8 text-blue-400 mb-1.5 drop-shadow-lg mx-auto" />
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-400 shadow-lg" />
              <div className="w-3 h-3 rounded-full bg-green-400 shadow-lg" />
              <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-lg" />
            </div>
            <div className="text-[9px] text-blue-200 opacity-70 mt-1 text-center">{CONTENT.handyman.brainElements.toolLabels.proPaint}</div>
          </div>
          
          {/* Security Badge */}
          <div className="absolute top-[52%] right-[14%] group">
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 group-hover:opacity-40 transition-all" />
            <Shield className="relative w-11 h-11 text-blue-500 drop-shadow-xl" 
              style={{filter: 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.5))'}} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-blue-100">✓</div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-blue-300 opacity-70 whitespace-nowrap">
              {CONTENT.handyman.brainElements.toolLabels.licensed}
            </div>
          </div>
          
          {/* Project Timeline */}
          <div className="absolute bottom-[42%] right-[28%] bg-gradient-to-r from-rose-500/20 to-pink-500/20 
            backdrop-blur-sm border border-rose-400/30 rounded-lg px-2.5 py-1.5 shadow-lg" 
            style={{animation: 'float 4s ease-in-out infinite', animationDelay: '0.8s'}}>
            <div className="text-[10px] text-rose-200 font-semibold mb-0.5">{CONTENT.handyman.brainElements.timeline.label}</div>
            <div className="flex gap-1">
              <div className="w-4 h-1 bg-rose-400 rounded-full" />
              <div className="w-4 h-1 bg-pink-400 rounded-full opacity-60" />
              <div className="w-4 h-1 bg-pink-400 rounded-full opacity-30" />
            </div>
            <div className="text-[9px] text-rose-300 opacity-70 mt-0.5">{CONTENT.handyman.brainElements.timeline.current}</div>
          </div>
          
          {/* Quality Badge */}
          <div className="absolute top-[58%] right-[24%] bg-gradient-to-br from-amber-500/20 to-orange-500/20 
            backdrop-blur-sm border border-amber-400/40 rounded-full px-3 py-1.5 shadow-lg" 
            style={{animation: 'fadeIn 0.8s ease-out 0.9s backwards'}}>
            <div className="flex items-center gap-1.5">
              <div className="text-amber-300 text-xl">★</div>
              <div>
                <div className="text-xs font-bold text-amber-200">{CONTENT.handyman.brainElements.quality.rating}</div>
                <div className="text-[8px] text-amber-300 opacity-70">{CONTENT.handyman.brainElements.quality.label}</div>
              </div>
            </div>
          </div>
          
          {/* Tool Belt / Equipment Indicator */}
          <div className="absolute bottom-[12%] right-[18%] flex gap-1.5" style={{animation: 'slideRight 0.6s ease-out 0.5s backwards'}}>
            <div className="bg-gray-700/30 backdrop-blur-sm rounded p-1.5 border border-gray-500/30">
              <Hammer className="w-4 h-4 text-yellow-300" />
            </div>
            <div className="bg-gray-700/30 backdrop-blur-sm rounded p-1.5 border border-gray-500/30">
              <Drill className="w-4 h-4 text-orange-300" />
            </div>
            <div className="bg-gray-700/30 backdrop-blur-sm rounded p-1.5 border border-gray-500/30">
              <Ruler className="w-4 h-4 text-red-300" />
            </div>
          </div>
          
          {/* Craftsman Badge */}
          <div className="absolute top-[68%] right-[32%] text-center" style={{animation: 'fadeIn 1s ease-out 1s backwards'}}>
            <div className="text-2xl text-amber-400 opacity-60 font-serif" style={{textShadow: '0 0 15px rgba(251, 191, 36, 0.4)'}}>
              ⚒
            </div>
            <div className="text-[9px] text-amber-300 opacity-60 font-semibold mt-0.5">{CONTENT.handyman.brainElements.toolLabels.craftsman}</div>
          </div>
        </div>
      </div>
      
      {/* Split Container */}
      <div className="relative h-full flex">
        
        {/* Handyman Side */}
        <div 
          data-world="handyman"
          className={`relative flex-1 transition-all duration-1200 ease-out cursor-pointer
            ${hoveredSide === 'handyman' ? 'flex-[1.5]' : 'flex-1'}
            ${hoveredSide === 'web' ? 'flex-[0.5]' : 'flex-1'}`}
          onMouseEnter={() => setHoveredSide('handyman')}
          onMouseLeave={() => setHoveredSide(null)}
          onClick={() => handleSelection('handyman')}
          style={{
            clipPath: hoveredSide === 'handyman' 
              ? 'polygon(0 0, 62% 0, 62% 100%, 0% 100%)'
              : hoveredSide === 'web'
              ? 'polygon(0 0, 35% 0, 35% 100%, 0% 100%)' 
              : 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'
          }}
        >
          {/* Background Gradient with adjustable opacity on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-primary transition-opacity duration-1200 ${
            hoveredSide === 'handyman' ? 'opacity-70' : 'opacity-90'
          }`} />
          
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
            }} />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center h-full px-8 text-white">
            <div className={`transform transition-all duration-1200 ${hoveredSide === 'handyman' ? 'scale-110 -translate-x-40' : 'scale-50'}`}>
              {/* Icon */}
              <div className="mb-6 relative">
                <div className="absolute inset-0 animate-ping">
                  <Wrench className="w-16 h-16 opacity-30" />
                </div>
                <Wrench className="w-16 h-16 relative z-10" />
              </div>

              {/* Title */}
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                {CONTENT.handyman.title}
              </h2>

              {/* Subtitle */}
              <p className={`text-lg mb-8 opacity-90 text-center max-w-sm transition-all duration-1200 ${
                hoveredSide === 'handyman' ? 'opacity-100' : 'opacity-80'
              }`}>
                {CONTENT.handyman.subtitle}
              </p>

              {/* Features - Only show on hover */}
              <div className={`transition-all duration-1200 overflow-hidden ${
                hoveredSide === 'handyman' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <ul className="space-y-2 mb-6">
                  {CONTENT.handyman.features.map((feature, index) => (
                    <li 
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                      style={{
                        animation: hoveredSide === 'handyman' ? `fade-in-up 0.5s ease-out ${index * 0.1}s backwards` : 'none'
                      }}
                    >
                      <Home className="w-4 h-4 opacity-70" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stats */}
              <div className={`flex gap-6 mb-8 transition-all duration-500 ${
                hoveredSide === 'handyman' ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-2'
              }`}>
                <div className="text-center">
                  <div className="text-2xl font-bold">{CONTENT.handyman.stats.experience.value}</div>
                  <div className="text-xs opacity-80">{CONTENT.handyman.stats.experience.label}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{CONTENT.handyman.stats.jobs.value}</div>
                  <div className="text-xs opacity-80">{CONTENT.handyman.stats.jobs.label}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{CONTENT.handyman.stats.pricing.value}</div>
                  <div className="text-xs opacity-80">{CONTENT.handyman.stats.pricing.label}</div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                className={`group flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg 
                  font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl
                  ${hoveredSide === 'handyman' ? 'scale-105' : 'scale-100'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelection('handyman');
                }}
              >
                {CONTENT.handyman.button}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Side Label (vertical) */}
          <div className={`absolute left-8 top-1/2 -translate-y-1/2 transition-opacity duration-500 ${
            hoveredSide === 'web' ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="text-white/50 text-sm font-medium tracking-[0.3em] uppercase" 
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
              {CONTENT.handyman.sideLabel}
            </div>
          </div>
        </div>

        {/* Web Dev Side */}
        <div 
          data-world="web"
          className={`relative flex-1 transition-all duration-1200 ease-out cursor-pointer
            ${hoveredSide === 'web' ? 'flex-[1.5]' : 'flex-1'}
            ${hoveredSide === 'handyman' ? 'flex-[0.5]' : 'flex-1'}`}
          onMouseEnter={() => setHoveredSide('web')}
          onMouseLeave={() => setHoveredSide(null)}
          onClick={() => handleSelection('web')}
          style={{
            clipPath: hoveredSide === 'web'
              ? 'polygon(39% 0, 100% 0, 100% 100%, 39% 100%)'
              : hoveredSide === 'handyman'
              ? 'polygon(65% 0, 100% 0, 100% 100%, 65% 100%)'
              : 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'
          }}
        >
          {/* Background Gradient with green/citrus colors and adjustable opacity */}
          <div className={`absolute inset-0 transition-opacity duration-700 ${
            hoveredSide === 'web' ? 'opacity-70' : 'opacity-90'
          }`} style={{
            background: 'linear-gradient(to bottom left, #059669, #10b981, #F59E0B)'
          }} />
          
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
            }} />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center items-center h-full px-8 text-white">
            <div className={`transform transition-all duration-1200 ${hoveredSide === 'web' ? 'scale-110 translate-x-60' : 'scale-50'}`}>
              {/* Icon */}
              <div className="mb-6 relative">
                <div className="absolute inset-0 animate-ping">
                  <Code className="w-16 h-16 opacity-30" />
                </div>
                <Code className="w-16 h-16 relative z-10" />
              </div>

              {/* Title */}
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                {CONTENT.web.title}
              </h2>

              {/* Subtitle */}
              <p className={`text-lg mb-8 opacity-90 text-center max-w-sm transition-all duration-1200 ${
                hoveredSide === 'web' ? 'opacity-100' : 'opacity-80'
              }`}>
                {CONTENT.web.subtitle}
              </p>

              {/* Features - Only show on hover */}
              <div className={`transition-all duration-1200 overflow-hidden ${
                hoveredSide === 'web' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <ul className="space-y-2 mb-6">
                  {CONTENT.web.features.map((feature, index) => (
                    <li 
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                      style={{
                        animation: hoveredSide === 'web' ? `fade-in-up 0.5s ease-out ${index * 0.1}s backwards` : 'none'
                      }}
                    >
                      <Laptop className="w-4 h-4 opacity-70" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stats */}
              <div className={`flex gap-6 mb-8 transition-all duration-500 ${
                hoveredSide === 'web' ? 'opacity-100 translate-y-0' : 'opacity-60 translate-y-2'
              }`}>
                <div className="text-center">
                  <div className="text-2xl font-bold">{CONTENT.web.stats.education.value}</div>
                  <div className="text-xs opacity-80">{CONTENT.web.stats.education.label}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{CONTENT.web.stats.sites.value}</div>
                  <div className="text-xs opacity-80">{CONTENT.web.stats.sites.label}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{CONTENT.web.stats.pricing.value}</div>
                  <div className="text-xs opacity-80">{CONTENT.web.stats.pricing.label}</div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                className={`group flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 rounded-lg 
                  font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl
                  ${hoveredSide === 'web' ? 'scale-105' : 'scale-100'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelection('web');
                }}
              >
                {CONTENT.web.button}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Side Label (vertical) */}
          <div className={`absolute right-8 top-1/2 -translate-y-1/2 transition-opacity duration-500 ${
            hoveredSide === 'handyman' ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="text-white/50 text-sm font-medium tracking-[0.3em] uppercase" 
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
              {CONTENT.web.sideLabel}
            </div>
          </div>
        </div>

        {/* Center Divider & Badge - Removed since we're using clipPath */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none z-20">
          
          {/* Center Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full" />
              <div className="relative bg-white/90 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 shadow-2xl">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Wrench className="w-8 h-8 text-primary" />
                    <Code className="w-4 h-4 text-secondary absolute -bottom-1 -right-1" />
                  </div>
                  <span className="text-xl font-bold text-near-black">
                    {CONTENT.brand.name}<span className="text-primary">{CONTENT.brand.nameSuffix}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-xs md:hidden">
          {CONTENT.ui.mobileHint}
        </div>

        {/* Desktop Hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-xs hidden md:block">
          {CONTENT.ui.desktopHint}
        </div>
      </div>

    </div>
  );
};

export default SplitLanding;
