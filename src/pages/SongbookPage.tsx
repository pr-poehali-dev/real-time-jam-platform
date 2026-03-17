import { useState } from 'react';
import Icon from '@/components/ui/icon';

const SONGS = [
  {
    id: 1,
    title: 'Тёмная ночь',
    artist: 'Марк Бернес',
    genre: 'Советская классика',
    key: 'Am',
    bpm: 72,
    mood: '🌙',
    hasLyrics: true,
    hasTrack: true,
  },
  {
    id: 2,
    title: 'Autumn Leaves',
    artist: 'Jazz Standard',
    genre: 'Jazz',
    key: 'Gm',
    bpm: 90,
    mood: '🍂',
    hasLyrics: true,
    hasTrack: true,
  },
  {
    id: 3,
    title: 'Город',
    artist: 'Оригинал',
    genre: 'Indie',
    key: 'Dm',
    bpm: 110,
    mood: '🏙️',
    hasLyrics: true,
    hasTrack: false,
  },
  {
    id: 4,
    title: 'Summertime',
    artist: 'George Gershwin',
    genre: 'Jazz',
    key: 'Am',
    bpm: 65,
    mood: '☀️',
    hasLyrics: true,
    hasTrack: true,
  },
  {
    id: 5,
    title: 'Облака',
    artist: 'Оригинал',
    genre: 'Lo-Fi',
    key: 'C',
    bpm: 85,
    mood: '☁️',
    hasLyrics: false,
    hasTrack: true,
  },
];

const LYRICS_SAMPLE = [
  { time: '0:12', text: 'Тёмная ночь, только пули свистят по степи,' },
  { time: '0:20', text: 'Только ветер гудит в проводах, тускло звёзды мерцают.' },
  { time: '0:32', text: 'В тёмную ночь ты, любимая, знаю, не спишь,' },
  { time: '0:40', text: 'И у детской кроватки тайком ты слезу утираешь.' },
];

export default function SongbookPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const filtered = SONGS.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.artist.toLowerCase().includes(search.toLowerCase())
  );

  const song = SONGS.find(s => s.id === selected);

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold text-white tracking-wide uppercase">Songbook</h1>
          <p className="text-gray-500 text-sm mt-1">Минусовки и тексты для джемов</p>
        </div>
        <button className="flex items-center gap-2 border border-[var(--neon-purple)]/40 bg-[var(--neon-purple)]/10 text-purple-300 text-sm font-display tracking-wide px-5 py-2.5 rounded-xl hover:bg-[var(--neon-purple)]/20 transition-all">
          <Icon name="Plus" size={14} />
          Добавить трек
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Song List */}
        <div className="lg:col-span-1">
          <div className="relative mb-4">
            <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              placeholder="Поиск треков..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[var(--neon-purple)]/50 transition-colors font-body"
            />
          </div>

          <div className="space-y-2">
            {filtered.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setSelected(s.id)}
                className={`w-full text-left card-hover rounded-xl p-4 border transition-all animate-fade-in ${
                  selected === s.id
                    ? 'bg-[var(--neon-purple)]/15 border-[var(--neon-purple)]/40'
                    : 'bg-[var(--dark-card)] border-[var(--dark-border)] hover:border-gray-700'
                }`}
                style={{ animationDelay: `${idx * 0.05}s`, opacity: 0 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{s.mood}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-medium text-white text-sm truncate">{s.title}</p>
                    <p className="text-xs text-gray-500 truncate">{s.artist}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] bg-[var(--dark-surface)] text-gray-500 px-1.5 py-0.5 rounded font-display">{s.key}</span>
                    {s.hasTrack && <Icon name="Music" size={10} className="text-[var(--neon-purple)]" />}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Song Detail */}
        <div className="lg:col-span-2">
          {song ? (
            <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6 animate-scale-in">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{song.mood}</span>
                    <div>
                      <h2 className="font-display text-2xl font-bold text-white">{song.title}</h2>
                      <p className="text-sm text-gray-500">{song.artist} · {song.genre}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xs bg-[var(--dark-surface)] border border-[var(--dark-border)] text-gray-400 px-3 py-1 rounded-full font-display">
                      Key: {song.key}
                    </span>
                    <span className="text-xs bg-[var(--dark-surface)] border border-[var(--dark-border)] text-gray-400 px-3 py-1 rounded-full font-display">
                      {song.bpm} BPM
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {song.hasTrack && (
                    <button className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white text-xs font-display tracking-wide px-4 py-2 rounded-lg neon-glow hover:from-purple-500 transition-all">
                      <Icon name="Play" size={12} />
                      Минус
                    </button>
                  )}
                  <button className="border border-[var(--dark-border)] text-gray-400 hover:text-white text-xs px-3 py-2 rounded-lg transition-colors bg-[var(--dark-surface)]">
                    <Icon name="Download" size={12} />
                  </button>
                </div>
              </div>

              {/* Waveform */}
              <div className="flex items-center gap-1 h-10 mb-6 bg-[var(--dark-surface)] rounded-xl px-4">
                {Array.from({ length: 60 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-[var(--neon-purple)]/30"
                    style={{ height: `${25 + Math.sin(i * 0.3) * 20 + Math.random() * 25}%` }}
                  />
                ))}
              </div>

              {/* Lyrics */}
              {song.hasLyrics && (
                <div>
                  <h3 className="font-display text-sm font-semibold text-gray-400 tracking-widest uppercase mb-4">
                    Текст с таймингом
                  </h3>
                  <div className="space-y-3">
                    {LYRICS_SAMPLE.map((line, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-4 p-3 rounded-xl transition-all cursor-pointer hover:bg-[var(--neon-purple)]/8 ${i === 1 ? 'bg-[var(--neon-purple)]/12 border-l-2 border-[var(--neon-purple)]' : ''}`}
                      >
                        <span className="text-xs text-gray-600 font-display mt-0.5 w-10 shrink-0">{line.time}</span>
                        <p className={`text-sm leading-relaxed ${i === 1 ? 'text-white font-medium' : 'text-gray-400'}`}>
                          {line.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 pt-5 border-t border-[var(--dark-border)]">
                <button className="w-full flex items-center justify-center gap-2 bg-[var(--neon-purple)]/10 hover:bg-[var(--neon-purple)]/20 border border-[var(--neon-purple)]/30 text-purple-300 text-sm font-display tracking-wide py-3 rounded-xl transition-all">
                  <Icon name="Radio" size={14} />
                  Использовать в джеме
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl flex flex-col items-center justify-center h-64 text-gray-600">
              <Icon name="BookOpen" size={32} className="mb-3 opacity-30" />
              <p className="font-display text-sm">Выбери трек для просмотра</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
