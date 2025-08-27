"use client";
import { useEffect, useState } from "react";
import { fetchISS, ISSPosition } from "@/lib/fetchISS";
import Header from "@/components/Header";
import StatusCard from "@/components/StatusCard";
import CoordinatesSection from "@/components/CoordinatesSection";
import InfoSection from "@/components/InfoSection";
import Footer from "@/components/Footer";
import LoadingCard from "@/components/LoadingCard";
import ErrorCard from "@/components/ErrorCard";
import MapComponent from "@/components/MapComponent"; // 追加

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <Header />
        <StatusCard lastUpdated={lastUpdated} />
        {loading ? (
          <LoadingCard />
        ) : position ? (
          <>
            <CoordinatesSection position={position} />
            <MapComponent position={position} /> {/* 追加 */}
            <InfoSection />
          </>
        ) : (
          <ErrorCard />
        )}
        <Footer />
      </div>
    </div>
  );
}
