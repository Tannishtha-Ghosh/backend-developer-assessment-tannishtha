import { Worker, Job } from "bullmq";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";

type JobPayload = {
  jobId: string;
};

new Worker<JobPayload>(
  "jobs",
  async (job: Job<JobPayload>) => {
    const { jobId } = job.data;

    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: "PROCESSING",
        attempts: { increment: 1 },
      },
    });

    // Simulate execution
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const result = {
      message: "Code executed successfully",
      timestamp: new Date().toISOString(),
    };

    await prisma.job.update({
      where: { id: jobId },
      data: {
        status: "COMPLETED",
        output: result,
      },
    });

    return result;
  },
  { connection: redis }
);
