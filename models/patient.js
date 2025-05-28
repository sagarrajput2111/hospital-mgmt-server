import mongoose from "mongoose";
import { nanoid } from "nanoid";

const remarkSchema = new mongoose.Schema(
  {
    note: {
      type: String,
      required: true,
    },
    servedAt: {
      type: Date,
      default: Date.now,
    },
    servedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { _id: false }
);

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      unique: true,
    },

    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,

      // sparse: true, // Makes index ignore null/missing values
      // index: {
      //   unique: true,
      //   partialFilterExpression: { email: { $exists: true, $ne: null } },
      // },
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["1", "2", "3", "4", "5"],
      required: true,
      default: "1",
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    contact: {
      type: String,
    },
    emergencyContact: {
      type: String,
    },
    address: {
      type: String,
    },
    medicalHistory: {
      type: String,
    },
    bloodGroup: {
      type: String,
    },
    addmissionDate: {
      type: Date,
      default: Date.now,
    },
    dischargeDate: {
      type: Date,
    },
    bedNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    isDischarged: {
      type: Boolean,
      default: false,
    },
    servedCount: {
      type: Number,
      default: 0,
    },
    initialSymptoms: {
      type: String,
      required: true,
    },
    finalRemarks: String,
    remarks: [remarkSchema],
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to auto-generate patientId
patientSchema.pre("save", async function (next) {
  if (!this.patientId) {
    this.patientId = `PAT-${nanoid(6)}`; // e.g., PAT-8Z2X1D
  }
  next();
});

export default mongoose.model("Patient", patientSchema);
