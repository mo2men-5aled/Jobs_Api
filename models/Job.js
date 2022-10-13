const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: { type: String },
    position: { type: String },
    status: {
      type: String,
      enum: ["interview", "pending", "declined"],
      default: "pending",
    },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
