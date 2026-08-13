import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = "fate-summoning-chamber-secret-key-2026";
const JWT_EXPIRES_IN = "24h";

// Hash a password
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare password with hash
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Generate JWT token
export function generateToken(user) {
  return jwt.sign(
    { userId: user.user_id, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Verify JWT token
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// Middleware to protect routes
export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided.", code: "UNAUTHORIZED" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token.", code: "UNAUTHORIZED" });
  }
}