interface Props {
  total: number;
  completed: number;
}

export function ProgressTracker({ total, completed }: Props) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="text-right">
      <div className="text-sm font-medium text-gray-700">
        {completed}/{total} chapters
      </div>
      <div className="w-32 bg-gray-100 rounded-full h-2 mt-1">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-xs text-gray-400 mt-0.5">{pct}% complete</div>
    </div>
  );
}
