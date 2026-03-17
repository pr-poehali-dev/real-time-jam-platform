import Icon from '@/components/ui/icon';
import AudioBars from '@/components/AudioBars';

const HERO_IMAGE = 'https://cdn.poehali.dev/projects/ffc69416-b18f-461c-9503-be4a3853bbd7/files/2074e1ea-3b45-4d28-98a0-3d1fa4584714.jpg';

const ACTIVE_JAMS = [
  { id: 1, title: 'Вечерний джаз', host: 'MiroslavK', genre: 'Jazz', viewers: 14, performers: 3, mood: '🎷' },
  { id: 2, title: 'Lo-fi Chill Session', host: 'SofiaR', genre: 'Lo-Fi', viewers: 8, performers: 2, mood: '🎹' },
  { id: 3, title: 'Acoustic Vibes', host: 'AlexD', genre: 'Acoustic', viewers: 19, performers: 1, mood: '🎸' },
];

const FEATURES = [
  { icon: 'Zap', title: 'WebRTC SFU', desc: 'Ультра-низкая задержка через архитектуру Selective Forwarding Unit' },
  { icon: 'Bluetooth', title: 'Bluetooth Sync', desc: 'Vocal Match Slider для идеальной синхронизации с BT-устройствами' },
  { icon: 'Music2', title: 'Live DSP', desc: 'Реверберация, автотюнинг и эквализация в реальном времени' },
  { icon: 'Users', title: '3 + 20', desc: 'До 3 исполнителей и 20 зрителей в одном джеме одновременно' },
];

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080810] via-[#080810]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080810] via-transparent to-transparent" />

        {/* Floating audio bars decoration */}
        <div className="absolute right-16 top-1/3 opacity-40 hidden lg:flex gap-3 items-end">
          {[32, 48, 56, 40, 64, 44, 52].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full bg-gradient-to-t from-purple-600 to-pink-400 bar${(i % 5) + 1}`}
              style={{ height: h }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6 animate-fade-in">
              <span className="flex items-center gap-1.5 text-xs font-display tracking-widest uppercase text-[var(--neon-purple)] border border-[var(--neon-purple)]/30 bg-[var(--neon-purple)]/10 px-3 py-1 rounded-full">
                <span className="live-dot w-2 h-2 rounded-full bg-[var(--live-red)] inline-block" />
                Live Platform
              </span>
            </div>

            <h1 className="font-display text-7xl lg:text-8xl font-bold text-white leading-none tracking-tight mb-6 animate-fade-in delay-100">
              BRA
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 neon-text">
                BREY
              </span>
            </h1>

            <p className="text-xl text-gray-300 font-light leading-relaxed mb-10 animate-fade-in delay-200">
              Реал-тайм платформа для мгновенных музыкальных сессий.<br />
              Три исполнителя. Двадцать зрителей. Никакой задержки.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in delay-300">
              <button
                onClick={() => onNavigate('studio')}
                className="group flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-display font-medium tracking-wide px-8 py-4 rounded-xl transition-all duration-200 neon-glow hover:scale-105"
              >
                <Icon name="Radio" size={18} />
                Начать джем
              </button>
              <button
                onClick={() => onNavigate('catalog')}
                className="flex items-center gap-2 border border-[var(--dark-border)] hover:border-[var(--neon-purple)]/50 text-gray-300 hover:text-white font-display font-medium tracking-wide px-8 py-4 rounded-xl transition-all duration-200 bg-white/5 hover:bg-white/8"
              >
                <Icon name="Grid3X3" size={18} />
                Смотреть джемы
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Active Jams Strip */}
      <section className="py-16 container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="live-dot w-2.5 h-2.5 rounded-full bg-[var(--live-red)]" />
            <h2 className="font-display text-2xl font-semibold text-white tracking-wide uppercase">
              Сейчас играют
            </h2>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-sm text-[var(--neon-purple)] hover:text-purple-300 transition-colors flex items-center gap-1"
          >
            Все сессии <Icon name="ArrowRight" size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ACTIVE_JAMS.map((jam, idx) => (
            <div
              key={jam.id}
              className={`card-hover bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-5 cursor-pointer animate-fade-in`}
              style={{ animationDelay: `${idx * 0.1}s`, opacity: 0 }}
              onClick={() => onNavigate('studio')}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="live-dot w-2 h-2 rounded-full bg-[var(--live-red)]" />
                    <span className="text-xs text-[var(--live-red)] font-display tracking-widest uppercase">Live</span>
                  </div>
                  <h3 className="font-display text-lg text-white font-medium">{jam.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{jam.host} • {jam.genre}</p>
                </div>
                <span className="text-2xl">{jam.mood}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Icon name="Eye" size={12} />
                    {jam.viewers}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Mic" size={12} />
                    {jam.performers}/3
                  </span>
                </div>
                <AudioBars active={true} color="#a855f7" bars={5} height={20} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-[var(--dark-border)]">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-3xl font-bold text-center text-white mb-12 tracking-wide uppercase">
            Технологии платформы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--neon-purple)]/15 flex items-center justify-center mb-4">
                  <Icon name={f.icon} size={20} className="text-[var(--neon-purple)]" />
                </div>
                <h3 className="font-display text-base font-semibold text-white mb-2 tracking-wide">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
