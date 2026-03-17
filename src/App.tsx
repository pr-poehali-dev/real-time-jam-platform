import { useState } from 'react';
import Icon from '@/components/ui/icon';
import AudioBars from '@/components/AudioBars';
import HomePage from '@/pages/HomePage';
import CatalogPage from '@/pages/CatalogPage';
import StudioPage from '@/pages/StudioPage';
import ProfilePage from '@/pages/ProfilePage';
import SongbookPage from '@/pages/SongbookPage';
import SettingsPage from '@/pages/SettingsPage';
import LoginPage from '@/pages/LoginPage';
import { useAuth } from '@/hooks/useAuth';

type Page = 'home' | 'catalog' | 'studio' | 'profile' | 'songbook' | 'settings';

const NAV_ITEMS: { id: Page; label: string; icon: string }[] = [
  { id: 'home', label: 'Главная', icon: 'Home' },
  { id: 'catalog', label: 'Каталог', icon: 'Grid3X3' },
  { id: 'studio', label: 'Студия', icon: 'Radio' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
  { id: 'songbook', label: 'Songbook', icon: 'BookOpen' },
  { id: 'settings', label: 'Настройки', icon: 'Settings' },
];

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--dark-bg)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center neon-glow animate-pulse">
            <Icon name="Music2" size={22} className="text-white" />
          </div>
          <AudioBars active bars={5} height={24} color="#a855f7" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const navigate = (p: string) => {
    setPage(p as Page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen mesh-bg" style={{ backgroundColor: 'var(--dark-bg)', fontFamily: "'IBM Plex Sans', sans-serif" }}>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--dark-border)] bg-[var(--dark-bg)]/90 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center neon-glow">
              <Icon name="Music2" size={18} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold text-white tracking-wider group-hover:text-purple-300 transition-colors">
              BRA<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">BREY</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-display tracking-wide transition-all ${
                  page === item.id
                    ? item.id === 'studio'
                      ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white neon-glow'
                      : 'bg-[var(--dark-surface)] text-white border border-[var(--dark-border)]'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-[var(--dark-surface)]'
                }`}
              >
                {item.id === 'studio' && (
                  <span className="live-dot w-1.5 h-1.5 rounded-full bg-[var(--live-red)]" />
                )}
                <Icon name={item.icon} size={14} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-600">
              <AudioBars active bars={4} height={14} color="#a855f7" />
              <span className="font-display">3/5 джемов</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('profile')}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                title={user.name}
              >
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="w-9 h-9 rounded-xl object-cover border border-[var(--neon-purple)]/30" />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600/40 to-pink-600/40 border border-[var(--neon-purple)]/30 flex items-center justify-center">
                    <span className="text-xs font-display font-bold text-purple-300">
                      {user.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </button>
              <button
                onClick={logout}
                className="hidden md:flex items-center text-gray-600 hover:text-gray-300 transition-colors"
                title="Выйти"
              >
                <Icon name="LogOut" size={15} />
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-gray-400 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--dark-border)] bg-[var(--dark-bg)]/95 backdrop-blur-xl animate-fade-in">
            <div className="container mx-auto px-6 py-3 space-y-1">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-display tracking-wide transition-all text-left ${
                    page === item.id
                      ? 'bg-[var(--neon-purple)]/15 text-white border border-[var(--neon-purple)]/30'
                      : 'text-gray-400 hover:text-white hover:bg-[var(--dark-surface)]'
                  }`}
                >
                  <Icon name={item.icon} size={16} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Platform limit banner */}
      <div className="border-b border-[var(--dark-border)] bg-[var(--neon-purple)]/5">
        <div className="container mx-auto px-6 py-2 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="live-dot w-1.5 h-1.5 rounded-full bg-[var(--live-red)]" />
              <span className="text-gray-400">3 активных джема</span>
            </span>
            <span className="hidden sm:block">Лимит: 5 сессий · 3 исполнителя · 20 зрителей</span>
          </div>
          <span className="font-display text-[var(--neon-purple)]">WebRTC SFU · Opus 96kbps</span>
        </div>
      </div>

      {/* Page Content */}
      <main key={page} className="animate-fade-in">
        {page === 'home' && <HomePage onNavigate={navigate} />}
        {page === 'catalog' && <CatalogPage onNavigate={navigate} />}
        {page === 'studio' && <StudioPage />}
        {page === 'profile' && <ProfilePage />}
        {page === 'songbook' && <SongbookPage />}
        {page === 'settings' && <SettingsPage />}
      </main>

      {/* Bottom mobile nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--dark-bg)]/95 backdrop-blur-xl border-t border-[var(--dark-border)]">
        <div className="flex">
          {NAV_ITEMS.slice(0, 5).map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-display tracking-wide transition-all ${
                page === item.id
                  ? item.id === 'studio'
                    ? 'text-[var(--neon-purple)]'
                    : 'text-white'
                  : 'text-gray-600 hover:text-gray-400'
              }`}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile bottom padding */}
      <div className="md:hidden h-16" />
    </div>
  );
}