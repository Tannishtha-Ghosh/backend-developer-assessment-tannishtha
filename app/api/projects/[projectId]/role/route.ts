import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";

type RouteContext = {
  params: {
    projectId: string;
  };
};

export const PUT = withAuth(
  async (req, { params }: RouteContext, userId: string) => {
    const { userId: targetUserId, role } = await req.json();

    // Only OWNER can update roles
    const owner = await prisma.projectMember.findFirst({
      where: {
        projectId: params.projectId,
        userId,
        role: "OWNER",
      },
    });

    if (!owner) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    await prisma.projectMember.update({
      where: {
        userId_projectId: {
          userId: targetUserId,
          projectId: params.projectId,
        },
      },
      data: { role },
    });

    return NextResponse.json({
      message: "Role updated successfully",
    });
  }
);
