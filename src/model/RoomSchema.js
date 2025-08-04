import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true },
    platform: { type: String, required: true },
    buyerEmail: { type: String, required: true },
    buyerPassword: { type: String, required: true },
    sellerEmail: { type: String, required: true },
    sellerPassword: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);
export default Room;
