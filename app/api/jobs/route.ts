import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jobQueue } from "@/lib/queue";
import { withAuth } from "@/lib/withAuth";

export const POST = withAuth(async (req) => {
  const body = await req.json();
  const { type, payload, idempotencyKey } = body;

  if (!type || !idempotencyKey) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  // Idempotency check
  const existing = await prisma.job.findUnique({
    where: { idempotencyKey },
  });

  if (existing) {
    return NextResponse.json(existing);
  }

  const job = await prisma.job.create({
    data: {
      type,
      input: payload ?? {},
      idempotencyKey,
    },
  });

  await jobQueue.add("execute", {
    jobId: job.id,
  });

  return NextResponse.json(job, { status: 202 });
});
