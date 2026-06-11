import { Request, Response } from "express";
import { seedPortfolioData } from "../lib/bootstrap";

/** Dev-only: force re-seed portfolio content (does not reset admin users). */
export async function seedDatabase(_req: Request, res: Response) {
  try {
    await seedPortfolioData(true);
    res.json({ ok: true, message: "Portfolio data re-seeded successfully" });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
}
