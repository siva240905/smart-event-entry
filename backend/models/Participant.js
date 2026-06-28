const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  name: String,
  email: String,
  college: String,
  qrId: String,
  checkedIn: {
    type: Boolean,
    default: false
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"  // 🔥 MUST MATCH EVENT MODEL NAME
  }
});

module.exports = mongoose.model("Participant", participantSchema);
