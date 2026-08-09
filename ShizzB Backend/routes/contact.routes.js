const express = require("express");
const router = express.Router();

const contactController = require("../controller/contact.controller");

// ======================================
// TEST
// ======================================

router.get("/", (req, res) => {
  res.send("Contact Route Working");
});

// ======================================
// USER
// ======================================

// Contact Form Submit
router.post("/", contactController.createContact);

// ======================================
// ADMIN
// ======================================

// Get All Messages
router.get(
  "/admin/all",
  contactController.getAllContacts
);

// Mark As Read
router.patch(
  "/admin/read/:id",
  contactController.markAsRead
);

// Delete Message
router.delete(
  "/admin/delete/:id",
  contactController.deleteContact
);

module.exports = router;