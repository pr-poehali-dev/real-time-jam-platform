import { useState } from 'react';
import Icon from '@/components/ui/icon';

const AUTH_URL = 'https://functions.poehali.dev/3a71915d-a1c1-4f09-a977-02a8611bd302';
const TOKEN_KEY = 'brabrey_token';

interface LoginPageProps {
  onSuccess: () => void;
}

export default function LoginPage({ onSuccess }: LoginPageProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const action = tab === 'login' ? 'email_login' : 'register';
    const body: Record<string, string> = { email, password };
    if (tab === 'register') body.name = name;

    try {
      const res = await fetch(`${AUTH_URL}?action=${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Что-то пошло не так');
      } else {
        localStorage.setItem(TOKEN_KEY, data.token);
        onSuccess();
      }
    } catch (_e) {
      setError('Ошибка соединения. Попробуй ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = `${AUTH_URL}?action=login`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-pink-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 neon-glow overflow-hidden">
            <img
              src="https://cdn.poehali.dev/projects/ffc69416-b18f-461c-9503-be4a3853bbd7/bucket/9d581068-5337-4142-98fe-03133be3af12.png"
              alt="BraBrey"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="font-display text-4xl font-bold text-white tracking-wider mb-1">
            BRA<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">BREY</span>
          </h1>
          <p className="text-gray-500 text-xs">Реал-тайм платформа для музыкальных сессий</p>
        </div>

        <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6">
          {/* Tabs */}
          <div className="flex bg-[var(--dark-surface)] rounded-xl p-1 mb-6">
            {(['login', 'register'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-display tracking-wide transition-all ${
                  tab === t
                    ? 'bg-[var(--neon-purple)] text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {t === 'login' ? 'Войти' : 'Создать аккаунт'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {tab === 'register' && (
              <div className="relative">
                <Icon name="User" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  placeholder="Имя артиста"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[var(--dark-surface)] border border-[var(--dark-border)] rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--neon-purple)]/60 transition-colors"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Icon name="Mail" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[var(--dark-surface)] border border-[var(--dark-border)] rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--neon-purple)]/60 transition-colors"
                required
              />
            </div>

            <div className="relative">
              <Icon name="Lock" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Пароль"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[var(--dark-surface)] border border-[var(--dark-border)] rounded-xl pl-9 pr-10 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--neon-purple)]/60 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
              >
                <Icon name={showPass ? 'EyeOff' : 'Eye'} size={14} />
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 animate-fade-in">
                <Icon name="AlertCircle" size={13} className="text-red-400 shrink-0" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-display font-medium tracking-wide py-3 rounded-xl transition-all neon-glow flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <><Icon name="Loader2" size={16} className="animate-spin" />Подождите...</>
              ) : tab === 'login' ? (
                <><Icon name="LogIn" size={16} />Войти</>
              ) : (
                <><Icon name="UserPlus" size={16} />Зарегистрироваться</>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[var(--dark-border)]" />
            <span className="text-xs text-gray-700 font-display">или</span>
            <div className="flex-1 h-px bg-[var(--dark-border)]" />
          </div>

          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white/8 hover:bg-white/12 border border-[var(--dark-border)] hover:border-gray-600 text-gray-300 font-display font-medium tracking-wide py-3 rounded-xl transition-all text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Войти через Google
          </button>
        </div>

        <p className="text-center text-xs text-gray-700 mt-5">
          Входя, ты принимаешь условия платформы BraBrey
        </p>
      </div>
    </div>
  );
}
