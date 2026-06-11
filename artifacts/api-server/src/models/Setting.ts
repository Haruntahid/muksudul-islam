import { Schema, model, models } from "mongoose";

const SettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: Schema.Types.Mixed,
  },
  { timestamps: true },
);

export const Setting = models.Setting || model("Setting", SettingSchema);

export default Setting;
