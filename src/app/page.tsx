"use client";
import { useEffect, useState } from "react";
import { fetchISS, ISSPosition } from "@/lib/fetchISS";

export default function Home() {
    const [position, setPosition] = useState<ISSPosition | null>(null);
    const [loading, setLoading] = useState(true);

      // 10秒ごとにISS位置を更新
    useEffect(() => {
        const getData = async () => {
            try {
                const pos = await fetchISS();
                setPosition(pos);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getData();
        const interval = setInterval(getData, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold mb-4">🌍 ISS Tracker</h1>

            {loading ? (
                <p>Loading ISS position...</p>
            ) : position ? (
                <div className="bg-gray-800 p-6 rounded-2xl shadow-xl text-center">
                    <p className="text-lg">Current ISS Position</p>
                    <p className="text-xl font-mono mt-2">
                        Latitude: {position.latitude.toFixed(2)}°
                    </p>
                    <p className="text-xl font-mono">
                        Longitude: {position.longitude.toFixed(2)}°
                    </p>
                </div>
            ) : (
            <p className="text-red-400">Failed to load ISS data</p>
            )}
        </main>
    );
}
