import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export function withAuth(
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as { userId: string };

      return handler(req, payload.userId);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  };
}
