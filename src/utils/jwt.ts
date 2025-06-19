// jwt.ts
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextApiRequest } from "next";
const SECRET = process.env.JWT_SECRET || "dev-secret";

export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET);
}

export function getTokenFromReq(req: NextApiRequest) {
  const cookie = req.headers.cookie;
  const token = cookie
    ?.split(";")
    ?.find((c) => c.trim().startsWith("access_token="))
    ?.split("=")[1];
  return token;
}
