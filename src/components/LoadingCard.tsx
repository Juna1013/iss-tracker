export default function LoadingCard() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-12 shadow-sm">
      <div className="flex flex-col items-center justify-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          ISS位置を取得中...
        </h2>
        <p className="text-gray-600">宇宙ステーションとの通信を確立しています</p>
      </div>
    </div>
  );
}
