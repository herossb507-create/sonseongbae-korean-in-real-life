interface Props {
  total: number;
  completed: number;
}

export function ProgressTracker({ total, completed }: Props) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="text-right">
      <div className="text-sm font-medium text-[#140F2D]">
        {completed}/{total} chapters
      </div>
      <div className="w-32 bg-[#F0E7FF] rounded-full h-2 mt-1">
        <div
          className="bg-gradient-to-r from-[#FF3D8B] to-[#7C5CFF] h-2 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-xs text-[#9E98B8] mt-0.5">{pct}% complete</div>
    </div>
  );
}
