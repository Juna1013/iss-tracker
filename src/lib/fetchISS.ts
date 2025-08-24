// src/lib/fetchISS.ts
export type ISSPosition = {
    latitude: number;
    longitude: number;
};

export async function fetchISS(): Promise<ISSPosition> {
    const res = await fetch("/api/iss"); // 自前APIを叩く
    if (!res.ok) throw new Error("Failed to fetch ISS data");

    const data = await res.json();

    // デバッグ用: レスポンスを表示
    console.log("API Response:", data);

    return {
        latitude: parseFloat(data.iss_position.latitude),
        longitude: parseFloat(data.iss_position.longitude),
    };
}
