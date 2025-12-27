import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";

export const POST = withAuth(
  async (req: NextRequest, userId: string) => {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        ownerId: userId,
      },
    });

    return NextResponse.json(project, { status: 201 });
  }
);
