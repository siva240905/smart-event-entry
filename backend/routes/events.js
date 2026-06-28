const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const Participant = require("../models/Participant");
const auth = require("../middleware/auth");

// @route   POST /api/events
// @desc    Create a new event
// @access  Private (Admin)
router.post("/", auth, async (req, res) => {
  try {
    const { name, date, venue } = req.body;

    if (!name || !date || !venue) {
      return res.status(400).json({ error: "Please enter all fields" });
    }

    const newEvent = new Event({ name, date, venue });
    await newEvent.save();

    res.json(newEvent);
  } catch (error) {
    console.error("Create Event Route Error:", error);
    res.status(500).json({ error: "Error creating event" });
  }
});

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    console.error("Get Events Route Error:", error);
    res.status(500).json({ error: "Error fetching events" });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event and its associated participants
// @access  Private (Admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    await Event.findByIdAndDelete(eventId);
    await Participant.deleteMany({ eventId });

    res.json({ message: "Event and associated participants deleted successfully" });
  } catch (error) {
    console.error("Delete Event Error:", error);
    res.status(500).json({ error: "Error deleting event" });
  }
});

module.exports = router;
