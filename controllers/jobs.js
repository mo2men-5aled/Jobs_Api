const Job = require("../models/Job");

//get all jobs
const getAllJobs = async (req, res) => {
  const errorlog = [];
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  if (!jobs.length) {
    errorlog.push("no jobs found");
  }
  if (errorlog.length > 0) {
    res.status(404).json({ msg: errorlog });
  } else {
    res.status(200).json({ jobs });
  }
};

//create a new job
const createJob = async (req, res) => {
  const { company, position } = req.body;
  const errorlog = [];

  if (!company) {
    errorlog.push({ company: "company is required" });
  }

  if (!position) {
    errorlog.push({ position: "position is required" });
  }

  if (company.length > 50) {
    errorlog.push({
      company: "company name is too long, it must be lower than 50 characters",
    });
  }

  if (position.length > 100) {
    errorlog.push({
      position:
        "position name is too long, it must be lower than 100 characters",
    });
  }

  if (errorlog.length > 0) {
    return res.status(400).json({ msg: errorlog });
  } else {
    const job = await Job.create({
      company,
      position,
      createdBy: req.user.userId, // this is the user id that comes from the token
    });
    res.status(201).json({ job });
  }
};

//get a single job with the id
const getJob = async (req, res) => {
  const errorlog = [];

  if (req.params.id.length !== 24) {
    errorlog.push(`no jobs found with id ${req.params.id}`);
  } else {
    const job = await Job.findOne({
      createdBy: req.user.userId,
      _id: req.params.id,
    });

    if (!job) {
      errorlog.push(`no jobs found with id ${req.params.id}`);
    } else {
      res.status(200).json({ job });
    }
  }
  if (errorlog.length > 0) {
    res.status(404).json({ msg: errorlog });
  }
};

//update a job
const updateJob = async (req, res) => {
  const errorlog = [];

  const { company, position } = req.body;
  if (!company) {
    errorlog.push("company cannot be empty");
  }

  if (!position) {
    errorlog.push("position cannot be empty");
  }

  if (company && position) {
    const job = await Job.findOneAndUpdate(
      { createdBy: req.user.userId, _id: req.params.id },
      { company: company, position: position },
      { new: true }
    );
    if (!job) {
      errorlog.push(`no jobs found with id ${req.params.id}`);
    } else {
      res.status(200).json({ job });
    }
  }
  if (errorlog.length > 0) {
    res.status(400).json({ msg: errorlog });
  }
};
const deleteJob = async (req, res) => {
  res.json(req.user);
};
module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
