import { Schema, model, models } from "mongoose";

const SocialSchema = new Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, default: "" },
    icon: String,
    label: String,
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Social = models.Social || model("Social", SocialSchema);

export default Social;
