import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export type AuthenticatedHandler = (
  req: NextRequest,
  context: any,
  userId: string
) => Promise<NextResponse>;

export function withAuth(handler: AuthenticatedHandler) {
  return async (req: NextRequest, context: any) => {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as { userId: string };

      return handler(req, context, payload.userId);
    } catch {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }
  };
}
