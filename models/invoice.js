import mongoose from "mongoose";
import { nanoid } from "nanoid";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    doctorCharges: {
      type: Number,
      required: true,
      min: 0,
    },

    bedCharges: {
      type: Number,
      required: true,
      min: 0,
    },

    medicineCharges: {
      type: Number,
      default: 0,
      min: 0,
    },

    otherCharges: {
      type: Number,
      default: 0,
      min: 0,
    },

    gstPercentage: {
      type: Number,
      required: true,
      default: 18, // example
      min: 0,
    },

    gstCharge:{
        type:Number,
        required:true,
        default:0,
        min:0
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: {
      type: Date,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "UPI", "Insurance", "Other"],
    },

    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

// Auto-generate invoice number
invoiceSchema.pre("save", function (next) {
  if (!this.invoiceNumber) {
    this.invoiceNumber = `INV-${nanoid(8)}`;
  }
  next();
});

export default mongoose.model("Invoice", invoiceSchema);
