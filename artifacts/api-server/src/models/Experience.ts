import { Schema, model, models } from "mongoose";

const ExperienceSchema = new Schema(
  {
    title: { type: String, required: true },
    company: String,
    period: String,
    current: { type: Boolean, default: false },
    description: String,
    highlights: [String],
    tags: [String],
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Experience =
  models.Experience || model("Experience", ExperienceSchema);

export default Experience;
