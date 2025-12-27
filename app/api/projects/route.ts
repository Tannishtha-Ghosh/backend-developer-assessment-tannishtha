import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";

export const POST = withAuth(
  async (req, _context, userId: string) => {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
      },
    });

    // Assign OWNER role via ProjectMember
    await prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId,
        role: "OWNER",
      },
    });

    return NextResponse.json(project, { status: 201 });
  }
);
