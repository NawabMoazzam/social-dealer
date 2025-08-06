import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true },
    buyerId: { type: String, required: true, unique: true },
    buyerEmail: { type: String, required: true },
    buyerPassword: { type: String, required: true },
    sellerId: { type: String, required: true, unique: true },
    sellerEmail: { type: String, required: true },
    sellerPassword: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);
export default Room;
