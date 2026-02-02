import { useState, useEffect } from 'react';
import { LogOut, Building2, Home, FileText, MessageSquare, BarChart3, Map, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { CitiesManager } from './CitiesManager';
import { BuildingsManager } from './BuildingsManager';
import { UnitsManager } from './UnitsManager';
import { ContentManager } from './ContentManager';
import { InquiriesManager } from './InquiriesManager';

interface AdminDashboardProps {
  onLogout: () => void;
}

type TabType = 'cities' | 'buildings' | 'units' | 'content' | 'inquiries';

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('cities');
  const [user, setUser] = useState<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const menuItems = [
    { id: 'cities' as TabType, label: 'Cities', icon: Map, description: 'Manage cities and projects' },
    { id: 'buildings' as TabType, label: 'Buildings', icon: Building2, description: 'Manage buildings' },
    { id: 'units' as TabType, label: 'Units', icon: Home, description: 'Manage property units' },
    { id: 'inquiries' as TabType, label: 'Inquiries', icon: MessageSquare, description: 'View contact form inquiries' },
    { id: 'content' as TabType, label: 'Content', icon: FileText, description: 'Manage website content' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 transition-all duration-300 fixed lg:sticky top-0 h-screen z-40 ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Sidebar Header */}
        <div className="h-20 border-b border-gray-200 flex items-center justify-between px-6">
          <div className={`flex items-center gap-3 transition-opacity ${sidebarCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            <div className="w-10 h-10 bg-[#a74b48] rounded-lg flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-[16px] font-bold text-black whitespace-nowrap">Al-Fouad Admin</h1>
              <p className="text-[11px] text-[#666] whitespace-nowrap">Real Estate</p>
            </div>
          </div>
          
          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-160px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#a74b48] text-white shadow-lg shadow-[#a74b48]/20'
                    : 'text-[#666] hover:bg-gray-100 hover:text-black'
                }`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                {!sidebarCollapsed && (
                  <div className="flex-1 text-left">
                    <div className={`text-[15px] font-semibold ${isActive ? 'text-white' : ''}`}>
                      {item.label}
                    </div>
                    <div className={`text-[12px] ${isActive ? 'text-white/80' : 'text-[#999]'}`}>
                      {item.description}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
          <div className="p-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex w-full items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-[14px] font-semibold">Collapse</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div>
              <h2 className="text-[20px] lg:text-[24px] font-bold text-black">
                {menuItems.find(item => item.id === activeTab)?.label}
              </h2>
              <p className="text-[13px] lg:text-[14px] text-[#666]">
                {menuItems.find(item => item.id === activeTab)?.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-[14px] font-semibold text-black">{user?.email}</p>
              <p className="text-[12px] text-[#666]">Administrator</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-[14px] font-semibold">Logout</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto">
            {activeTab === 'cities' && <CitiesManager />}
            {activeTab === 'buildings' && <BuildingsManager />}
            {activeTab === 'units' && <UnitsManager />}
            {activeTab === 'inquiries' && <InquiriesManager />}
            {activeTab === 'content' && <ContentManager />}
          </div>
        </main>
      </div>
    </div>
  );
}
