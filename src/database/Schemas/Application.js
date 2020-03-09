import mongoose from "mongoose";
import ApplicationStepSchema from "./ApplicationStep";

const { Schema } = mongoose;

const ApplicationSchema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  steps: [ApplicationStepSchema],
  isDeleted: { type: Boolean, default: false },
  isOpen: { type: Boolean, default: true },
  closedDate: Date
});

// this fixes an error [OverwriteModelError]
mongoose.models = {};
mongoose.modelSchemas = {};

export default mongoose.model("Application", ApplicationSchema);
