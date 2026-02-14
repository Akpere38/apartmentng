import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-navy-900 to-slate-900 text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-display font-bold">Apartment NG</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Nigeria's premier short-let apartment marketplace. Discover your perfect stay with curated luxury accommodations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-teal-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-teal-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-teal-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-teal-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-slate-400 hover:text-teal-400 transition-colors text-sm">
                  Browse Apartments
                </Link>
              </li>
              <li>
                <Link to="/agent/register" className="text-slate-400 hover:text-teal-400 transition-colors text-sm">
                  Become an Agent
                </Link>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-teal-400 transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-teal-400 transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* For Partners */}
          <div>
            <h4 className="text-lg font-semibold mb-4">For Partners</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/agent/login" className="text-slate-400 hover:text-teal-400 transition-colors text-sm">
                  Agent Portal
                </Link>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-teal-400 transition-colors text-sm">
                  List Your Property
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-teal-400 transition-colors text-sm">
                  Partnership Terms
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm text-slate-400">
                <MapPin className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <span>Lagos, Nigeria</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-slate-400">
                <Phone className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <span>+234 800 000 0000</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-slate-400">
                <Mail className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <span>hello@apartmentng.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-slate-400 text-sm">
            © {currentYear} Apartment NG. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-slate-400 hover:text-teal-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-400 hover:text-teal-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-slate-400 hover:text-teal-400 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;