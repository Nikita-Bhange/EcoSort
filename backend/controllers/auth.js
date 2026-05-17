import bcrypt from "bcryptjs";
import crypto from "crypto";
import { db } from "../connect.js";
import { generateToken } from "../utils/generateToken.js";
import { sendVerificationEmail } from "../utils/email.js";

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const verificationExpiryMs = 24 * 60 * 60 * 1000;

const buildVerificationState = () => {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpiresAt = new Date(Date.now() + verificationExpiryMs);

  return { verificationToken, verificationTokenExpiresAt };
};

const sendAccountVerification = async ({ email, username, token }) => {
  const verifyUrl = `${frontendUrl}/verify-email?token=${token}`;
  await sendVerificationEmail({ to: email, username, verifyUrl });
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const [users] = await db.promise().query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!users.length)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = users[0];

    if (user.role !== role)
      return res.status(403).json({ message: "Role mismatch" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    if (!user.is_verified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
        code: "EMAIL_NOT_VERIFIED",
      });
    }

    const token = generateToken(user);
    console.log("Generated Token:", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        token,
        username: user.username,
        email: user.email,
        role: user.role,
        is_verified: Boolean(user.is_verified),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const userRole = role === "admin" ? "admin" : "user";

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    const [existing] = await db.promise().query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const { verificationToken, verificationTokenExpiresAt } = buildVerificationState();

    const [result] = await db.promise().query(
      `INSERT INTO users
      (username, email, password, role, is_verified, verification_token, verification_token_expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        username,
        email,
        hashedPassword,
        userRole,
        0,
        verificationToken,
        verificationTokenExpiresAt,
      ]
    );

    await sendAccountVerification({
      email,
      username,
      token: verificationToken,
    });

    res
      .status(201)
      .json({
        message: "Registered successfully. Please verify your email before logging in.",
        user: {
          id: result.insertId,
          username,
          email,
          role: userRole,
          is_verified: false,
        },
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    const [users] = await db.promise().query(
      `SELECT id, verification_token_expires_at, is_verified
       FROM users
       WHERE verification_token = ?
       LIMIT 1`,
      [token]
    );

    if (!users.length) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    const user = users[0];

    if (user.is_verified) {
      return res.json({ message: "Email already verified" });
    }

    if (!user.verification_token_expires_at || new Date(user.verification_token_expires_at) < new Date()) {
      return res.status(400).json({ message: "Verification link has expired" });
    }

    await db.promise().query(
      `UPDATE users
       SET is_verified = ?, verified_at = NOW(), verification_token = NULL, verification_token_expires_at = NULL
       WHERE id = ?`,
      [1, user.id]
    );

    return res.json({ message: "Email verified successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const [users] = await db.promise().query(
      "SELECT id, username, email, is_verified FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (!users.length) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    const user = users[0];

    if (user.is_verified) {
      return res.status(400).json({ message: "This email is already verified" });
    }

    const { verificationToken, verificationTokenExpiresAt } = buildVerificationState();

    await db.promise().query(
      `UPDATE users
       SET verification_token = ?, verification_token_expires_at = ?
       WHERE id = ?`,
      [verificationToken, verificationTokenExpiresAt, user.id]
    );

    await sendAccountVerification({
      email: user.email,
      username: user.username,
      token: verificationToken,
    });

    return res.json({ message: "Verification email sent" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", { path: "/" }).json({ message: "Logged out" });
};

