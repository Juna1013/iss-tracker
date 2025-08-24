export type ISSPosition = {
    latitude: number;
    longitude: number;
};

export async function fetchISS(): Promise<ISSPosition> {
    const res = await fetch("http://api.open-notify.org/iss-now.json");
    if (!res.ok) throw new Error("Failed to fetch ISS data");

    const data = await res.json();
    return {
        latitude: parseFloat(data.iss_position.latitude),
        longitude: parseFloat(data.iss_position.kongitude),
    };
}
