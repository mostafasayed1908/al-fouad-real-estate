import { Mail, Phone, MapPin } from 'lucide-react';
import logo from 'figma:asset/d1ded1ef97341d22cc623f272a0e79ef5a7bf8b4.png';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  onNavigateToAbout?: () => void;
  onNavigateToContact?: () => void;
  onNavigateToTimeline?: () => void;
  onNavigateToAdmin?: () => void;
}

export function Footer({ onNavigateToAbout, onNavigateToContact, onNavigateToTimeline, onNavigateToAdmin }: FooterProps) {
  const { t } = useLanguage();
  
  const navLinks = [
    { name: t('nav.home'), href: '#home', action: null },
    { name: t('nav.newHeliopolis'), href: '#new-heliopolis', action: null },
    { name: t('nav.beitElWatan'), href: '#bait-el-watan', action: null },
    { name: t('nav.about'), href: '#about', action: onNavigateToAbout },
    { name: t('footer.timeline'), href: '#timeline', action: onNavigateToTimeline },
    { name: t('nav.contact'), href: '#contact', action: onNavigateToContact }
  ];

  return (
    <footer id="contact" className="bg-black text-white py-12 md:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-12 mb-8 md:mb-10 lg:mb-12">
          {/* Logo and Description */}
          <div>
            <div className="mb-3 md:mb-4">
              <img src={logo} alt="Al-Fouad Real Estate" className="h-10 md:h-12 brightness-0 invert" />
            </div>
            <p className="text-gray-400 leading-relaxed text-[14px] md:text-[15px] lg:text-[16px]">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[16px] md:text-[17px] lg:text-lg font-semibold mb-3 md:mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 md:space-y-3">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#a74b48] transition-colors"
                    onClick={link.action}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact.title')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#a74b48] mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  {t('footer.contact.location')}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#a74b48] flex-shrink-0" />
                <span className="text-gray-400">+20 123 456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#a74b48] flex-shrink-0" />
                <span className="text-gray-400">info@alfouad-realestate.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              {t('footer.copyright')}
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#privacy" className="hover:text-[#a74b48] transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-[#a74b48] transition-colors">
                Terms of Service
              </a>
              {/* Hidden Admin Link - Subtle styling to blend in */}
              <a 
                href="#admin" 
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateToAdmin?.();
                }}
                className="text-gray-700 hover:text-gray-500 transition-colors opacity-30 hover:opacity-100"
                title="Admin Panel"
              >
                •
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}