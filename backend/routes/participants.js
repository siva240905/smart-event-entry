const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

const Participant = require("../models/Participant");
const Event = require("../models/Event");
const auth = require("../middleware/auth");

// @route   GET /api/participants/stats
// @desc    Get checking stats
// @access  Private (Admin)
router.get("/stats", auth, async (req, res) => {
  try {
    const total = await Participant.countDocuments();
    const checkedIn = await Participant.countDocuments({ checkedIn: true });

    res.json({
      total,
      checkedIn,
      percentage: total > 0 ? ((checkedIn / total) * 100).toFixed(2) : 0
    });
  } catch (error) {
    console.error("Stats Route Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// @route   GET /api/participants
// @desc    Get all participants
// @access  Private (Admin)
router.get("/", auth, async (req, res) => {
  try {
    const participants = await Participant.find().populate("eventId");
    res.json(participants);
  } catch (error) {
    console.error("Get Participants Route Error:", error);
    res.status(500).json({ message: "Error fetching participants" });
  }
});

// @route   POST /api/participants/register
// @desc    Register a new participant
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { name, email, college, eventId } = req.body;

    if (!name || !email || !college || !eventId) {
      return res.status(400).json({ error: "Please enter all fields" });
    }

    const qrId = uuidv4();

    const newParticipant = new Participant({
      name,
      email,
      college,
      eventId,
      qrId
    });

    await newParticipant.save();
    res.json({ message: "Registration successful", qrId });
  } catch (error) {
    console.error("Register Route Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// @route   POST /api/participants/verify
// @desc    Scan and check-in participant
// @access  Private (Admin)
router.post("/verify", auth, async (req, res) => {
  try {
    const { qrId } = req.body;

    if (!qrId) {
      return res.status(400).json({ message: "QR ID missing" });
    }

    const participant = await Participant.findOne({ qrId });

    if (!participant) {
      return res.status(404).json({ message: "Invalid QR Code" });
    }

    if (participant.checkedIn) {
      return res.json({ message: "Already Checked In" });
    }

    participant.checkedIn = true;
    await participant.save();

    res.json({ message: "Check-in Successful" });
  } catch (error) {
    console.error("Verify Route Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/participants/generate-pass
// @desc    Generate PDF entry pass with QR code
// @access  Public
router.post("/generate-pass", async (req, res) => {
  try {
    const { name, email, college, qrId } = req.body;

    if (!name || !email || !college || !qrId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=Event_Pass.pdf");

    doc.pipe(res);

    // Background
    doc.rect(0, 0, 595, 842).fill("#000000");

    // Title
    doc
      .fillColor("#ff0000")
      .fontSize(24)
      .text("BLITZMAC'26 ENTRY PASS", 0, 80, { align: "center" });

    doc
      .fillColor("#ffffff")
      .fontSize(16)
      .text(`Name: ${name}`, 100, 150)
      .text(`Email: ${email}`, 100, 180)
      .text(`College: ${college}`, 100, 210)
      .text(`Pass ID: ${qrId}`, 100, 240);

    const qrImage = await QRCode.toDataURL(qrId);
    const qrBase64 = qrImage.replace(/^data:image\/png;base64,/, "");
    const qrBuffer = Buffer.from(qrBase64, "base64");

    doc.image(qrBuffer, 350, 150, { width: 150 });
    doc.end();

  } catch (error) {
    console.error("PDF Pass Generation Error:", error);
    res.status(500).json({ message: "PDF generation failed" });
  }
});

// @route   DELETE /api/participants/:id
// @desc    Delete a participant
// @access  Private (Admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    const participantId = req.params.id;

    const participant = await Participant.findById(participantId);
    if (!participant) {
      return res.status(404).json({ error: "Participant not found" });
    }

    await Participant.findByIdAndDelete(participantId);
    res.json({ message: "Participant deleted successfully" });
  } catch (error) {
    console.error("Delete Participant Error:", error);
    res.status(500).json({ error: "Error deleting participant" });
  }
});

module.exports = router;
