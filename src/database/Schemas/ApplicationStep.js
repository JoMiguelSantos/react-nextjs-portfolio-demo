import mongoose from "mongoose";

const { Schema } = mongoose;

const ApplicationStepSchema = new Schema({
  formId: { type: String, required: true },
  "interviewer-name": String,
  "interview-time": Date,
  "salary-gross-per-year": Number,
  benefits: String,
  "decision-deadline": Date,
  "job-offer-date": Date,
  "company-name": String,
  "job-title": String,
  location: String,
  industry: String,
  source: String,
  description: String,
  "application-date": Date,
  resume: Object,
  "cover-letter": Object,
  notes: String,
  attire: String,
  "duration-in-minutes": Number,
  isDeleted: { type: Boolean, default: false }
});

// this fixes an error [OverwriteModelError]
mongoose.models = {};
mongoose.modelSchemas = {};

export default ApplicationStepSchema;
