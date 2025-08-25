"use client";
import { useEffect, useState } from "react";
import { fetchISS, ISSPosition } from "@/lib/fetchISS";

export default function Home() {
  const [position, setPosition] = useState<ISSPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const pos = await fetchISS();
        setPosition(pos);
        setLastUpdated(new Date());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
    const interval = setInterval(getData, 10_000);
    return () => clearInterval(interval);
  }, []);

  const lastUpdatedText = lastUpdated
    ? new Intl.DateTimeFormat("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(lastUpdated)
    : "—";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="mb-8 text-center">
          <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
            <ISSIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            ISS位置追跡システム
          </h1>
          <p className="text-lg text-gray-600">
            国際宇宙ステーションの現在位置をリアルタイムで監視
          </p>
        </header>

        {/* メインコンテンツ */}
        <main className="mx-auto max-w-4xl">
          {/* ステータスカード */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-3 w-3">
                  <span className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  自動更新中 (10秒間隔)
                </span>
              </div>
              <div className="text-sm text-gray-500">
                最終更新: {lastUpdatedText}
              </div>
            </div>
          </div>

          {loading ? (
            <LoadingCard />
          ) : position ? (
            <>
              {/* 座標表示カード */}
              <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-gray-900">現在の座標</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <CoordinateCard
                    label="緯度 (Latitude)"
                    value={`${position.latitude.toFixed(6)}°`}
                    icon="🌐"
                  />
                  <CoordinateCard
                    label="経度 (Longitude)"
                    value={`${position.longitude.toFixed(6)}°`}
                    icon="🗺️"
                  />
                </div>
              </div>

              {/* 詳細情報カード */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-gray-900">ISS基本情報</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <InfoCard
                    title="軌道高度"
                    value="約400-420km"
                    icon="📏"
                  />
                  <InfoCard
                    title="軌道速度"
                    value="約28,000km/h"
                    icon="🚀"
                  />
                  <InfoCard
                    title="軌道周期"
                    value="約90分"
                    icon="⏱️"
                  />
                  <InfoCard
                    title="乗組員数"
                    value="通常7名"
                    icon="👨‍🚀"
                  />
                </div>
              </div>
            </>
          ) : (
            <ErrorCard />
          )}
        </main>

        {/* フッター */}
        <footer className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            データ提供: Open Notify API | 
            <a 
              href="http://wheretheiss.at/" 
              className="ml-1 text-blue-600 hover:text-blue-800"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Where the ISS at?
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

function CoordinateCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-center">
      <div className="mb-2 text-2xl">{icon}</div>
      <h3 className="mb-1 text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function LoadingCard() {
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

function ErrorCard() {
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

function ISSIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v20" />
      <path d="M2 12h20" />
      <path d="m6 6 12 12" />
      <path d="m6 18 12-12" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
