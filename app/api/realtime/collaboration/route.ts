import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware/auth";
import { redis } from "@/lib/redis";
import { pusher } from "@/lib/pusher";

export async function POST(req: Request) {
try {
    const user = requireAuth(req);
    const { projectId, eventType, data } = await req.json();

    const event = {
    projectId,
    userId: user.userId,
    eventType,
    data,
    timestamp: Date.now(),
    };

    // Redis Pub/Sub (real distribution)
    await redis.publish(`project:${projectId}`, JSON.stringify(event));

    // WebSocket broadcast (real-time)
    await pusher.trigger(`project-${projectId}`, eventType, event);

    return NextResponse.json({ status: "delivered" });
} catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
}
