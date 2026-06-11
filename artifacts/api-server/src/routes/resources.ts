import { Router } from "express";
import { adminAuth } from "../middlewares/adminAuth";
import { Experience } from "../models/Experience";
import { Skill } from "../models/Skill";
import { Project } from "../models/Project";
import { Social } from "../models/Social";
import { Setting } from "../models/Setting";
import { publicAggregate } from "../controllers/aggregate";

const router = Router();

function makeCrud(model: any) {
  const r = Router();

  r.get("/", adminAuth, async (req, res) => {
    const docs = await model.find({}).sort({ order: 1, createdAt: -1 });
    res.json({ ok: true, data: docs });
  });

  r.get("/public", async (_req, res) => {
    const docs = await model.find({}).sort({ order: 1, createdAt: -1 });
    res.json({ ok: true, data: docs });
  });

  r.post("/", adminAuth, async (req, res) => {
    const doc = await model.create(req.body);
    res.json({ ok: true, data: doc });
  });

  r.put("/:id", adminAuth, async (req, res) => {
    const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ ok: true, data: doc });
  });

  r.delete("/:id", adminAuth, async (req, res) => {
    await model.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  });

  return r;
}

router.use("/experiences", makeCrud(Experience));
router.use("/skills", makeCrud(Skill));
router.use("/projects", makeCrud(Project));
router.use("/socials", makeCrud(Social));

// settings (key/value)
router.get("/settings", adminAuth, async (_req, res) => {
  const items = await Setting.find({});
  res.json({ ok: true, data: items });
});

router.get("/settings/public", async (_req, res) => {
  const items = await Setting.find({});
  const ret: Record<string, any> = {};
  items.forEach((i) => (ret[i.key] = i.value));
  res.json({ ok: true, data: ret });
});

router.post("/settings", adminAuth, async (req, res) => {
  const { key, value } = req.body;
  const up = await Setting.findOneAndUpdate(
    { key },
    { value },
    { upsert: true, new: true },
  );
  res.json({ ok: true, data: up });
});

router.put("/settings/:key", adminAuth, async (req, res) => {
  const up = await Setting.findOneAndUpdate(
    { key: req.params.key },
    { value: req.body.value },
    { new: true },
  );
  res.json({ ok: true, data: up });
});

router.delete("/settings/:key", adminAuth, async (req, res) => {
  await Setting.deleteOne({ key: req.params.key });
  res.json({ ok: true });
});

// public aggregate
router.get("/public-aggregate", publicAggregate);

export default router;
