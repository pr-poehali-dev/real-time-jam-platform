import { useState } from 'react';
import Icon from '@/components/ui/icon';
import AudioBars from '@/components/AudioBars';

const STUDIO_IMAGE = 'https://cdn.poehali.dev/projects/ffc69416-b18f-461c-9503-be4a3853bbd7/files/032cc7ca-fbf5-4f88-8c11-bbba0b70ce4e.jpg';

const PERFORMERS = [
  { id: 1, name: 'MiroslavK', role: 'Вокал', active: true, latency: 12 },
  { id: 2, name: 'SofiaR', role: 'Клавиши', active: true, latency: 28 },
  { id: 3, name: 'Ты', role: 'Гитара', active: false, latency: 0, isYou: true },
];

export default function StudioPage() {
  const [isLive, setIsLive] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [reverbAmount, setReverbAmount] = useState(30);
  const [roomSize, setRoomSize] = useState(35);
  const [autoPitch, setAutoPitch] = useState(false);
  const [syncOffset, setSyncOffset] = useState(0);
  const [compression, setCompression] = useState(50);
  const [masterVol, setMasterVol] = useState(80);
  const [btLatency] = useState(42);

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white tracking-wide uppercase">
            Студия · Джем #247
          </h1>
          <p className="text-gray-500 text-sm mt-1">Вечерний джаз · {isLive ? 'В эфире' : 'Подготовка'}</p>
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className={`flex items-center gap-2 font-display font-medium tracking-wide px-8 py-3 rounded-xl transition-all text-sm ${
            isLive
              ? 'bg-[var(--live-red)]/20 border border-[var(--live-red)]/50 text-[var(--live-red)] hover:bg-[var(--live-red)]/30'
              : 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 text-white neon-glow'
          }`}
        >
          {isLive ? (
            <><span className="live-dot w-2 h-2 rounded-full bg-[var(--live-red)]" />Остановить</>
          ) : (
            <><Icon name="Radio" size={16} />Выйти в эфир</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Stage */}
        <div className="lg:col-span-2 space-y-6">

          {/* Stage Visual */}
          <div className="relative rounded-2xl overflow-hidden border border-[var(--dark-border)] h-56">
            <img src={STUDIO_IMAGE} alt="Studio" className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark-card)] to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center gap-8">
              {PERFORMERS.map(p => (
                <div key={p.id} className="flex flex-col items-center gap-2">
                  <div className={`relative w-14 h-14 rounded-full border-2 flex items-center justify-center text-lg font-display font-bold
                    ${p.isYou
                      ? 'border-[var(--neon-purple)] bg-[var(--neon-purple)]/20 text-white'
                      : p.active
                        ? 'border-purple-400/60 bg-purple-900/30 text-white'
                        : 'border-gray-700 bg-gray-900/50 text-gray-600'
                    }`}
                  >
                    {p.name.slice(0, 2).toUpperCase()}
                    {p.active && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[var(--live-red)] rounded-full border border-[var(--dark-card)]" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-white font-display">{p.name}</p>
                    <p className="text-[10px] text-gray-500">{p.role}</p>
                  </div>
                  <AudioBars active={p.active} bars={4} height={18} color={p.isYou ? '#ec4899' : '#a855f7'} />
                </div>
              ))}
            </div>

            {isLive && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-[var(--live-red)]/90 text-white text-xs font-display tracking-widest px-3 py-1.5 rounded-full">
                <span className="live-dot w-2 h-2 rounded-full bg-white" />
                LIVE
              </div>
            )}
          </div>

          {/* Performers grid */}
          <div className="grid grid-cols-3 gap-3">
            {PERFORMERS.map(p => (
              <div
                key={p.id}
                className={`bg-[var(--dark-card)] rounded-xl border p-4 ${
                  p.isYou ? 'border-[var(--neon-purple)]/40' : 'border-[var(--dark-border)]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-display font-medium text-white">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.role}</p>
                  </div>
                  {p.isYou ? (
                    <button
                      onClick={() => setMicOn(!micOn)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        micOn ? 'bg-[var(--neon-purple)]/20 text-[var(--neon-purple)]' : 'bg-gray-800 text-gray-600'
                      }`}
                    >
                      <Icon name={micOn ? 'Mic' : 'MicOff'} size={14} />
                    </button>
                  ) : (
                    <div className={`w-2 h-2 rounded-full ${p.active ? 'bg-green-400' : 'bg-gray-700'}`} />
                  )}
                </div>
                {!p.isYou && p.active && (
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    <Icon name="Wifi" size={10} />
                    <span>{p.latency}мс</span>
                  </div>
                )}
                {p.isYou && (
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    <Icon name="Bluetooth" size={10} />
                    <span>BT {btLatency}мс</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Vocal Match Slider */}
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="SlidersHorizontal" size={16} className="text-[var(--neon-purple)]" />
              <h3 className="font-display text-sm font-semibold text-white tracking-wide uppercase">
                Vocal Match Slider
              </h3>
              <span className="text-xs text-gray-600 ml-1">Bluetooth компенсация</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500 w-16 text-right font-display">-200мс</span>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min={-200}
                  max={200}
                  value={syncOffset}
                  onChange={e => setSyncOffset(Number(e.target.value))}
                  className="w-full"
                />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 w-0.5 h-3 bg-gray-700 -mt-1.5 pointer-events-none" />
              </div>
              <span className="text-xs text-gray-500 w-16 font-display">+200мс</span>
            </div>
            <div className="text-center mt-2">
              <span className={`text-sm font-display font-semibold ${syncOffset === 0 ? 'text-gray-600' : 'text-[var(--neon-purple)]'}`}>
                {syncOffset > 0 ? '+' : ''}{syncOffset}мс
              </span>
            </div>
          </div>
        </div>

        {/* DSP Panel */}
        <div className="space-y-4">

          {/* Super Studio Reverb */}
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center">
                <Icon name="Waves" size={14} className="text-purple-400" />
              </div>
              <h3 className="font-display text-sm font-semibold text-white tracking-wide uppercase">Super Studio</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-gray-500">Room Size</span>
                  <span className="text-xs font-display text-[var(--neon-purple)]">{roomSize}%</span>
                </div>
                <input type="range" min={0} max={100} value={roomSize} onChange={e => setRoomSize(Number(e.target.value))} className="w-full" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-gray-500">Reverb Amount</span>
                  <span className="text-xs font-display text-[var(--neon-purple)]">{reverbAmount}%</span>
                </div>
                <input type="range" min={0} max={100} value={reverbAmount} onChange={e => setReverbAmount(Number(e.target.value))} className="w-full" />
              </div>
            </div>
          </div>

          {/* Alchemist FX */}
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-pink-500/15 flex items-center justify-center">
                <Icon name="Zap" size={14} className="text-pink-400" />
              </div>
              <h3 className="font-display text-sm font-semibold text-white tracking-wide uppercase">Alchemist FX</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-gray-500">Компрессия</span>
                  <span className="text-xs font-display text-pink-400">{compression}%</span>
                </div>
                <input type="range" min={0} max={100} value={compression} onChange={e => setCompression(Number(e.target.value))} className="w-full" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-gray-500">Мастер громкость</span>
                  <span className="text-xs font-display text-pink-400">{masterVol}%</span>
                </div>
                <input type="range" min={0} max={100} value={masterVol} onChange={e => setMasterVol(Number(e.target.value))} className="w-full" />
              </div>
            </div>
          </div>

          {/* Auto-Pitch */}
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
                  <Icon name="Music2" size={14} className="text-violet-400" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-white tracking-wide uppercase">Auto-Pitch</h3>
                  <p className="text-[10px] text-gray-600 mt-0.5">Корр. высоты тона</p>
                </div>
              </div>
              <button
                onClick={() => setAutoPitch(!autoPitch)}
                className={`relative w-11 h-6 rounded-full transition-all ${autoPitch ? 'bg-[var(--neon-purple)]' : 'bg-gray-700'}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-sm ${autoPitch ? 'left-5' : 'left-0.5'}`}
                />
              </button>
            </div>
            {autoPitch && (
              <div className="mt-4 p-3 bg-[var(--neon-purple)]/8 border border-[var(--neon-purple)]/20 rounded-xl">
                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                  <Icon name="CheckCircle" size={12} className="text-[var(--neon-purple)]" />
                  Активна мягкая квантизация тона
                </p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-5">
            <h3 className="font-display text-xs font-semibold text-gray-500 tracking-widest uppercase mb-4">Статистика сессии</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Зрители', value: '14', icon: 'Eye' },
                { label: 'Задержка', value: '12мс', icon: 'Wifi' },
                { label: 'Битрейт', value: '96kbps', icon: 'Activity' },
                { label: 'Длительность', value: '42мин', icon: 'Clock' },
              ].map(s => (
                <div key={s.label} className="bg-[var(--dark-surface)] rounded-xl p-3">
                  <Icon name={s.icon} size={12} className="text-gray-600 mb-1.5" />
                  <p className="font-display text-base font-semibold text-white">{s.value}</p>
                  <p className="text-[10px] text-gray-600">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
