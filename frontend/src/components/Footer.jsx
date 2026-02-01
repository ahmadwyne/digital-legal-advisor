import { Link } from "react-router-dom";
import { Scale, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowRight, Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative w-full overflow-hidden">
      

      {/* Main Footer */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          ></div>
          
          {/* Floating Orbs */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-float-slow"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 relative z-10">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Logo & Description */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-6 group">
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Scale className="w-7 h-7 text-white" strokeWidth={2.5} />
                  <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"></div>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-2xl font-extrabold text-white" style={{ fontFamily: "Poppins" }}>
                    Digital Legal
                  </span>
                  <span className="text-sm font-semibold text-blue-200 -mt-1" style={{ fontFamily: "Inter" }}>
                    Advisor
                  </span>
                </div>
              </Link>
              <p className="text-blue-100 text-sm leading-relaxed mb-6" style={{ fontFamily: "Inter" }}>
                Empowering you with AI-powered legal guidance. Simplifying Pakistani financial laws for everyone.
              </p>
              
              {/* Social Icons */}
              <div className="flex gap-3">
                {[
                  { icon: Facebook, link: "#" },
                  { icon: Twitter, link: "#" },
                  { icon: Linkedin, link: "#" },
                  { icon: Instagram, link: "#" }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 border border-white/20"
                  >
                    <social.icon className="w-5 h-5" strokeWidth={2} />
                  </a>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-white text-lg font-bold mb-6 flex items-center gap-2" style={{ fontFamily: "Poppins" }}>
                <span className="w-1 h-6 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-full"></span>
                Company
              </h4>
              <div className="flex flex-col gap-3">
                {[
                  { name: "Home", path: "/" },
                  { name: "Features", path: "/platform" },
                  { name: "About Us", path: "/about" },
                  { name: "Contact", path: "/contact" }
                ].map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.path}
                    className="group text-blue-100 hover:text-white text-sm flex items-center gap-2 transition-all duration-300"
                    style={{ fontFamily: "Inter" }}
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all duration-300" />
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-white text-lg font-bold mb-6 flex items-center gap-2" style={{ fontFamily: "Poppins" }}>
                <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></span>
                Support
              </h4>
              <div className="flex flex-col gap-3">
                {[
                  { name: "FAQs", path: "/faqs" },
                  { name: "Help Center", path: "/help" },
                  { name: "Privacy Policy", path: "/privacy" },
                  { name: "Terms of Service", path: "/terms" }
                ].map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.path}
                    className="group text-blue-100 hover:text-white text-sm flex items-center gap-2 transition-all duration-300"
                    style={{ fontFamily: "Inter" }}
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all duration-300" />
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white text-lg font-bold mb-6 flex items-center gap-2" style={{ fontFamily: "Poppins" }}>
                <span className="w-1 h-6 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full"></span>
                Get in Touch
              </h4>
              <div className="flex flex-col gap-4">
                <a href="mailto:info@digitallegal.pk" className="group flex items-start gap-3 text-blue-100 hover:text-white transition-colors duration-300">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-all duration-300">
                    <Mail className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <span className="text-sm" style={{ fontFamily: "Inter" }}>
                    info@digitallegal.pk
                  </span>
                </a>
                
                <a href="tel:+923137263488" className="group flex items-start gap-3 text-blue-100 hover:text-white transition-colors duration-300">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-all duration-300">
                    <Phone className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <span className="text-sm" style={{ fontFamily: "Inter" }}>
                    +92 313 7263488
                  </span>
                </a>
                
                <div className="group flex items-start gap-3 text-blue-100">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <span className="text-sm" style={{ fontFamily: "Inter" }}>
                    FAST NUCES Lahore<br />
                    Pakistan
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="border-t border-white/10 pt-12 pb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-white text-2xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2" style={{ fontFamily: "Poppins" }}>
                  <Sparkles className="w-6 h-6 text-amber-400" />
                  Stay Updated
                </h3>
                <p className="text-blue-100 text-sm" style={{ fontFamily: "Inter" }}>
                  Subscribe to our newsletter for legal insights & updates
                </p>
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 transition-all duration-300 w-full md:w-64"
                  style={{ fontFamily: "Inter" }}
                />
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2" style={{ fontFamily: "Inter" }}>
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-blue-200 text-sm text-center md:text-left" style={{ fontFamily: "Inter" }}>
                © 2025 Digital Legal Advisor. All rights reserved. | FAST NUCES Lahore F25-028
              </p>
              
              <div className="flex gap-6 text-sm">
                <Link to="/privacy" className="text-blue-200 hover:text-white transition-colors duration-300" style={{ fontFamily: "Inter" }}>
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-blue-200 hover:text-white transition-colors duration-300" style={{ fontFamily: "Inter" }}>
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;