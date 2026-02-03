import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    documentType: {
      type: String,
      enum: ["DRIVING_LICENSE", "ID_CARD", "PASSPORT", "OTHER"],
      required: true,
    },

    fileUrl: { type: String, required: true },

    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.model("Document", documentSchema);
