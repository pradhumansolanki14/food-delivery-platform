import settingsModel from "../models/settingsModel.js";

// ─── Get settings (public) ────────────────────────────────────
const getSettings = async (req, res) => {
  try {
    let settings = await settingsModel.findOne({});
    if (!settings) settings = await settingsModel.create({});
    res.json({ success: true, data: settings });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// ─── Update settings (admin only) ────────────────────────────
const updateSettings = async (req, res) => {
  try {
    let settings = await settingsModel.findOne({});
    if (!settings) settings = new settingsModel();
    Object.assign(settings, req.body);
    await settings.save();
    res.json({ success: true, message: "Settings updated", data: settings });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating settings" });
  }
};

export { getSettings, updateSettings };
