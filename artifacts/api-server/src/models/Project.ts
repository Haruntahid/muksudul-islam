import { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    stack: [String],
    tags: [String],
    github: String,
    live: String,
    icons: [String],
    accentColor: String,
    borderColor: String,
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Project = models.Project || model("Project", ProjectSchema);

export default Project;
