import { Experience } from "../models/Experience";
import { Skill } from "../models/Skill";
import { Project } from "../models/Project";
import { Social } from "../models/Social";
import { Setting } from "../models/Setting";
import { User } from "../models/User";
import { hashPassword } from "./auth";
import { logger } from "./logger";
import { SEED_DATA } from "../data/seedData";

export async function seedPortfolioData(force = false): Promise<boolean> {
  const seededFlag = await Setting.findOne({ key: "_portfolio_seeded" });
  if (seededFlag && !force) {
    logger.info("Portfolio data already seeded — skipping");
    return false;
  }

  if (force || !seededFlag) {
    await Promise.all([
      Experience.deleteMany({}),
      Skill.deleteMany({}),
      Project.deleteMany({}),
      Social.deleteMany({}),
      Setting.deleteMany({ key: { $ne: "_portfolio_seeded" } }),
    ]);
  }

  const [experiences, skills, projects, socials] = await Promise.all([
    Experience.insertMany(SEED_DATA.experiences),
    Skill.insertMany(SEED_DATA.skills),
    Project.insertMany(SEED_DATA.projects),
    Social.insertMany(SEED_DATA.socials),
  ]);

  await Promise.all(
    Object.entries(SEED_DATA.settings).map(([key, value]) =>
      Setting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true }),
    ),
  );

  await Setting.findOneAndUpdate(
    { key: "_portfolio_seeded" },
    { value: { version: 1, seededAt: new Date().toISOString() } },
    { upsert: true, new: true },
  );

  logger.info(
    {
      experiences: experiences.length,
      skills: skills.length,
      projects: projects.length,
      socials: socials.length,
      settings: Object.keys(SEED_DATA.settings).length,
    },
    "Portfolio data seeded from portfolioSource.json",
  );

  return true;
}

export async function ensureDefaultAdmin(): Promise<void> {
  const count = await User.countDocuments();
  if (count > 0) return;

  await User.create({
    username: "admin",
    password: hashPassword("admin"),
  });

  logger.info("Created default admin (username: admin, password: admin)");
}

export async function bootstrapDatabase(): Promise<void> {
  await ensureDefaultAdmin();

  const seededFlag = await Setting.findOne({ key: "_portfolio_seeded" });
  if (!seededFlag) {
    await seedPortfolioData(true);
  }
}
