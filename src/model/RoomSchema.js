import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema({
  buyerId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isJoined: { type: Boolean, default: false },
  isPaymentDone: { type: Boolean, default: false },
});

const sellerSchema = new mongoose.Schema({
  sellerId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isJoined: { type: Boolean, default: false },
  accountEmail: { type: String},
  accountPassword: { type: String},
});

const roomSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true, unique: true },
    buyer: buyerSchema,
    seller: sellerSchema,
  },
  {
    timestamps: true,
  }
);
const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);
export default Room;
