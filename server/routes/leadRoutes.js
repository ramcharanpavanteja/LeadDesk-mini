const protectAdmin = require("../middleware/authMiddleware");
const express = require("express");
const Lead = require("../models/Lead");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, budget, message } = req.body;

    // Server-side validation
    if (!name || !email || !budget || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    const allowedBudgets = [
      "Under $1,000",
      "$1,000 - $5,000",
      "$5,000 - $10,000",
      "$10,000+",
    ];

    if (!allowedBudgets.includes(budget)) {
      return res.status(400).json({
        message: "Invalid budget range",
      });
    }

    const lead = await Lead.create({
      name,
      email,
      budget,
      message,
    });

    res.status(201).json({
      message: "Lead submitted successfully",
      lead,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// Get all leads - Admin only
router.get("/", protectAdmin, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });

    res.json(leads);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// Update lead status - Admin only
router.patch("/:id/status", protectAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["New", "Contacted", "Closed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.json({
      message: "Status updated successfully",
      lead,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;