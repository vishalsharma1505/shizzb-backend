const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.SiteSettings ||
  mongoose.model("SiteSettings", siteSettingsSchema);