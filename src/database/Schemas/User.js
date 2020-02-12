import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
  _id: { type: String, required: true },
  given_name: String,
  family_name: String,
  email: { type: String, required: true },
  picture: String
});

// this fixes an error [OverwriteModelError]
mongoose.models = {};
mongoose.modelSchemas = {};

export default mongoose.model("User", UserSchema);
