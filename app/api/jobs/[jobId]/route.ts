import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";

type RouteContext = {
  params: {
    jobId: string;
  };
};

export const GET = withAuth(
  async (_req, { params }: RouteContext, _userId: string) => {
    const job = await prisma.job.findUnique({
      where: { id: params.jobId },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  }
);
