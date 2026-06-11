import { Router } from "express";
import { User } from "../models/User";
import { verifyPassword, generateToken, hashPassword } from "../lib/auth";
import { adminAuth } from "../middlewares/adminAuth";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ ok: false, error: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ ok: false, error: "Invalid username or password" });
    }

    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ ok: false, error: "Invalid username or password" });
    }

    const token = generateToken(user.username);
    return res.json({ ok: true, token, username: user.username });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

router.put("/credentials", adminAuth, async (req, res) => {
  try {
    const username = (req as { adminUser?: string }).adminUser;
    if (!username) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }

    const { currentPassword, newUsername, newPassword } = req.body;
    if (!currentPassword) {
      return res.status(400).json({ ok: false, error: "Current password is required" });
    }

    const user = await User.findOne({ username });
    if (!user || !verifyPassword(currentPassword, user.password)) {
      return res.status(401).json({ ok: false, error: "Current password is incorrect" });
    }

    if (newUsername && newUsername !== user.username) {
      const taken = await User.findOne({ username: newUsername });
      if (taken) {
        return res.status(409).json({ ok: false, error: "Username already taken" });
      }
      user.username = newUsername;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ ok: false, error: "New password must be at least 6 characters" });
      }
      user.password = hashPassword(newPassword);
    }

    await user.save();
    const token = generateToken(user.username);
    return res.json({ ok: true, token, username: user.username, message: "Credentials updated" });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

export default router;
