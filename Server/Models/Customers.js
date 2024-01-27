import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        // unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      profilePic: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      }
});

export default mongoose.model("CustomersModel", customerSchema);