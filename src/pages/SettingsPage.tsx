import { useState } from 'react';
import Icon from '@/components/ui/icon';

export default function SettingsPage() {
  const [inputDevice, setInputDevice] = useState('Встроенный микрофон');
  const [outputDevice, setOutputDevice] = useState('Bluetooth Headphones');
  const [btOptimize, setBtOptimize] = useState(true);
  const [leAudio, setLeAudio] = useState(false);
  const [noiseSuppression, setNoiseSuppression] = useState(true);
  const [echoCancellation, setEchoCancellation] = useState(true);
  const [bitrateMode, setBitrateMode] = useState<'64' | '96' | '128'>('96');
  const [ptime, setPtime] = useState<'10' | '20'>('10');
  const [inputGain, setInputGain] = useState(75);
  const [outputGain, setOutputGain] = useState(85);

  const ToggleRow = ({
    label, desc, value, onChange,
  }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between py-4 border-b border-[var(--dark-border)] last:border-0">
      <div>
        <p className="text-sm text-white font-display font-medium">{label}</p>
        {desc && <p className="text-xs text-gray-600 mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-all ${value ? 'bg-[var(--neon-purple)]' : 'bg-gray-700'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-sm ${value ? 'left-5' : 'left-0.5'}`} />
      </button>
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-10 max-w-3xl">
      <h1 className="font-display text-4xl font-bold text-white tracking-wide uppercase mb-2">Настройки</h1>
      <p className="text-gray-500 text-sm mb-10">Аудио, микрофон и оборудование</p>

      {/* Devices */}
      <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6 mb-5 animate-fade-in">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-[var(--neon-purple)]/15 flex items-center justify-center">
            <Icon name="Mic" size={16} className="text-[var(--neon-purple)]" />
          </div>
          <h2 className="font-display text-lg font-semibold text-white tracking-wide uppercase">Устройства</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 block mb-2 font-display uppercase tracking-wide">Вход (микрофон)</label>
            <select
              value={inputDevice}
              onChange={e => setInputDevice(e.target.value)}
              className="w-full bg-[var(--dark-surface)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--neon-purple)]/50 transition-colors font-body appearance-none cursor-pointer"
            >
              <option>Встроенный микрофон</option>
              <option>USB Microphone (Blue Yeti)</option>
              <option>Bluetooth Headset Mic</option>
              <option>Аудиоинтерфейс (Focusrite)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-2 font-display uppercase tracking-wide">Выход (динамики/наушники)</label>
            <select
              value={outputDevice}
              onChange={e => setOutputDevice(e.target.value)}
              className="w-full bg-[var(--dark-surface)] border border-[var(--dark-border)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--neon-purple)]/50 transition-colors font-body appearance-none cursor-pointer"
            >
              <option>Bluetooth Headphones</option>
              <option>Встроенные динамики</option>
              <option>HDMI Audio</option>
              <option>USB Audio Interface</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-xs text-gray-500 font-display uppercase tracking-wide">Усиление входа</span>
              <span className="text-xs font-display text-[var(--neon-purple)]">{inputGain}%</span>
            </div>
            <input type="range" min={0} max={100} value={inputGain} onChange={e => setInputGain(Number(e.target.value))} className="w-full" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-xs text-gray-500 font-display uppercase tracking-wide">Усиление выхода</span>
              <span className="text-xs font-display text-[var(--neon-purple)]">{outputGain}%</span>
            </div>
            <input type="range" min={0} max={100} value={outputGain} onChange={e => setOutputGain(Number(e.target.value))} className="w-full" />
          </div>
        </div>
      </div>

      {/* Bluetooth */}
      <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6 mb-5 animate-fade-in delay-100">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center">
            <Icon name="Bluetooth" size={16} className="text-blue-400" />
          </div>
          <h2 className="font-display text-lg font-semibold text-white tracking-wide uppercase">Bluetooth</h2>
        </div>

        <ToggleRow
          label="Оптимизация BT задержки"
          desc="AAUDIO_USAGE_GAME + программная компенсация"
          value={btOptimize}
          onChange={setBtOptimize}
        />
        <ToggleRow
          label="Bluetooth LE Audio (LC3)"
          desc="Задержка < 25мс · Требует Android 13+ или iOS 17+"
          value={leAudio}
          onChange={setLeAudio}
        />

        {btOptimize && (
          <div className="mt-4 p-3 bg-blue-500/8 border border-blue-500/20 rounded-xl flex items-start gap-2">
            <Icon name="Info" size={14} className="text-blue-400 mt-0.5 shrink-0" />
            <p className="text-xs text-gray-400">
              Определена задержка устройства: <span className="text-blue-300 font-display">42мс</span>.
              Используй Vocal Match Slider в студии для точной компенсации.
            </p>
          </div>
        )}
      </div>

      {/* Audio Processing */}
      <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6 mb-5 animate-fade-in delay-200">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-pink-500/15 flex items-center justify-center">
            <Icon name="Settings2" size={16} className="text-pink-400" />
          </div>
          <h2 className="font-display text-lg font-semibold text-white tracking-wide uppercase">Обработка звука</h2>
        </div>

        <ToggleRow
          label="Шумоподавление"
          desc="Устранение фонового шума в реальном времени"
          value={noiseSuppression}
          onChange={setNoiseSuppression}
        />
        <ToggleRow
          label="Эхоподавление"
          desc="Удаление эха от динамиков устройства"
          value={echoCancellation}
          onChange={setEchoCancellation}
        />
      </div>

      {/* Network / WebRTC */}
      <div className="bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-2xl p-6 animate-fade-in delay-300">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-violet-500/15 flex items-center justify-center">
            <Icon name="Wifi" size={16} className="text-violet-400" />
          </div>
          <h2 className="font-display text-lg font-semibold text-white tracking-wide uppercase">Сеть · WebRTC</h2>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-xs text-gray-500 block mb-3 font-display uppercase tracking-wide">Битрейт Opus (kbps)</label>
            <div className="flex gap-3">
              {(['64', '96', '128'] as const).map(b => (
                <button
                  key={b}
                  onClick={() => setBitrateMode(b)}
                  className={`flex-1 py-2 rounded-xl text-sm font-display tracking-wide border transition-all ${
                    bitrateMode === b
                      ? 'bg-[var(--neon-purple)]/20 border-[var(--neon-purple)]/50 text-purple-300'
                      : 'border-[var(--dark-border)] text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-3 font-display uppercase tracking-wide">Размер фрейма (ptime)</label>
            <div className="flex gap-3">
              {(['10', '20'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPtime(p)}
                  className={`flex-1 py-2 rounded-xl text-sm font-display tracking-wide border transition-all ${
                    ptime === p
                      ? 'bg-[var(--neon-purple)]/20 border-[var(--neon-purple)]/50 text-purple-300'
                      : 'border-[var(--dark-border)] text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {p}мс {p === '10' ? '(рекомендуется)' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
