import { useState } from 'react';
import Icon from '@/components/ui/icon';
import AudioBars from '@/components/AudioBars';

const ALL_JAMS = [
  { id: 1, title: 'Вечерний джаз', host: 'MiroslavK', genre: 'Jazz', viewers: 14, performers: 3, status: 'live', duration: '42мин', mood: '🎷', date: 'Сейчас' },
  { id: 2, title: 'Lo-fi Chill Session', host: 'SofiaR', genre: 'Lo-Fi', viewers: 8, performers: 2, status: 'live', duration: '18мин', mood: '🎹', date: 'Сейчас' },
  { id: 3, title: 'Acoustic Vibes', host: 'AlexD', genre: 'Acoustic', viewers: 19, performers: 1, status: 'live', duration: '1ч 5мин', mood: '🎸', date: 'Сейчас' },
  { id: 4, title: 'Deep Electronic', host: 'NeonWave', genre: 'Electronic', viewers: 0, performers: 0, status: 'archive', duration: '2ч 12мин', mood: '🎛️', date: '15 марта' },
  { id: 5, title: 'R&B Night Flow', host: 'VelvetVoice', genre: 'R&B', viewers: 0, performers: 0, status: 'archive', duration: '58мин', mood: '🎤', date: '14 марта' },
  { id: 6, title: 'Folk & Soul', host: 'TatianaN', genre: 'Folk', viewers: 0, performers: 0, status: 'archive', duration: '1ч 34мин', mood: '🪕', date: '12 марта' },
  { id: 7, title: 'Improv Jazz Trio', host: 'DmitriP', genre: 'Jazz', viewers: 0, performers: 0, status: 'archive', duration: '1ч 20мин', mood: '🎺', date: '10 марта' },
  { id: 8, title: 'Indie Acoustic Set', host: 'KaterinaM', genre: 'Indie', viewers: 0, performers: 0, status: 'archive', duration: '44мин', mood: '🎵', date: '8 марта' },
];

const GENRES = ['Все', 'Jazz', 'Lo-Fi', 'Acoustic', 'Electronic', 'R&B', 'Folk', 'Indie'];

interface CatalogPageProps {
  onNavigate: (page: string) => void;
}

export default function CatalogPage({ onNavigate }: CatalogPageProps) {
  const [filter, setFilter] = useState<'all' | 'live' | 'archive'>('all');
  const [genre, setGenre] = useState('Все');

  const filtered = ALL_JAMS.filter(j => {
    if (filter === 'live' && j.status !== 'live') return false;
    if (filter === 'archive' && j.status !== 'archive') return false;
    if (genre !== 'Все' && j.genre !== genre) return false;
    return true;
  });

  const liveCount = ALL_JAMS.filter(j => j.status === 'live').length;

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-4xl font-bold text-white tracking-wide uppercase mb-2">
            Каталог джемов
          </h1>
          <p className="text-gray-500 text-sm">
            <span className="text-[var(--live-red)]">{liveCount} активных</span> · {ALL_JAMS.length - liveCount} в архиве
          </p>
        </div>
        <button
          onClick={() => onNavigate('studio')}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-display font-medium tracking-wide px-6 py-3 rounded-xl transition-all neon-glow text-sm"
        >
          <Icon name="Plus" size={16} />
          Новый джем
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="flex bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl p-1">
          {(['all', 'live', 'archive'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-display tracking-wide transition-all ${
                filter === f
                  ? 'bg-[var(--neon-purple)] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'Все' : f === 'live' ? '🔴 Live' : 'Архив'}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {GENRES.map(g => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`px-3 py-2 rounded-xl text-xs font-display tracking-wide transition-all border ${
                genre === g
                  ? 'border-[var(--neon-purple)]/60 bg-[var(--neon-purple)]/15 text-purple-300'
                  : 'border-[var(--dark-border)] text-gray-500 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((jam, idx) => (
          <div
            key={jam.id}
            className={`card-hover bg-[var(--dark-card)] border rounded-2xl overflow-hidden cursor-pointer animate-fade-in ${
              jam.status === 'live'
                ? 'border-[var(--neon-purple)]/30 jam-glow'
                : 'border-[var(--dark-border)]'
            }`}
            style={{ animationDelay: `${idx * 0.05}s`, opacity: 0 }}
            onClick={() => onNavigate('studio')}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{jam.mood}</span>
                {jam.status === 'live' ? (
                  <span className="flex items-center gap-1.5 text-xs text-[var(--live-red)] border border-[var(--live-red)]/30 bg-[var(--live-red)]/10 px-2 py-0.5 rounded-full font-display tracking-widest">
                    <span className="live-dot w-1.5 h-1.5 rounded-full bg-[var(--live-red)]" />
                    LIVE
                  </span>
                ) : (
                  <span className="text-xs text-gray-600 font-display">{jam.date}</span>
                )}
              </div>

              <h3 className="font-display text-base font-semibold text-white mb-1">{jam.title}</h3>
              <p className="text-xs text-gray-500 mb-4">{jam.host} · {jam.genre}</p>

              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center gap-3">
                  {jam.status === 'live' && (
                    <>
                      <span className="flex items-center gap-1 text-gray-400">
                        <Icon name="Eye" size={11} />{jam.viewers}
                      </span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <Icon name="Mic" size={11} />{jam.performers}/3
                      </span>
                    </>
                  )}
                  <span className="flex items-center gap-1">
                    <Icon name="Clock" size={11} />{jam.duration}
                  </span>
                </div>
                {jam.status === 'live' && <AudioBars active bars={4} height={16} color="#a855f7" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24 text-gray-600">
          <Icon name="Music" size={40} className="mx-auto mb-4 opacity-30" />
          <p className="font-display text-lg">Ничего не найдено</p>
        </div>
      )}
    </div>
  );
}
