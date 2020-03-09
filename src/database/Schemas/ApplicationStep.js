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
  "job-link": String,
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
  "test-type": String,
  "test-subjects": String,
  "received-date": Date,
  "time-to-complete-in-minutes": Number,
  "deliver-deadline": Date,
  isDeleted: { type: Boolean, default: false }
});

// this fixes an error [OverwriteModelError]
mongoose.models = {};
mongoose.modelSchemas = {};

export default ApplicationStepSchema;
