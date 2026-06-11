import { Router } from "express";
import { Message } from "../models/Message";
import { adminAuth } from "../middlewares/adminAuth";

const router = Router();

// Submit a new contact message (public)
router.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ ok: false, error: "All fields are required" });
    }

    const newMessage = await Message.create({ name, email, subject, message });
    return res.json({ ok: true, data: newMessage });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

// Get all contact messages (admin only)
router.get("/inbox", adminAuth, async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    return res.json({ ok: true, data: messages });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

// Delete a contact message (admin only)
router.delete("/inbox/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    return res.json({ ok: true, message: "Message deleted successfully" });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

export default router;
