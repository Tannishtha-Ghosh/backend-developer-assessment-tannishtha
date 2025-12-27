import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/middleware/auth";

export const POST = withAuth(
  async (req: NextRequest, userId: string) => {
    const projectId = req.nextUrl.pathname.split("/")[3];
    const { email, role } = await req.json();

    const isOwner = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId,
        role: "OWNER",
      },
    });

    if (!isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.projectMember.create({
      data: {
        projectId,
        userId: user.id,
        role,
      },
    });

    return NextResponse.json({ success: true });
  }
);
