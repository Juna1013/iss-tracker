"use client";

import { useEffect, useRef, useState } from 'react';
import { ISSPosition } from '@/lib/fetchISS';

interface Props {
  position: ISSPosition;
}

// Leafletの型定義
declare global {
  interface Window {
    L: any;
  }
}

export default function MapComponent({ position }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const orbitLineRef = useRef<any>(null);
  
  // 軌道パスの状態管理
  const [orbitPath, setOrbitPath] = useState<[number, number][]>([]);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Leafletライブラリを動的ロード
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        // CSS読み込み
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);

        // JS読み込み
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        
        return new Promise<void>((resolve) => {
          script.onload = () => {
            setLeafletLoaded(true);
            resolve();
          };
          document.head.appendChild(script);
        });
      } else if (window.L) {
        setLeafletLoaded(true);
      }
    };

    loadLeaflet();
  }, []);

  // マップ初期化
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || mapInstanceRef.current) return;

    const L = window.L;

    // マップ初期化
    mapInstanceRef.current = L.map(mapRef.current, {
      center: [position.latitude, position.longitude],
      zoom: 4,
      zoomControl: true,
      scrollWheelZoom: true
    });

    // OpenStreetMapタイル追加
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(mapInstanceRef.current);

    // 衛星画像タイル追加（オプション）
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    // レイヤーコントロール追加
    const baseMaps = {
      "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }),
      "Satellite": satelliteLayer
    };

    L.control.layers(baseMaps).addTo(mapInstanceRef.current);

    // カスタムISSアイコン作成
    const issIcon = L.divIcon({
      html: `
        <div style="
          width: 24px; 
          height: 24px; 
          background: #3B82F6; 
          border: 3px solid #1E40AF; 
          border-radius: 50%; 
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.7);
          position: relative;
        ">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-size: 12px;
            font-weight: bold;
          ">🛰️</div>
        </div>
      `,
      className: 'iss-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });

    // ISSマーカー作成
    markerRef.current = L.marker([position.latitude, position.longitude], { 
      icon: issIcon 
    }).addTo(mapInstanceRef.current);

    // ポップアップ追加
    markerRef.current.bindPopup(`
      <div style="padding: 10px; min-width: 200px;">
        <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px;">🛰️ 国際宇宙ステーション</h3>
        <div style="border-top: 1px solid #e5e7eb; padding-top: 8px;">
          <p style="margin: 2px 0; color: #6b7280; font-size: 14px;">
            <strong>緯度:</strong> ${position.latitude.toFixed(6)}°
          </p>
          <p style="margin: 2px 0; color: #6b7280; font-size: 14px;">
            <strong>経度:</strong> ${position.longitude.toFixed(6)}°
          </p>
          <p style="margin: 6px 0 2px 0; color: #9ca3af; font-size: 12px;">
            軌道高度: 約408km | 速度: 約28,000km/h
          </p>
        </div>
      </div>
    `);

    // 軌道線初期化
    orbitLineRef.current = L.polyline([], {
      color: '#FF6B6B',
      weight: 3,
      opacity: 0.8,
      smoothFactor: 1
    }).addTo(mapInstanceRef.current);

  }, [leafletLoaded, position]);

  // 位置が更新されたときに軌道パスを追加
  useEffect(() => {
    if (position) {
      setOrbitPath(prev => {
        const newPath: [number, number][] = [...prev, [position.latitude, position.longitude]];
        // 最新の150ポイントのみ保持（約25分間の軌道）
        return newPath.slice(-150);
      });
    }
  }, [position]);

  // 軌道パスが更新されたときに地図上の軌道線を更新
  useEffect(() => {
    if (orbitLineRef.current && orbitPath.length > 0) {
      orbitLineRef.current.setLatLngs(orbitPath);
    }
  }, [orbitPath]);

  // 位置が更新されたときにマーカーとマップを更新
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && leafletLoaded) {
      const L = window.L;
      
      // マーカー位置を更新
      markerRef.current.setLatLng([position.latitude, position.longitude]);
      
      // マップの中心を更新（スムーズに移動）
      mapInstanceRef.current.panTo([position.latitude, position.longitude]);
      
      // ポップアップ内容を更新
      markerRef.current.setPopupContent(`
        <div style="padding: 10px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px;">🛰️ 国際宇宙ステーション</h3>
          <div style="border-top: 1px solid #e5e7eb; padding-top: 8px;">
            <p style="margin: 2px 0; color: #6b7280; font-size: 14px;">
              <strong>緯度:</strong> ${position.latitude.toFixed(6)}°
            </p>
            <p style="margin: 2px 0; color: #6b7280; font-size: 14px;">
              <strong>経度:</strong> ${position.longitude.toFixed(6)}°
            </p>
            <p style="margin: 6px 0 2px 0; color: #9ca3af; font-size: 12px;">
              軌道高度: 約408km | 速度: 約28,000km/h
            </p>
            <p style="margin: 2px 0; color: #9ca3af; font-size: 12px;">
              軌道データ: ${orbitPath.length}点 (約${Math.round(orbitPath.length * 10 / 60)}分間)
            </p>
          </div>
        </div>
      `);
    }
  }, [position, orbitPath.length, leafletLoaded]);

  // 軌道をクリアする関数
  const clearOrbit = () => {
    setOrbitPath([]);
    if (orbitLineRef.current) {
      orbitLineRef.current.setLatLngs([]);
    }
  };

  // ISSを中心にズーム
  const centerOnISS = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([position.latitude, position.longitude], 6);
    }
  };

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">ISS位置マップ</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-6 rounded-full bg-red-400"></div>
            <span className="text-sm text-gray-600">軌道 ({orbitPath.length}点)</span>
          </div>
          <button
            onClick={centerOnISS}
            className="rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 transition-colors"
          >
            ISS中心
          </button>
          <button
            onClick={clearOrbit}
            className="rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200 transition-colors"
          >
            軌道クリア
          </button>
        </div>
      </div>
      
      <div 
        ref={mapRef} 
        className="h-96 w-full rounded-lg border border-gray-300 relative z-0"
        style={{ minHeight: '400px' }}
      />
      
      {!leafletLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <p className="text-gray-600">地図を読み込み中...</p>
          </div>
        </div>
      )}
      
      <div className="mt-3 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <p className="text-gray-500">
            🛰️ <strong>青いマーカー</strong>をクリックすると詳細情報が表示されます
          </p>
          <p className="text-gray-500">
            🔴 <strong>赤い線</strong>はISSの軌道を表示
          </p>
        </div>
        
        {orbitPath.length > 0 && (
          <div className="rounded-md bg-blue-50 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700 font-medium">軌道追跡情報</span>
              <span className="text-blue-600">
                追跡時間: 約{Math.round(orbitPath.length * 10 / 60)}分間
              </span>
            </div>
            <div className="mt-1 text-xs text-blue-600">
              データ点数: {orbitPath.length}点 | 軌道速度: 約28,000km/h | 一周期: 約90分
            </div>
          </div>
        )}
        
        <div className="text-xs text-gray-400 mt-2">
          地図データ: © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">OpenStreetMap</a> contributors
        </div>
      </div>
    </div>
  );
}
