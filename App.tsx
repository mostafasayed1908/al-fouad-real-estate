import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FilterCard } from './components/FilterCard';
import { CitiesSection } from './components/CitiesSection';
import { AchievementsSection } from './components/AchievementsSection';
import { BuildingsMap } from './components/BuildingsMap';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSales } from './components/ContactSales';
import { Footer } from './components/Footer';
import { CityDetails } from './components/CityDetails';
import { BuildingDetails } from './components/BuildingDetails';
import { UnitDetails } from './components/UnitDetails';
import { AboutUs } from './components/AboutUs';
import { SearchResults, SearchFilters } from './components/SearchResults';
import { ContactUs } from './components/ContactUs';
import { PropertiesPage } from './components/PropertiesPage';
import { ConstructionTimeline } from './components/ConstructionTimeline';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { getCities } from './utils/supabase/queries';
import type { City } from './utils/supabase/client';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { supabase } from './utils/supabase/client';

// Main App Component - Al-Fouad Real Estate Investment
function AppContent() {
  const languageContext = useLanguage();
  const { dir, t } = languageContext;
  
  const [currentPage, setCurrentPage] = useState<'home' | 'city' | 'building' | 'unit' | 'about' | 'search' | 'contact' | 'properties' | 'timeline' | 'admin'>('home');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters | undefined>(undefined);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    async function fetchCities() {
      setLoading(true);
      const data = await getCities();
      setCities(data);
      setLoading(false);
    }
    fetchCities();

    // Check for existing admin session
    checkAdminSession();
  }, []);

  const checkAdminSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setIsAdminLoggedIn(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentPage('home');
  };

  const handleViewCity = (cityId: string) => {
    setSelectedCity(cityId);
    setCurrentPage('city');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewBuilding = (buildingId: string) => {
    setSelectedBuilding(buildingId);
    setCurrentPage('building');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewUnit = (unitId: string) => {
    setSelectedUnit(unitId);
    setCurrentPage('unit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    setCurrentPage('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCity = () => {
    setCurrentPage('city');
    setSelectedBuilding('');
    setSelectedUnit('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedCity('');
    setSelectedBuilding('');
    setSelectedUnit('');
    setSearchFilters(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToAbout = () => {
    setCurrentPage('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToContact = () => {
    setCurrentPage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToProperties = () => {
    setCurrentPage('properties');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToTimeline = () => {
    setCurrentPage('timeline');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToNewHeliopolis = () => {
    const newHeliopolisCity = cities.find(c => c.id === 'new-heliopolis');
    if (newHeliopolisCity) {
      setSelectedCity('new-heliopolis');
      setCurrentPage('city');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateToBeitelWatan = () => {
    const beitelWatanCity = cities.find(c => c.id === 'bait-el-watan');
    if (beitelWatanCity) {
      setSelectedCity('bait-el-watan');
      setCurrentPage('city');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAdminLogin = () => {
    setCurrentPage('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir={dir}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#a74b48] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#666] text-[18px]">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" dir={dir}>
      {currentPage === 'home' ? (
        <>
          <Navbar 
            onNavigate={handleBackToHome} 
            onNavigateToAbout={handleNavigateToAbout} 
            onNavigateToContact={handleNavigateToContact}
            onNavigateToNewHeliopolis={handleNavigateToNewHeliopolis}
            onNavigateToBeitelWatan={handleNavigateToBeitelWatan}
            currentPage="home"
          />
          <HeroSection onNavigateToProperties={handleNavigateToProperties} />
          <FilterCard onSearch={handleSearch} />
          <AchievementsSection />
          <CitiesSection cities={cities} onViewCity={handleViewCity} />
          <BuildingsMap cities={cities} />
          <TestimonialsSection />
          <ContactSales />
          <Footer onNavigateToAbout={handleNavigateToAbout} onNavigateToContact={handleNavigateToContact} onNavigateToTimeline={handleNavigateToTimeline} onNavigateToAdmin={handleAdminLogin} />
        </>
      ) : currentPage === 'city' ? (
        <>
          <Navbar 
            onNavigate={handleBackToHome} 
            onNavigateToAbout={handleNavigateToAbout} 
            onNavigateToContact={handleNavigateToContact}
            onNavigateToNewHeliopolis={handleNavigateToNewHeliopolis}
            onNavigateToBeitelWatan={handleNavigateToBeitelWatan}
            currentPage={selectedCity === 'new-heliopolis' ? 'new-heliopolis' : selectedCity === 'bait-el-watan' ? 'beit-el-watan' : 'home'}
          />
          <CityDetails 
            cityId={selectedCity} 
            onBackToHome={handleBackToHome}
            onViewBuilding={handleViewBuilding}
          />
          <Footer onNavigateToAbout={handleNavigateToAbout} onNavigateToContact={handleNavigateToContact} onNavigateToTimeline={handleNavigateToTimeline} onNavigateToAdmin={handleAdminLogin} />
        </>
      ) : currentPage === 'building' ? (
        <>
          <Navbar 
            onNavigate={handleBackToHome} 
            onNavigateToAbout={handleNavigateToAbout} 
            onNavigateToContact={handleNavigateToContact}
            onNavigateToNewHeliopolis={handleNavigateToNewHeliopolis}
            onNavigateToBeitelWatan={handleNavigateToBeitelWatan}
            currentPage="home"
          />
          <BuildingDetails 
            buildingId={selectedBuilding}
            onBackToCity={handleBackToCity}
            onBackToHome={handleBackToHome}
            onViewUnit={handleViewUnit}
          />
          <Footer onNavigateToAbout={handleNavigateToAbout} onNavigateToContact={handleNavigateToContact} onNavigateToTimeline={handleNavigateToTimeline} onNavigateToAdmin={handleAdminLogin} />
        </>
      ) : currentPage === 'unit' ? (
        <>
          <Navbar 
            onNavigate={handleBackToHome} 
            onNavigateToAbout={handleNavigateToAbout} 
            onNavigateToContact={handleNavigateToContact}
            onNavigateToNewHeliopolis={handleNavigateToNewHeliopolis}
            onNavigateToBeitelWatan={handleNavigateToBeitelWatan}
            currentPage="home"
          />
          <UnitDetails 
            unitId={selectedUnit}
            onBack={handleBackToCity}
            onBackToHome={handleBackToHome}
          />
          <Footer onNavigateToAbout={handleNavigateToAbout} onNavigateToContact={handleNavigateToContact} onNavigateToTimeline={handleNavigateToTimeline} onNavigateToAdmin={handleAdminLogin} />
        </>
      ) : currentPage === 'about' ? (
        <>
          <Navbar 
            onNavigate={handleBackToHome} 
            onNavigateToAbout={handleNavigateToAbout} 
            onNavigateToContact={handleNavigateToContact}
            onNavigateToNewHeliopolis={handleNavigateToNewHeliopolis}
            onNavigateToBeitelWatan={handleNavigateToBeitelWatan}
            currentPage="about"
          />
          <AboutUs onBackToHome={handleBackToHome} />
          <Footer onNavigateToAbout={handleNavigateToAbout} onNavigateToContact={handleNavigateToContact} onNavigateToTimeline={handleNavigateToTimeline} onNavigateToAdmin={handleAdminLogin} />
        </>
      ) : currentPage === 'contact' ? (
        <>
          <Navbar 
            onNavigate={handleBackToHome} 
            onNavigateToAbout={handleNavigateToAbout} 
            onNavigateToContact={handleNavigateToContact}
            onNavigateToNewHeliopolis={handleNavigateToNewHeliopolis}
            onNavigateToBeitelWatan={handleNavigateToBeitelWatan}
            currentPage="contact"
          />
          <ContactUs onNavigateHome={handleBackToHome} />
          <Footer onNavigateToAbout={handleNavigateToAbout} onNavigateToContact={handleNavigateToContact} onNavigateToTimeline={handleNavigateToTimeline} onNavigateToAdmin={handleAdminLogin} />
        </>
      ) : currentPage === 'properties' ? (
        <>
          <Navbar 
            onNavigate={handleBackToHome} 
            onNavigateToAbout={handleNavigateToAbout} 
            onNavigateToContact={handleNavigateToContact}
            onNavigateToNewHeliopolis={handleNavigateToNewHeliopolis}
            onNavigateToBeitelWatan={handleNavigateToBeitelWatan}
            currentPage="home"
          />
          <PropertiesPage onViewUnit={handleViewUnit} onNavigateHome={handleBackToHome} />
          <Footer onNavigateToAbout={handleNavigateToAbout} onNavigateToContact={handleNavigateToContact} onNavigateToTimeline={handleNavigateToTimeline} onNavigateToAdmin={handleAdminLogin} />
        </>
      ) : currentPage === 'timeline' ? (
        <>
          <Navbar 
            onNavigate={handleBackToHome} 
            onNavigateToAbout={handleNavigateToAbout} 
            onNavigateToContact={handleNavigateToContact}
            onNavigateToNewHeliopolis={handleNavigateToNewHeliopolis}
            onNavigateToBeitelWatan={handleNavigateToBeitelWatan}
            currentPage="home"
          />
          <ConstructionTimeline onNavigateHome={handleBackToHome} />
          <Footer onNavigateToAbout={handleNavigateToAbout} onNavigateToContact={handleNavigateToContact} onNavigateToTimeline={handleNavigateToTimeline} onNavigateToAdmin={handleAdminLogin} />
        </>
      ) : currentPage === 'admin' ? (
        <>
          {isAdminLoggedIn ? (
            <AdminDashboard onLogout={handleAdminLogout} />
          ) : (
            <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />
          )}
        </>
      ) : (
        <>
          <Navbar 
            onNavigate={handleBackToHome} 
            onNavigateToAbout={handleNavigateToAbout} 
            onNavigateToContact={handleNavigateToContact}
            onNavigateToNewHeliopolis={handleNavigateToNewHeliopolis}
            onNavigateToBeitelWatan={handleNavigateToBeitelWatan}
            currentPage="home"
          />
          <SearchResults 
            onBackToHome={handleBackToHome}
            onViewUnit={handleViewUnit}
            initialFilters={searchFilters}
          />
          <Footer onNavigateToAbout={handleNavigateToAbout} onNavigateToContact={handleNavigateToContact} onNavigateToTimeline={handleNavigateToTimeline} onNavigateToAdmin={handleAdminLogin} />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}