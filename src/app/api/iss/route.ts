import { NextResponse } from "next/server";

export async function GET () {
    try {
        const res = await fetch("http://api.open-notify.org/iss-now.json");
        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch ISS data" }, { status: 500 });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Request failed" }, { status: 500 });
    }
}
