export default function ErrorCard() {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-12 shadow-sm">
      <div className="text-center">
        <div className="mb-4 text-4xl">⚠️</div>
        <h2 className="mb-2 text-xl font-semibold text-red-900">
          データ取得エラー
        </h2>
        <p className="text-red-700">
          ISS位置データの取得に失敗しました。しばらく待ってから再試行してください。
        </p>
      </div>
    </div>
  );
}
