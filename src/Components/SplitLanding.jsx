import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Code, ArrowRight, Sparkles, Home, Laptop, Database, Globe, Server, Hammer, Drill, PaintBucket, Ruler, Zap, Shield, Cpu, Terminal, Cloud, Wifi, GitBranch, FileCode, Braces, Activity } from 'lucide-react';

// Lazy load QuantumSphere for performance
const QuantumSphere = lazy(() => import('./QuantumSphere'));

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
      jobs: { value: '500+', label: 'Projects' },
      pricing: { value: '$195', label: 'Starting' }
    },
    button: 'Handyman Services',
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
    },
    
    // Element Positioning - Edit these to adjust layout
    elementPositions: {
      hammer: { top: '22%', right: '16%' },
      drill: { bottom: '32%', right: '24%' },
      ruler: { bottom: '20%', right: '12%' },
      smartHub: { top: '30%', right: '28%' },
      home: { top: '15%', right: '32%' },
      electrical: { bottom: '25%', right: '34%' },
      paintBucket: { top: '12%', right: '20%' },
      shield: { top: '52%', right: '14%' },
      timeline: { bottom: '32%', right: '28%' },
      blueprint: { top: '38%', right: '38%' }
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
    button: 'Web Services',
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
    },
    
    // Element Positioning - Edit these to adjust layout
    elementPositions: {
      codeBlock: { top: '18%', left: '12%' },
      terminal: { top: '25%', left: '20%' },
      gitBranch: { bottom: '35%', left: '18%' },
      binary: { top: '35%', left: '8%' },
      reactTree: { top: '28%', left: '32%' },
      database: { bottom: '28%', left: '14%' },
      api: { top: '48%', left: '26%' },
      techStackNode: { bottom: '18%', left: '8%' },
      techStackAWS: { bottom: '15%', left: '24%' },
      performance: { bottom: '38%', left: '32%' },
      frameworks: { bottom: '48%', left: '8%' },
      mathSymbol1: { top: '42%', left: '36%' },
      mathSymbol2: { bottom: '42%', left: '28%' }
    }
  },
  
  // UI Labels
  ui: {
    mobileHint: 'Tap to select your service',
    desktopHint: 'Hover & click to enter • Use arrow keys to navigate'
  }
};

// ============================================================================
// CUSTOM LOOPING TYPEWRITER FOR MISSION STATEMENT
// ============================================================================

const useLoopingTypewriter = (texts, typingSpeed = 40, pauseDuration = 2000, erasingSpeed = 20) => {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentText = texts[textIndex];

    if (isTyping) {
      // Typing phase
      if (charIndex < currentText.length) {
        const timer = setTimeout(() => {
          setDisplayText(currentText.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, typingSpeed);
        return () => clearTimeout(timer);
      } else {
        // Finished typing, pause before erasing
        const timer = setTimeout(() => {
          setIsTyping(false);
          setCharIndex(currentText.length);
        }, pauseDuration);
        return () => clearTimeout(timer);
      }
    } else {
      // Erasing phase
      if (charIndex > 0) {
        const timer = setTimeout(() => {
          setDisplayText(currentText.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, erasingSpeed);
        return () => clearTimeout(timer);
      } else {
        // Finished erasing, move to next text
        setIsTyping(true);
        setTextIndex((textIndex + 1) % texts.length);
      }
    }
  }, [charIndex, isTyping, textIndex, texts, typingSpeed, pauseDuration, erasingSpeed]);

  return { displayText, isTyping };
};

// ============================================================================
// QUANTUM ELEMENTS CONFIGURATION
// ============================================================================

// Left Brain Elements - Logical/Analytical (Web Dev)
const leftBrainElements = [
  { icon: Code, label: 'Code', color: '#10b981' },
  { icon: Database, label: 'Database', color: '#a855f7' },
  { icon: Terminal, label: 'Terminal', color: '#06b6d4' },
  { icon: GitBranch, label: 'Git', color: '#ec4899' },
  { icon: Server, label: 'Node.js', color: '#3b82f6' },
  { icon: Cloud, label: 'AWS', color: '#22d3ee' },
  { icon: FileCode, label: 'API', color: '#f97316' },
  { icon: Activity, label: 'Performance', color: '#84cc16' }
];

// Right Brain Elements - Creative/Spatial (Handyman)
const rightBrainElements = [
  { icon: Hammer, label: 'Repairs', color: '#fbbf24' },
  { icon: Drill, label: 'Power Tools', color: '#fb923c' },
  { icon: Ruler, label: 'Precision', color: '#f87171' },
  { icon: Wifi, label: 'Smart Home', color: '#a78bfa' },
  { icon: Home, label: 'Home Setup', color: '#4ade80' },
  { icon: Zap, label: 'Electrical', color: '#fde047' },
  { icon: PaintBucket, label: 'Paint', color: '#60a5fa' },
  { icon: Shield, label: 'Licensed', color: '#3b82f6' }
];

// ============================================================================
// COMPONENT
// ============================================================================

// Mobile breakpoint constant for easy management
const MOBILE_BREAKPOINT = 768;

const SplitLanding = () => {
  const [hoveredSide, setHoveredSide] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);
  const navigate = useNavigate();
  
  // Looping typewriter for mission statement
  const missionTexts = [
    "I didn't want to choose between coding and craftsmanship - so I didn't.",
    "SMB's & homeowners deserve solutions driven from a unified ethos - not just another technician."
  ];
  const { displayText: missionText, isTyping } = useLoopingTypewriter(missionTexts, 60, 2500, 20);

  useEffect(() => {
    // Handle resize for mobile detection
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    window.addEventListener('resize', handleResize);
    
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
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSelection = (world) => {
    // Store the selection for future reference
    localStorage.setItem('qh_world', world);
    localStorage.setItem('qh_entry_timestamp', new Date().toISOString());
    
    // Add fade out animation
    setIsLoaded(false);
    
    // Navigate to world-specific URL
    setTimeout(() => {
      navigate(`/${world}/`);
    }, 300);
  };

  return (
    <div className={`fixed inset-0 bg-near-black overflow-hidden transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Dual Brain Images with QuantumSphere Integration */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        {/* Left Brain - Web Dev Side */}
        <div 
          className={`absolute w-full h-full flex items-center justify-center transition-all duration-1200 ${
            hoveredSide === 'web' ? 'opacity-100 z-20' : 'opacity-40 z-10'
          }`}
          style={{
            transform: `translateX(${
              hoveredSide === 'web' 
                ? 'calc(-17% - 15px)' 
                : isMobile 
                  ? 'calc(-7% - 30px)' 
                  : '-6%'
            })`
          }}
        >
          <div className="relative">
            <img 
              src="/left_brain.png" 
              alt="" 
              className={`h-[300px] md:h-[400px] lg:h-[500px] object-contain transition-all duration-1200 ${
                hoveredSide === 'web' ? 'md:scale-110 scale-105' : 'scale-100'
              }`}
              style={{ 
                filter: `drop-shadow(0 0 ${hoveredSide === 'web' ? '50px' : '15px'} rgba(16, 185, 129, 0.4))`
              }}
            />
            {/* QuantumSphere for Left Brain - Only visible when Web is hovered */}
            {hoveredSide === 'web' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: 'translateX(-50px)' }}>
                <Suspense fallback={<div className="animate-pulse" />}>
                  <QuantumSphere 
                    customElements={leftBrainElements}
                    scale={1}
                    sphereScale={isMobile ? 0.7 : 0.88}
                    opacityDepth="deep"
                    className="pointer-events-auto"
                  >
                    <div className="opacity-0" />
                  </QuantumSphere>
                </Suspense>
              </div>
            )}
          </div>
        </div>

        {/* Right Brain - Handyman Side */}
        <div 
          className={`absolute w-full h-full flex items-center justify-center transition-all duration-1200 ${
            hoveredSide === 'handyman' ? 'opacity-100 z-20' : 'opacity-40 z-10'
          }`}
          style={{
            transform: `translateX(${
              hoveredSide === 'handyman' 
                ? 'calc(17% + 15px)' 
                : isMobile 
                  ? 'calc(10% + 30px)' 
                  : '6%'
            })`
          }}
        >
          <div className="relative">
            <img 
              src="/right_brain.png" 
              alt="" 
              className={`h-[300px] md:h-[400px] lg:h-[500px] object-contain transition-all duration-1200 ${
                hoveredSide === 'handyman' ? 'md:scale-110 scale-105' : 'scale-100'
              }`}
              style={{ 
                filter: `drop-shadow(0 0 ${hoveredSide === 'handyman' ? '50px' : '15px'} rgba(251, 191, 36, 0.4))`
              }}
            />
            {/* QuantumSphere for Right Brain - Only visible when Handyman is hovered */}
            {hoveredSide === 'handyman' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: 'translateX(50px)' }}>
                <Suspense fallback={<div className="animate-pulse" />}>
                  <QuantumSphere 
                    customElements={rightBrainElements}
                    scale={1}
                    sphereScale={isMobile ? 0.75 : 1}
                    opacityDepth="deep"
                    className="pointer-events-auto"
                  >
                    <div className="opacity-0" />
                  </QuantumSphere>
                </Suspense>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Split Container */}
      <div className="relative h-full flex">
        
        {/* Handyman Side */}
        <div 
          data-world="handyman"
          className={`relative flex-1 transition-all duration-1200 ease-out cursor-default
            ${hoveredSide === 'handyman' ? 'flex-[1.5]' : 'flex-1'}
            ${hoveredSide === 'web' ? 'flex-[0.5]' : 'flex-1'}`}
          onMouseEnter={() => setHoveredSide('handyman')}
          onMouseLeave={() => setHoveredSide(null)}
          onClick={() => setHoveredSide(hoveredSide === 'handyman' ? null : 'handyman')}
          style={{
            clipPath: hoveredSide === 'handyman' 
              ? isMobile ? 'polygon(0 0, 80% 0, 80% 100%, 0% 100%)' : 'polygon(0 0, 62% 0, 62% 100%, 0% 100%)'
              : hoveredSide === 'web'
              ? isMobile ? 'polygon(0 0, 10% 0, 10% 100%, 0% 100%)' : 'polygon(0 0, 35% 0, 35% 100%, 0% 100%)' 
              : isMobile ? 'polygon(0 0, 80% 0, 80% 100%, 0% 100%)' :'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'
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
            <div className={`transform transition-all duration-1200 ${hoveredSide === 'handyman' ? isMobile ? 'scale-90 -translate-x-6' : 'scale-110 -translate-x-40' : 'scale-50'} ${hoveredSide === 'web' ? 'opacity-0' : 'opacity-100'}`}>
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
                  font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer
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

          {/* Side Label (vertical) - Hidden on mobile */}
          {!isMobile && (
            <div className={`absolute left-8 top-1/2 -translate-y-1/2 transition-opacity duration-500 ${
              hoveredSide === 'web' ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="text-white/50 text-sm font-medium tracking-[0.3em] uppercase" 
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                {CONTENT.handyman.sideLabel}
              </div>
            </div>
          )}
        </div>

        {/* Web Dev Side */}
        <div 
          data-world="web"
          className={`relative flex-1 transition-all duration-1200 ease-out
            ${hoveredSide === 'web' ? 'flex-[1.5]' : 'flex-1'}
            ${hoveredSide === 'handyman' ? 'flex-[0.5]' : 'flex-1'}`}
          onMouseEnter={() => setHoveredSide('web')}
          onMouseLeave={() => setHoveredSide(null)}
          onClick={() => setHoveredSide(hoveredSide === 'web' ? null : 'web')}
          style={{
            clipPath: hoveredSide === 'web'
              ? 'polygon(0% 0, 100% 0, 100% 100%, 0% 100%)'
              : hoveredSide === 'handyman'
              ? isMobile ? 'polygon(68% 0, 100% 0, 100% 100%, 68% 100%)' : 'polygon(65% 0, 100% 0, 100% 100%, 65% 100%)'
              : 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
            transform: isMobile ? 'translateX(-20%)' : undefined
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
            <div className={`transform transition-all duration-1200 ${hoveredSide === 'web' ? isMobile ? 'scale-90 -translate-x-8' : 'scale-110 translate-x-60' : 'scale-50'} ${hoveredSide === 'handyman' ? 'opacity-0' : 'opacity-100'}`}>
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
                  font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer
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

          {/* Side Label (vertical) - Hidden on mobile */}
          {!isMobile && (
            <div className={`absolute right-8 top-1/2 -translate-y-1/2 transition-opacity duration-500 ${
              hoveredSide === 'handyman' ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="text-white/50 text-sm font-medium tracking-[0.3em] uppercase z-50" 
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                {CONTENT.web.sideLabel}
              </div>
            </div>
          )}
        </div>

        {/* Center Divider & Badge - Repositioned for mobile */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none z-20">
          
          {/* Center Logo - Higher on mobile */}
          <div className="absolute left-1/2 top-20 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 flex flex-col items-center gap-2 md:gap-4">
            <div className="relative scale-75 md:scale-100">
              <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full" />
              <div className="relative bg-white/90 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-full border border-white/30 shadow-2xl">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Wrench className="w-6 md:w-8 h-6 md:h-8 text-primary" />
                    <Code className="w-3 md:w-4 h-3 md:h-4 text-secondary absolute -bottom-1 -right-1" />
                  </div>
                  <span className="text-lg md:text-xl font-bold text-near-black">
                    {CONTENT.brand.name}<span className="text-primary">{CONTENT.brand.nameSuffix}</span>
                  </span>
                </div>
              </div>
            </div>
            
            {/* Mission Statement Below - Hidden on very small screens */}
            <div className="hidden sm:block bg-gray-800/80 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-lg shadow-lg max-w-[280px] md:max-w-md">
              <p className="text-[10px] md:text-sm text-white text-center leading-snug min-h-[2rem] md:min-h-[2.5rem] flex items-center justify-center">
                <span>
                  {missionText}
                  {isTyping && (
                    <span className="inline-block w-0.5 h-3 md:h-4 bg-gray-800 animate-pulse ml-0.5" />
                  )}
                </span>
              </p>
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
