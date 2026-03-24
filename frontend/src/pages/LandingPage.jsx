import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Users,
  BookOpen,
  Scale,
  ChevronDown,
  CheckCircle,
  Star,
  Brain,
  Lock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// Component for Built For Everyone Cards
const BuiltForCard = ({ item }) => {
  const [cardRef, cardVisible] = useScrollAnimation(0.1);
  
  return (
    <div 
      ref={cardRef}
      className={`bg-white p-8 rounded-3xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-500 transform hover:scale-110 group text-center scroll-animate-scale ${cardVisible ? 'visible' : ''}`}
      style={{ transitionDelay: item.delay }}
    >
      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 text-white shadow-xl group-hover:scale-125 group-hover:rotate-[360deg] transition-all duration-700 animate-gradient-flow bg-[length:200%_auto]">
        <item.icon className="w-8 h-8" strokeWidth={2.5} />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300" style={{ fontFamily: "Poppins" }}>{item.title}</h3>
      <p className="text-gray-700 leading-relaxed font-medium" style={{ fontFamily: "Inter" }}>{item.desc}</p>
    </div>
  );
};

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Scroll animation refs
  const [whatIsDlaRef, whatIsDlaVisible] = useScrollAnimation(0.1);
  const [card1Ref, card1Visible] = useScrollAnimation(0.1);
  const [card2Ref, card2Visible] = useScrollAnimation(0.1);
  const [card3Ref, card3Visible] = useScrollAnimation(0.1);
  const [builtForRef, builtForVisible] = useScrollAnimation(0.1);
  const [whyUsRef, whyUsVisible] = useScrollAnimation(0.1);
  const [whyCard1Ref, whyCard1Visible] = useScrollAnimation(0.1);
  const [whyCard2Ref, whyCard2Visible] = useScrollAnimation(0.1);
  const [whyCard3Ref, whyCard3Visible] = useScrollAnimation(0.1);
  const [whyCard4Ref, whyCard4Visible] = useScrollAnimation(0.1);
  const [ctaRef, ctaVisible] = useScrollAnimation(0.1);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full bg-white overflow-x-hidden">
      <Header />

      {/* ========================================
          HERO SECTION
          ======================================== */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-bg-enhanced pt-12 pb-0"
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden"style={{ willChange: 'transform' }}>
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(59, 130, 246, 0.4) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(59, 130, 246, 0.4) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
              animation: "float 20s ease-in-out infinite",
            }}
          ></div>

          <div className="absolute top-10 -left-20 w-96 h-96 bg-gradient-to-br from-blue-400/25 to-amber-400/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-amber-100/30 to-yellow-200/25 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-[450px] h-[450px] bg-gradient-to-br from-orange-300/20 to-amber-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
          <div className="absolute bottom-10 left-1/3 w-[400px] h-[400px] bg-gradient-to-br from-indigo-400/20 to-amber-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-yellow-300/25 to-orange-400/25 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: "1.5s" }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-amber-600/15 to-yellow-300/15 rounded-full blur-3xl animate-pulse"></div>

          <div className="absolute top-32 left-1/4 w-3 h-3 bg-blue-500 rounded-full animate-bounce-slow shadow-lg shadow-blue-500/50"></div>
          <div className="absolute top-48 right-1/3 w-4 h-4 bg-amber-500 rounded-full animate-bounce-slow shadow-lg shadow-amber-500/50" style={{ animationDelay: "0.5s" }}></div>
          <div className="absolute bottom-32 right-1/4 w-2 h-2 bg-indigo-500 rounded-full animate-bounce-slow shadow-lg shadow-indigo-500/50" style={{ animationDelay: "3s" }}></div>
          <div className="absolute top-1/3 right-1/5 w-3 h-3 bg-yellow-500 rounded-full animate-bounce-slow shadow-lg shadow-yellow-500/50" style={{ animationDelay: "0.3s" }}></div>
          <div className="absolute bottom-1/3 left-1/5 w-4 h-4 bg-orange-500 rounded-full animate-bounce-slow shadow-lg shadow-orange-500/50" style={{ animationDelay: "0.7s" }}></div>
        </div>

        <div className="max-w-7xl w-full px-6 sm:px-12 relative z-10 py-12">
          <div className="text-center max-w-6xl mx-auto">
            <div className={`mb-6 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
              <span className="inline-flex items-center gap-2 px-4 py-2.5 relative overflow-hidden rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-100 via-amber-50 to-purple-100 animate-gradient-flow bg-[length:200%_auto]"></span>
                <span className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-r from-blue-600 via-amber-500 to-blue-700 animate-gradient-flow bg-[length:200%_auto] -z-10"></span>
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                  <span className="bg-gradient-to-r from-blue-800 via-amber-500 to-blue-900 bg-clip-text text-transparent font-extrabold text-xs sm:text-sm tracking-wide animate-gradient-flow bg-[length:200%_auto]">
                    SECURING YOUR LEGAL FUTURE
                  </span>
                </span>
              </span>
            </div>

            <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.15] mb-5 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ fontFamily: "Poppins", animationDelay: "0.1s" }}>
              <span className="text-gray-800">Legal solution for real</span>
              <br />
              <span className="relative inline-block mt-2">
                <span className="bg-gradient-to-r from-blue-800 via-blue-500 to-blue-900 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-flow">
                  guidance you can trust
                </span>
                <svg className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3" viewBox="0 0 500 12" fill="none">
                  <path d="M2 10C150 2, 350 2, 498 10" stroke="url(#gradient-enhanced-gold)" strokeWidth="3" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="gradient-enhanced-gold" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1e3a8a"><animate attributeName="stop-color" values="#1e3a8a; #3b82f6; #f59e0b; #1e3a8a" dur="4s" repeatCount="indefinite" /></stop>
                      <stop offset="50%" stopColor="#f59e0b"><animate attributeName="stop-color" values="#f59e0b; #fbbf24; #3b82f6; #f59e0b" dur="3s" repeatCount="indefinite" /></stop>
                      <stop offset="100%" stopColor="#1e40af"><animate attributeName="stop-color" values="#1e40af; #f59e0b; #1e3a8a; #1e40af" dur="4s" repeatCount="indefinite" /></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            <p className={`text-base sm:text-lg md:text-xl leading-relaxed max-w-4xl mx-auto mb-8 font-medium ${isVisible ? "animate-fade-in" : "opacity-0"}`} style={{ fontFamily: "Inter", animationDelay: "0.2s" }}>
              <span className="text-gray-800">Empowering citizens and legal professionals with</span>{" "}
              <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 bg-clip-text text-transparent font-bold animate-gradient-flow bg-[length:200%_auto]">instant, reliable,</span>{" "}
              <span className="text-gray-800">and simplified legal guidance powered by</span>{" "}
              <span className="bg-gradient-to-r from-blue-600 via-amber-600 to-indigo-700 bg-clip-text text-transparent font-bold animate-gradient-flow bg-[length:200%_auto]">AI.</span>
            </p>

            <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 ${isVisible ? "animate-scale-in" : "opacity-0"}`} style={{ animationDelay: "0.3s" }}>
              <Link to="/platform" className="group relative px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-xl text-base font-bold hover:from-blue-800 hover:to-blue-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 animate-pulse-glow flex items-center gap-2 overflow-hidden" style={{ fontFamily: "Inter" }}>
                <span className="relative z-10 flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  View Platform
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </Link>

              <Link to="/signup" className="group px-6 py-3 glass-effect border-2 border-blue-300 text-blue-700 rounded-xl text-base font-bold hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2" style={{ fontFamily: "Inter" }}>
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                Get Started Free
              </Link>
            </div>

            <div className={`flex flex-col items-center gap-2 mb-0 ${isVisible ? "animate-fade-in" : "opacity-0"}`} style={{ animationDelay: "0.5s" }}>
              <button onClick={() => scrollToSection("what-is-dla")} aria-label="Scroll down" className="text-blue-600 hover:text-amber-600 transition-colors flex flex-col items-center gap-1 group">
                <span className="text-md font-semibold" style={{ fontFamily: "Inter" }}>Scroll to explore</span>
                <ChevronDown size={30} className="animate-bounce group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* WAVE AT BOTTOM */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none">
          <svg className="w-full" viewBox="0 0 1440 100" preserveAspectRatio="none" style={{ display: "block", height: "100px" }}>
            <path d="M0,50 C360,100 720,0 1080,50 C1260,75 1350,100 1440,100 L1440,100 L0,100 Z" fill="#e0f2fe" />
          </svg>
        </div>
      </section>

      {/* ========================================
          WHAT IS DLA - WITH SCROLL ANIMATIONS
          ======================================== */}
      <section id="what-is-dla" className="relative py-24 sm:py-32 overflow-hidden pb-0" style={{ background: "linear-gradient(to bottom, #e0f2fe 0%, #f0f9ff 50%, #e0f2fe 100%)" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.4) 1px, transparent 1px)`, backgroundSize: "60px 60px" }}></div>
          <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-amber-300/20 to-yellow-400/20 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-gradient-to-br from-blue-300/15 to-indigo-400/15 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-orange-300/15 to-amber-400/15 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 mb-20">
          <div 
            ref={whatIsDlaRef}
            className={`text-center mb-10 scroll-animate ${whatIsDlaVisible ? 'visible' : ''}`}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 via-amber-50 to-blue-100 border-2 border-blue-200 rounded-full text-sm font-bold tracking-wider mb-4 shadow-lg animate-gradient-flow bg-[length:200%_auto]" style={{ fontFamily: "Inter" }}>
              <Star className="w-4 h-4 text-amber-500" />
              <span className="bg-gradient-to-r from-blue-700 via-amber-600 to-blue-800 bg-clip-text text-transparent">OUR CORE MISSION</span>
            </span>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6" style={{ fontFamily: "Poppins" }}>
              What is <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-slate-600 bg-clip-text text-transparent animate-gradient-flow bg-[length:200%_auto]">Digital Legal Advisor</span>?
            </h2>

            <div className="w-20 h-1.5 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 mx-auto rounded-full mb-8 animate-gradient-flow bg-[length:200%_auto]"></div>

            <p className="text-xl md:text-2xl text-gray-800 max-w-3xl mx-auto leading-relaxed font-medium" style={{ fontFamily: "Inter" }}>
              An AI-powered platform that offers quick, reliable guidance on Pakistani financial laws, simplifying complex legal documents and providing clear answers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div 
              ref={card1Ref}
              className={`group glass-effect p-8 rounded-3xl border-2 border-white/50 hover:border-blue-300 shadow-xl hover:shadow-2xl transition-all duration-1000 hover:-translate-y-4 scroll-animate-left ${card1Visible ? 'visible' : ''}`}
            >
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000">
                <Shield className="w-8 h-8 text-white" strokeWidth={2.5} />
                <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors duration-300" style={{ fontFamily: "Poppins" }}>Secure & Confidential</h3>
              <p className="text-gray-700 leading-relaxed font-medium" style={{ fontFamily: "Inter" }}>Enterprise-grade encryption protecting your sensitive legal data.</p>
            </div>

            {/* Card 2 */}
            <div 
              ref={card2Ref}
              className={`group glass-effect p-8 rounded-3xl border-2 border-white/50 hover:border-blue-300 shadow-xl hover:shadow-2xl transition-all duration-1000 hover:-translate-y-4 scroll-animate ${card2Visible ? 'visible' : ''}`}
            >
              <div className="relative w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000">
                <Brain className="w-8 h-8 text-white" strokeWidth={2.5} />
                <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors duration-300" style={{ fontFamily: "Poppins" }}>AI-Powered Intelligence</h3>
              <p className="text-gray-700 leading-relaxed font-medium" style={{ fontFamily: "Inter" }}>Trained specifically on Pakistani financial laws for accurate guidance.</p>
            </div>

            {/* Card 3 */}
            <div 
              ref={card3Ref}
              className={`group glass-effect p-8 rounded-3xl border-2 border-white/50 hover:border-blue-300 shadow-xl hover:shadow-2xl transition-all duration-1000 hover:-translate-y-4 scroll-animate-right ${card3Visible ? 'visible' : ''}`}
            >
              <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-1200">
                <BookOpen className="w-8 h-8 text-white" strokeWidth={2.5} />
                <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors duration-300" style={{ fontFamily: "Poppins" }}>Legal Encyclopedia</h3>
              <p className="text-gray-700 leading-relaxed font-medium" style={{ fontFamily: "Inter" }}>Instant access to thousands of case precedents and legal documents.</p>
            </div>
          </div>
        </div>

        {/* WAVE AT BOTTOM */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none">
          <svg className="w-full" viewBox="0 0 1440 100" preserveAspectRatio="none" style={{ display: "block", height: "100px" }}>
            <path d="M0,0 C360,0 720,100 1080,50 C1260,25 1350,0 1440,0 L1440,100 L0,100 Z" fill="url(#wave2)" />
            <defs>
              <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="50%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#4338ca" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* ========================================
          BUILT FOR EVERYONE - WITH SCROLL ANIMATIONS
          ======================================== */}
      <section className="relative py-24 overflow-hidden pb-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`, backgroundSize: "60px 60px" }}></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-float"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-float-slow"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 mb-20">
          <div 
            ref={builtForRef}
            className={`text-center mb-16 scroll-animate ${builtForVisible ? 'visible' : ''}`}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white" style={{ fontFamily: "Poppins" }}>
              Built for <span className="bg-gradient-to-r from-blue-300 via-blue-200 to-indigo-300 bg-clip-text text-transparent animate-gradient-flow bg-[length:200%_auto]">Everyone</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "Citizens", desc: "Everyday individuals needing legal clarity.", delay: "300ms" },
              { icon: BookOpen, title: "Students", desc: "Law students bridging theory with practice.", delay: "500ms" },
              { icon: Scale, title: "Professionals", desc: "Lawyers streamlining research.", delay: "700ms" },
              { icon: Lock, title: "Firms", desc: "Agencies automating workflows.", delay: "900ms" },
            ].map((item, idx) => (
              <BuiltForCard key={idx} item={item} />
            ))}
          </div>
        </div>

        {/* WAVE AT BOTTOM */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none">
          <svg className="w-full" viewBox="0 0 1440 100" preserveAspectRatio="none" style={{ display: "block", height: "100px" }}>
            <path d="M0,50 C360,100 720,0 1080,50 C1260,75 1350,100 1440,100 L1440,100 L0,100 Z" fill="#e0f2fe" />
          </svg>
        </div>
      </section>

      {/* ========================================
          WHY CHOOSE US - WITH SCROLL ANIMATIONS
          ======================================== */}
      <section className="relative py-24 overflow-hidden pb-0 gradient-bg-enhanced">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gradient-to-br from-amber-300/20 to-orange-400/20 rounded-full blur-3xl animate-float-slow"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 mb-20">
          <div 
            ref={whyUsRef}
            className={`text-center mb-16 scroll-animate ${whyUsVisible ? 'visible' : ''}`}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 via-amber-50 to-blue-100 border-2 border-blue-200 rounded-full text-sm font-bold tracking-wider mb-6 shadow-lg animate-gradient-flow bg-[length:200%_auto]" style={{ fontFamily: "Inter" }}>
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="bg-gradient-to-r from-blue-700 via-amber-600 to-blue-800 bg-clip-text text-transparent">THE ADVANTAGE</span>
            </span>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black" style={{ fontFamily: "Poppins" }}>
              Why choose <span className="bg-gradient-to-r from-blue-800 via-blue-500 to-blue-900 bg-clip-text text-transparent animate-gradient-flow bg-[length:200%_auto]">Us</span>?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              ref={whyCard1Ref}
              className={`group glass-effect p-8 md:p-12 rounded-[2rem] border-2 border-blue-100 hover:border-blue-400 hover:shadow-2xl transition-all duration-500 scroll-animate-left ${whyCard1Visible ? 'visible' : ''}`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl flex items-center justify-center mb-6 font-bold text-xl font-mono shadow-lg group-hover:scale-110 transition-transform duration-300">01</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-700 transition-colors duration-300" style={{ fontFamily: "Poppins" }}>AI-Powered Guidance</h3>
              <p className="text-gray-700 mb-6 font-medium" style={{ fontFamily: "Inter" }}>Get instant answers trained on Pakistani financial laws.</p>
              <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
              </div>
            </div>

            <div 
              ref={whyCard2Ref}
              className={`group glass-effect p-8 md:p-12 rounded-[2rem] border-2 border-blue-100 hover:border-blue-400 hover:shadow-2xl transition-all duration-500 scroll-animate-right ${whyCard2Visible ? 'visible' : ''}`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl flex items-center justify-center mb-6 font-bold text-xl font-mono shadow-lg group-hover:scale-110 transition-transform duration-300">02</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-700 transition-colors duration-300" style={{ fontFamily: "Poppins" }}>Simplified Language</h3>
              <p className="text-gray-700 mb-6 font-medium" style={{ fontFamily: "Inter" }}>Complex legal documents made easy to read.</p>
              <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div 
                ref={whyCard3Ref}
                className={`glass-effect p-8 rounded-[2rem] border-2 border-amber-100 shadow-lg flex items-center gap-6 group hover:-translate-y-3 hover:shadow-2xl hover:border-amber-300 transition-all duration-500 scroll-animate ${whyCard3Visible ? 'visible' : ''}`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                  <Shield className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-amber-700 transition-colors duration-300" style={{ fontFamily: "Poppins" }}>100% Secure</h3>
                  <p className="text-gray-600 text-sm font-medium" style={{ fontFamily: "Inter" }}>Your data is encrypted & safe.</p>
                </div>
              </div>

              <div 
                ref={whyCard4Ref}
                className={`glass-effect p-8 rounded-[2rem] border-2 border-amber-100 shadow-lg flex items-center gap-6 group hover:-translate-y-3 hover:shadow-2xl hover:border-amber-300 transition-all duration-500 scroll-animate ${whyCard4Visible ? 'visible' : ''}`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shrink-0 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                  <CheckCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-amber-700 transition-colors duration-300" style={{ fontFamily: "Poppins" }}>Always Updated</h3>
                  <p className="text-gray-600 text-sm font-medium" style={{ fontFamily: "Inter" }}>Latest legal statutes & cases.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WAVE AT BOTTOM */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none">
          <svg className="w-full" viewBox="0 0 1440 100" preserveAspectRatio="none" style={{ display: "block", height: "100px" }}>
            <path d="M0,0 C360,0 720,100 1080,50 C1260,25 1350,0 1440,0 L1440,100 L0,100 Z" fill="url(#wave-why-us)" />
            <defs>
              <linearGradient id="wave-why-us" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e0f2fe" />
                <stop offset="50%" stopColor="#dbeafe" />
                <stop offset="100%" stopColor="#e0f2fe" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* ========================================
          FINAL CTA - WITH SCROLL ANIMATION
          ======================================== */}
      <section className="relative py-28 overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-[120px] animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-amber-400/15 to-orange-500/15 rounded-full blur-[120px] animate-float-slow"></div>
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-indigo-400/15 to-purple-500/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`, backgroundSize: '60px 60px' }}></div>

        <div 
          ref={ctaRef}
          className={`max-w-4xl mx-auto px-6 sm:px-12 relative z-10 text-center scroll-animate ${ctaVisible ? 'visible' : ''}`}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 shadow-xl">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="text-white text-sm font-bold tracking-wide" style={{ fontFamily: "Inter" }}>
              Join 10,000+ Satisfied Users
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight" style={{ fontFamily: "Poppins" }}>
            Ready to <span className="bg-gradient-to-r from-amber-800 via-yellow-400 to-amber-700 bg-clip-text text-transparent animate-gradient-flow bg-[length:200%_auto]">Get Started</span>?
          </h2>

          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed font-medium" style={{ fontFamily: "Inter" }}>
            Join thousands of users who trust Digital Legal Advisor. Start your free trial today!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/signup" 
              className="group relative px-12 py-5 bg-white text-blue-900 rounded-2xl text-xl font-bold hover:bg-amber-50 hover:scale-105 transition-all duration-300 shadow-2xl flex items-center gap-3 overflow-hidden"
              style={{ fontFamily: "Inter" }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-amber-500 group-hover:rotate-[360deg] transition-transform duration-700" />
                Start Free Trial
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-yellow-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>

            <Link 
              to="/contact" 
              className="group px-12 py-5 bg-transparent border-2 border-white/40 text-white rounded-2xl text-xl font-bold hover:bg-white/10 hover:border-amber-300 hover:scale-105 transition-all duration-300 backdrop-blur-sm shadow-xl"
              style={{ fontFamily: "Inter" }}
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
