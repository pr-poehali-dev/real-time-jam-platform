import Icon from '@/components/ui/icon';

const AUTH_URL = 'https://functions.poehali.dev/3a71915d-a1c1-4f09-a977-02a8611bd302';

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = `${AUTH_URL}?action=login`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-pink-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-5 neon-glow">
            <Icon name="Music2" size={28} className="text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold text-white tracking-wider mb-2">
            BRA<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">BREY</span>
          </h1>
          <p className="text-gray-500 text-sm">Реал-тайм платформа для музыкальных сессий</p>
        </div>

        {/* Card */}
        <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-8">
          <h2 className="font-display text-lg font-semibold text-white text-center mb-2 tracking-wide">
            Войти в платформу
          </h2>
          <p className="text-gray-600 text-xs text-center mb-8">
            Присоединяйся к живым музыкальным сессиям
          </p>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-display font-medium tracking-wide py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Войти через Google
          </button>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-[var(--dark-border)]" />
            <span className="text-xs text-gray-700">безопасный вход</span>
            <div className="flex-1 h-px bg-[var(--dark-border)]" />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              { icon: 'Shield', label: 'Защита OAuth' },
              { icon: 'Zap', label: 'Мгновенный вход' },
              { icon: 'Lock', label: 'Без паролей' },
            ].map(f => (
              <div key={f.label} className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-lg bg-[var(--dark-surface)] border border-[var(--dark-border)] flex items-center justify-center">
                  <Icon name={f.icon} size={14} className="text-[var(--neon-purple)]" />
                </div>
                <span className="text-[10px] text-gray-600 font-display">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-700 mt-6">
          Входя, ты принимаешь условия платформы BraBrey
        </p>
      </div>
    </div>
  );
}
