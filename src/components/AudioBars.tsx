interface AudioBarsProps {
  active?: boolean;
  color?: string;
  bars?: number;
  height?: number;
}

export default function AudioBars({ active = true, color = '#a855f7', bars = 5, height = 24 }: AudioBarsProps) {
  const barClasses = ['bar1', 'bar2', 'bar3', 'bar4', 'bar5'];
  return (
    <div className="flex items-end gap-[2px]" style={{ height }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={active ? barClasses[i % 5] : ''}
          style={{
            width: 3,
            height: active ? '100%' : '20%',
            backgroundColor: active ? color : 'rgba(168,85,247,0.3)',
            borderRadius: 2,
            transformOrigin: 'bottom',
            transition: 'background-color 0.3s ease',
          }}
        />
      ))}
    </div>
  );
}
