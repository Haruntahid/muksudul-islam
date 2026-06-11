import { Schema, model, models } from "mongoose";

const SkillSchema = new Schema(
  {
    name: { type: String, required: true },
    color: String,
    bg: String,
    icons: [String],
    skills: [String],
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Skill = models.Skill || model("Skill", SkillSchema);

export default Skill;
