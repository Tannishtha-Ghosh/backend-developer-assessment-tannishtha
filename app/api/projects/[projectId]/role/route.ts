import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/middleware/auth";

export async function PUT(
req: Request,
{ params }: { params: { projectId: string } }
) {
try {
    const user = requireAuth(req);
    const { userId, role } = await req.json();

    // Only OWNER can update roles
    const owner = await prisma.projectMember.findFirst({
    where: {
        projectId: params.projectId,
        userId: user.userId,
        role: "OWNER",
    },
    });

    if (!owner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.projectMember.update({
    where: {
        userId_projectId: {
        userId,
        projectId: params.projectId,
        },
    },
    data: { role },
    });

    return NextResponse.json({ message: "Role updated successfully" });
} catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
}
