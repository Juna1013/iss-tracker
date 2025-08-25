import InfoCard from "./InfoCard";

export default function InfoSection() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-gray-900">ISS基本情報</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <InfoCard title="軌道高度" value="約400-420km" icon="📏" />
        <InfoCard title="軌道速度" value="約28,000km/h" icon="🚀" />
        <InfoCard title="軌道周期" value="約90分" icon="⏱️" />
        <InfoCard title="乗組員数" value="通常7名" icon="👨‍🚀" />
      </div>
    </div>
  );
}
