import mongoose from "mongoose";

const vendorWalletSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true,
    unique: true
  },
  pendingBalance: {
    type: Number,
    default: 0
  },
  availableBalance: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  totalSettled: {
    type: Number,
    default: 0
  },
  totalRefunded: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: "INR"
  },
  lastSettlementAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

const vendorWalletModel = mongoose.models.vendorWallet || mongoose.model("vendorWallet", vendorWalletSchema);

export default vendorWalletModel;
