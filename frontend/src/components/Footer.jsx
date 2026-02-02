import { Link } from "react-router-dom";
import { Scale, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowRight, Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative w-full overflow-hidden">
      

      {/* Main Footer - White Background */}
      <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          ></div>
          
          {/* Floating Orbs */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-float-slow"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 relative z-10">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Logo & Description */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-6 group">
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Scale className="w-7 h-7 text-white" strokeWidth={2.5} />
                  <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"></div>
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-800 to-indigo-700 bg-clip-text text-transparent" style={{ fontFamily: "Poppins" }}>
                    Digital Legal
                  </span>
                  <span className="text-sm font-semibold text-blue-600 -mt-1" style={{ fontFamily: "Inter" }}>
                    Advisor
                  </span>
                </div>
              </Link>
              <p className="text-gray-700 text-sm leading-relaxed mb-6" style={{ fontFamily: "Inter" }}>
                Empowering you with AI-powered legal guidance. Simplifying Pakistani financial laws for everyone.
              </p>
              
              {/* Social Icons */}
              <div className="flex gap-3">
                {[
                  { icon: Facebook, link: "#", color: "from-blue-500 to-blue-600" },
                  { icon: Twitter, link: "#", color: "from-sky-500 to-blue-500" },
                  { icon: Linkedin, link: "#", color: "from-blue-600 to-indigo-600" },
                  { icon: Instagram, link: "#", color: "from-pink-500 to-purple-600" }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 bg-gradient-to-br ${social.color} rounded-xl flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-all duration-300`}
                  >
                    <social.icon className="w-5 h-5" strokeWidth={2} />
                  </a>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-gray-800 text-lg font-bold mb-6 flex items-center gap-2" style={{ fontFamily: "Poppins" }}>
                <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></span>
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
                    className="group text-gray-600 hover:text-blue-600 text-sm flex items-center gap-2 transition-all duration-300 font-medium"
                    style={{ fontFamily: "Inter" }}
                  >
                    <ArrowRight className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all duration-300" />
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-gray-800 text-lg font-bold mb-6 flex items-center gap-2" style={{ fontFamily: "Poppins" }}>
                <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full"></span>
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
                    className="group text-gray-600 hover:text-amber-600 text-sm flex items-center gap-2 transition-all duration-300 font-medium"
                    style={{ fontFamily: "Inter" }}
                  >
                    <ArrowRight className="w-4 h-4 text-amber-500 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all duration-300" />
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-gray-800 text-lg font-bold mb-6 flex items-center gap-2" style={{ fontFamily: "Poppins" }}>
                <span className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></span>
                Get in Touch
              </h4>
              <div className="flex flex-col gap-4">
                <a href="mailto:info@digitallegal.pk" className="group flex items-start gap-3 text-gray-600 hover:text-blue-600 transition-colors duration-300">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition-all duration-300">
                    <Mail className="w-4 h-4 text-blue-600" strokeWidth={2} />
                  </div>
                  <span className="text-sm font-medium" style={{ fontFamily: "Inter" }}>
                    info@digitallegal.pk
                  </span>
                </a>
                
                <a href="tel:+923137263488" className="group flex items-start gap-3 text-gray-600 hover:text-blue-600 transition-colors duration-300">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-green-200 transition-all duration-300">
                    <Phone className="w-4 h-4 text-green-600" strokeWidth={2} />
                  </div>
                  <span className="text-sm font-medium" style={{ fontFamily: "Inter" }}>
                    +92 313 7263488
                  </span>
                </a>
                
                <div className="group flex items-start gap-3 text-gray-600">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-purple-600" strokeWidth={2} />
                  </div>
                  <span className="text-sm font-medium" style={{ fontFamily: "Inter" }}>
                    FAST NUCES Lahore<br />
                    Pakistan
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="border-t-2 border-gray-200 pt-12 pb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-gray-800 text-2xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2" style={{ fontFamily: "Poppins" }}>
                  <Sparkles className="w-6 h-6 text-amber-500" />
                  Stay Updated
                </h3>
                <p className="text-gray-600 text-sm font-medium" style={{ fontFamily: "Inter" }}>
                  Subscribe to our newsletter for legal insights & updates
                </p>
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 w-full md:w-64 shadow-sm"
                  style={{ fontFamily: "Inter" }}
                />
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2" style={{ fontFamily: "Inter" }}>
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t-2 border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-600 text-sm text-center md:text-left font-medium" style={{ fontFamily: "Inter" }}>
                © 2025 Digital Legal Advisor. All rights reserved. | FAST NUCES Lahore F25-028
              </p>
              
              <div className="flex gap-6 text-sm">
                <Link to="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium" style={{ fontFamily: "Inter" }}>
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium" style={{ fontFamily: "Inter" }}>
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