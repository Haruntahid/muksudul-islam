import { Request, Response } from "express";
import { Experience } from "../models/Experience";
import { Skill } from "../models/Skill";
import { Project } from "../models/Project";
import { Social } from "../models/Social";
import { Setting } from "../models/Setting";

export async function publicAggregate(_req: Request, res: Response) {
  const [experiences, skills, projects, socials, settings] = await Promise.all([
    Experience.find({}).sort({ order: 1 }),
    Skill.find({}).sort({ order: 1 }),
    Project.find({}).sort({ order: 1 }),
    Social.find({}).sort({ order: 1 }),
    Setting.find({}),
  ]);

  const settingsObj: Record<string, unknown> = {};
  settings.forEach((s) => {
    if (s.key !== "_portfolio_seeded") settingsObj[s.key] = s.value;
  });

  res.json({
    ok: true,
    data: { experiences, skills, projects, socials, settings: settingsObj },
  });
}
