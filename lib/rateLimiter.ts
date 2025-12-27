import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

export async function rateLimit(
key: string,
limit = 20,
windowSeconds = 60
) {
const bucket = Math.floor(Date.now() / 1000 / windowSeconds);
const redisKey = `rate:${key}:${bucket}`;

const count = await redis.incr(redisKey);
if (count === 1) await redis.expire(redisKey, windowSeconds);

if (count > limit) throw new Error("RATE_LIMIT_EXCEEDED");
}
