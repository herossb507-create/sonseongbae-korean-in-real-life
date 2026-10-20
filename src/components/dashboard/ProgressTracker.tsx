interface Props {
  total: number;
  completed: number;
}

export function ProgressTracker({ total, completed }: Props) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="text-right">
      <div className="text-sm font-medium text-[#1E1225]">
        {completed}/{total} chapters
      </div>
      <div className="w-32 bg-[#FFE8F0] rounded-full h-2 mt-1">
        <div
          className="bg-gradient-to-r from-[#E8436F] to-[#9B7FE8] h-2 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-xs text-[#B0A8BB] mt-0.5">{pct}% complete</div>
    </div>
  );
}
