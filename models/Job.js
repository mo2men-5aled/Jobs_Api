const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: { type: String },
    position: { type: String },
    status: {
      type: String,
      default: "pending",
    },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true } // this will add createdAt and updatedAt fields
);

module.exports = mongoose.model("Job", JobSchema);
