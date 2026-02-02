import svgPaths from '../imports/svg-xd1tsi0116';
import imgLogo from 'figma:asset/d1ded1ef97341d22cc623f272a0e79ef5a7bf8b4.png';
import { useLanguage } from '../contexts/LanguageContext';
import { Menu, X, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

function MaterialSymbolsCallOutline() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path d={svgPaths.p1df8f200} fill="white" />
        </g>
      </svg>
    </div>
  );
}

interface NavbarProps {
  onNavigate?: () => void;
  onNavigateToAbout?: () => void;
  onNavigateToContact?: () => void;
  onNavigateToNewHeliopolis?: () => void;
  onNavigateToBeitelWatan?: () => void;
  currentPage?: 'home' | 'new-heliopolis' | 'beit-el-watan' | 'about' | 'contact';
}

export function Navbar({ onNavigate, onNavigateToAbout, onNavigateToContact, onNavigateToNewHeliopolis, onNavigateToBeitelWatan, currentPage = 'home' }: NavbarProps) {
  const { language, toggleLanguage, t } = useLanguage();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  const scrollToSection = (sectionId: string) => {
    setIsDrawerOpen(false);
    if (onNavigate) {
      onNavigate();
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleAboutClick = () => {
    setIsDrawerOpen(false);
    if (onNavigateToAbout) {
      onNavigateToAbout();
    }
  };

  const handleContactClick = () => {
    setIsDrawerOpen(false);
    if (onNavigateToContact) {
      onNavigateToContact();
    }
  };

  const handleNewHeliopolisClick = () => {
    setIsDrawerOpen(false);
    if (onNavigateToNewHeliopolis) {
      onNavigateToNewHeliopolis();
    }
  };

  const handleBeitelWatanClick = () => {
    setIsDrawerOpen(false);
    if (onNavigateToBeitelWatan) {
      onNavigateToBeitelWatan();
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[70px] py-3 md:py-[17px]">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button 
              onClick={() => {
                setIsDrawerOpen(false);
                if (onNavigate) onNavigate();
              }} 
              className="h-[50px] w-[98px] md:h-[64px] md:w-[126px] relative shrink-0"
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img 
                  alt="Al-Fouad Real Estate" 
                  className="absolute h-[198.44%] left-[-0.17%] max-w-none top-[-48.44%] w-[100.35%]" 
                  src={imgLogo} 
                />
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-[32px]">
              {/* Nav Links */}
              <div className="flex gap-[44px] items-center text-[20px] text-black">
                <button 
                  onClick={() => scrollToSection('home')}
                  className={`hover:text-[#a74b48] transition-colors text-[16px] ${currentPage === 'home' ? 'text-[#a74b48] font-semibold' : ''}`}
                >
                  {t('nav.home')}
                </button>
                <button 
                  onClick={handleNewHeliopolisClick}
                  className={`hover:text-[#a74b48] transition-colors text-[16px] ${currentPage === 'new-heliopolis' ? 'text-[#a74b48] font-semibold' : ''}`}
                >
                  {t('nav.newHeliopolis')}
                </button>
                <button 
                  onClick={handleBeitelWatanClick}
                  className={`hover:text-[#a74b48] transition-colors text-[16px] ${currentPage === 'beit-el-watan' ? 'text-[#a74b48] font-semibold' : ''}`}
                >
                  {t('nav.beitElWatan')}
                </button>
                <button 
                  onClick={handleAboutClick}
                  className={`hover:text-[#a74b48] transition-colors text-[16px] ${currentPage === 'about' ? 'text-[#a74b48] font-semibold' : ''}`}
                >
                  {t('nav.about')}
                </button>
              </div>

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#a74b48] text-[#a74b48] hover:bg-[#a74b48] hover:text-white transition-all duration-200 font-medium"
              >
                <span className="text-[16px]">{language === 'en' ? 'AR' : 'EN'}</span>
              </button>

              {/* Contact Button */}
              <button 
                onClick={onNavigateToContact}
                className="flex gap-[10px] h-[44px] items-center justify-center px-[20px] py-[10px] rounded-[59px] text-white text-[16px] hover:opacity-90 transition-opacity"
                style={{ backgroundImage: "linear-gradient(112.588deg, rgb(205, 35, 35) 22.591%, rgb(175, 5, 8) 113.07%)" }}
              >
                <MaterialSymbolsCallOutline />
                {t('nav.contact')}
              </button>
            </div>

            {/* Mobile/Tablet: Hamburger Menu Button */}
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isDrawerOpen ? (
                <X className="w-6 h-6 text-black" />
              ) : (
                <Menu className="w-6 h-6 text-black" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div 
        className={`fixed top-0 ${language === 'ar' ? 'left-0' : 'right-0'} h-full w-[280px] bg-white z-[70] transform transition-transform duration-300 ease-in-out lg:hidden shadow-2xl ${
          isDrawerOpen 
            ? 'translate-x-0' 
            : language === 'ar' ? '-translate-x-full' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="h-[50px] w-[98px] relative">
            <img 
              alt="Al-Fouad Real Estate" 
              className="w-full h-full object-contain" 
              src={imgLogo} 
            />
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex flex-col p-6 gap-2">
          {/* Navigation Links */}
          <button 
            onClick={() => scrollToSection('home')}
            className={`text-left px-4 py-3 text-[16px] text-black hover:bg-gray-50 hover:text-[#a74b48] rounded-lg transition-all ${currentPage === 'home' ? 'bg-gray-50 text-[#a74b48]' : ''}`}
          >
            {t('nav.home')}
          </button>
          
          <button 
            onClick={handleNewHeliopolisClick}
            className={`text-left px-4 py-3 text-[16px] text-black hover:bg-gray-50 hover:text-[#a74b48] rounded-lg transition-all ${currentPage === 'new-heliopolis' ? 'bg-gray-50 text-[#a74b48]' : ''}`}
          >
            {t('nav.newHeliopolis')}
          </button>
          
          <button 
            onClick={handleBeitelWatanClick}
            className={`text-left px-4 py-3 text-[16px] text-black hover:bg-gray-50 hover:text-[#a74b48] rounded-lg transition-all ${currentPage === 'beit-el-watan' ? 'bg-gray-50 text-[#a74b48]' : ''}`}
          >
            {t('nav.beitElWatan')}
          </button>
          
          <button 
            onClick={handleAboutClick}
            className="text-left px-4 py-3 text-[16px] text-black hover:bg-gray-50 hover:text-[#a74b48] rounded-lg transition-all"
          >
            {t('nav.about')}
          </button>

          {/* Divider */}
          <div className="my-4 border-t border-gray-200"></div>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-[#a74b48] text-[#a74b48] hover:bg-[#a74b48] hover:text-white transition-all duration-200 font-medium"
          >
            <span className="text-[16px]">{language === 'en' ? 'العربية' : 'English'}</span>
            <span className="text-[14px] opacity-75">({language === 'en' ? 'AR' : 'EN'})</span>
          </button>

          {/* Contact Button */}
          <button 
            onClick={handleContactClick}
            className="flex gap-[10px] items-center justify-center px-[20px] py-[12px] rounded-[59px] text-white text-[16px] font-medium hover:opacity-90 transition-opacity mt-2"
            style={{ backgroundImage: "linear-gradient(112.588deg, rgb(205, 35, 35) 22.591%, rgb(175, 5, 8) 113.07%)" }}
          >
            <Phone className="w-5 h-5" />
            {t('nav.contact')}
          </button>
        </div>
      </div>
    </>
  );
}