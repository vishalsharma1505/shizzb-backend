const SiteSettings = require("../model/siteSettings");



// GET SETTINGS

exports.getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = await SiteSettings.create({
        mobile: "",
        email: "",
        address: "",
      });
    }

    res.json({
      success: true,
      data: settings,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Unable to fetch settings",
    });
  }
};



// UPDATE SETTINGS

exports.updateSettings = async (req, res) => {
  try {
    const { mobile, email, address } = req.body;

    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = new SiteSettings();
    }

    settings.mobile = mobile;
    settings.email = email;
    settings.address = address;

    await settings.save();

    res.json({
      success: true,
      message: "Settings Updated Successfully",
      data: settings,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Unable to update settings",
    });
  }
};