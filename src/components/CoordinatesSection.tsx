import CoordinateCard from "./CoordinateCard";
import { ISSPosition } from "@/lib/fetchISS";

interface Props {
  position: ISSPosition;
}

export default function CoordinatesSection({ position }: Props) {
  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-gray-900">現在の座標</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CoordinateCard
          label="緯度"
          value={`${position.latitude.toFixed(6)}°`}
          icon="🌐"
        />
        <CoordinateCard
          label="経度"
          value={`${position.longitude.toFixed(6)}°`}
          icon="🗺️"
        />
      </div>
    </div>
  );
}
