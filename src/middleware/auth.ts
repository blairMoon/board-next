import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { getTokenFromReq, verifyToken } from "@/utils/jwt";
import { JwtPayload } from "jsonwebtoken";

interface MyJwtPayload extends JwtPayload {
  userId: number;
}

export function withAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = getTokenFromReq(req);
      if (!token) throw new Error("토큰 없음");

      const decoded = verifyToken(token) as MyJwtPayload;
      if (!decoded.userId) throw new Error("userId 없음");

      (req as any).user = { userId: decoded.userId };
      return handler(req, res);
    } catch (err) {
      return res.status(401).json({ message: "인증 실패" });
    }
  };
}
