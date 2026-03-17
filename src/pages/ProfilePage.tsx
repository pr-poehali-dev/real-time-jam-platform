import Icon from '@/components/ui/icon';
import AudioBars from '@/components/AudioBars';

const HISTORY = [
  { id: 1, title: 'Вечерний джаз', date: '15 мар', duration: '42мин', role: 'Вокал', viewers: 14, mood: '🎷' },
  { id: 2, title: 'Soul & Groove', date: '12 мар', duration: '1ч 8мин', role: 'Гитара', viewers: 21, mood: '🎸' },
  { id: 3, title: 'Midnight Sessions', date: '8 мар', duration: '55мин', role: 'Вокал', viewers: 9, mood: '🎤' },
  { id: 4, title: 'Lo-fi Sunday', date: '3 мар', duration: '2ч 1мин', role: 'Клавиши', viewers: 17, mood: '🎹' },
  { id: 5, title: 'Acoustic Trio', date: '28 фев', duration: '38мин', role: 'Вокал', viewers: 6, mood: '🪕' },
];

const STATS = [
  { label: 'Джемов сыграно', value: '47' },
  { label: 'Часов в эфире', value: '83' },
  { label: 'Зрителей всего', value: '1.2K' },
  { label: 'Подписчиков', value: '238' },
];

const GENRES = ['Jazz', 'Soul', 'Lo-Fi', 'Acoustic', 'R&B'];

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-6 py-10">
      {/* Profile Header */}
      <div className="flex items-start gap-8 mb-10">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-3xl font-display font-bold text-white neon-glow">
            МИ
          </div>
          <span className="absolute -bottom-2 -right-2 bg-[var(--live-red)] text-white text-[9px] font-display tracking-widest px-2 py-0.5 rounded-full">
            LIVE
          </span>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display text-3xl font-bold text-white tracking-wide">MiroslavK</h1>
            <div className="flex items-center gap-1 text-xs text-[var(--neon-purple)] border border-[var(--neon-purple)]/30 bg-[var(--neon-purple)]/10 px-2 py-0.5 rounded-full font-display">
              <Icon name="Award" size={10} />
              Pro
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-3">Вокалист · Москва</p>
          <div className="flex flex-wrap gap-2">
            {GENRES.map(g => (
              <span key={g} className="text-xs bg-[var(--dark-surface)] border border-[var(--dark-border)] text-gray-400 px-3 py-1 rounded-full font-display">
                {g}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white text-sm font-display tracking-wide px-5 py-2.5 rounded-xl neon-glow hover:from-purple-500 transition-all">
            <Icon name="UserPlus" size={14} />
            Подписаться
          </button>
          <button className="border border-[var(--dark-border)] text-gray-400 hover:text-white text-sm font-display px-4 py-2.5 rounded-xl transition-colors bg-[var(--dark-card)]">
            <Icon name="Share2" size={14} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {STATS.map((s, i) => (
          <div
            key={i}
            className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-5 animate-fade-in"
            style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
          >
            <p className="font-display text-3xl font-bold text-white mb-1">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Waveform decoration */}
      <div className="flex items-end justify-center gap-1 h-12 mb-8 opacity-30">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 rounded-sm bg-gradient-to-t from-purple-600 to-pink-400 bar${(i % 5) + 1}`}
            style={{ height: `${20 + Math.sin(i * 0.4) * 15 + Math.random() * 15}%` }}
          />
        ))}
      </div>

      {/* History */}
      <div>
        <h2 className="font-display text-xl font-semibold text-white tracking-wide uppercase mb-6">
          История выступлений
        </h2>
        <div className="space-y-3">
          {HISTORY.map((jam, idx) => (
            <div
              key={jam.id}
              className="card-hover bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-5 flex items-center gap-5 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${idx * 0.08}s`, opacity: 0 }}
            >
              <span className="text-2xl">{jam.mood}</span>
              <div className="flex-1">
                <h3 className="font-display font-medium text-white mb-0.5">{jam.title}</h3>
                <p className="text-xs text-gray-500">{jam.role} · {jam.date}</p>
              </div>
              <div className="hidden md:flex items-center gap-6 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Icon name="Eye" size={11} />{jam.viewers}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Clock" size={11} />{jam.duration}
                </span>
              </div>
              <AudioBars active={false} bars={4} height={16} />
              <Icon name="ChevronRight" size={16} className="text-gray-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
