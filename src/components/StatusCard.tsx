interface Props {
  lastUpdated: Date | null;
}

export default function StatusCard({ lastUpdated }: Props) {
  const lastUpdatedText = lastUpdated
    ? new Intl.DateTimeFormat("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(lastUpdated)
    : "—";

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-3 w-3">
            <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
          </div>
          <span className="text-sm font-medium text-gray-700">
            10秒ごとに自動更新中
          </span>
        </div>
        <div className="text-sm text-gray-500">
          最終更新: {lastUpdatedText}
        </div>
      </div>
    </div>
  );
}
