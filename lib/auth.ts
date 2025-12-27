import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const ACCESS_EXP = "15m";
const REFRESH_EXP = "7d";

export const hashPassword = (password: string) =>
bcrypt.hash(password, 10);

export const comparePassword = (
password: string,
hashed: string
) => bcrypt.compare(password, hashed);

export const signAccessToken = (payload: object) =>
jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: ACCESS_EXP });

export const signRefreshToken = (payload: object) =>
jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: REFRESH_EXP });

export const verifyRefreshToken = (token: string) =>
jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
