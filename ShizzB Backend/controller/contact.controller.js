const Contact = require("../model/Contact");

// ===================================
// USER - CREATE CONTACT
// ===================================

exports.createContact = async (req, res) => {
  try {

    const contact = await Contact.create(req.body);

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: contact,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ===================================
// ADMIN - GET ALL CONTACTS
// ===================================

exports.getAllContacts = async (req, res) => {

  try {

    const contacts = await Contact.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: contacts,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===================================
// ADMIN - MARK AS READ
// ===================================

exports.markAsRead = async (req, res) => {

  try {

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        status: "read",
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Marked as Read",
      data: contact,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===================================
// ADMIN - DELETE CONTACT
// ===================================

exports.deleteContact = async (req, res) => {

  try {

    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Contact Deleted Successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};