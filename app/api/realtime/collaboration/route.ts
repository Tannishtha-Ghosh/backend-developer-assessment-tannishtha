import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { redis } from "@/lib/redis";
import { pusher } from "@/lib/pusher";

export const POST = withAuth(
async (req, _context, userId: string) => {
    const { projectId, eventType, data } = await req.json();

    const event = {
    projectId,
    userId,
    eventType,
    data,
    timestamp: Date.now(),
    };

    // Redis Pub/Sub
    await redis.publish(
    `project:${projectId}`,
    JSON.stringify(event)
    );

    // Pusher broadcast
    await pusher.trigger(
    `project-${projectId}`,
    eventType,
    event
    );

    return NextResponse.json({ status: "delivered" });
}
);
