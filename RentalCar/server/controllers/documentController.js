import imagekit from "../configs/imageKit.js";
import Document from "../models/Document.js";
import User from "../models/User.js";

export const uploadDocument = async (req, res) => {
  try {
    const userId = req.user._id;
    const { documentType } = req.body;

    if (!documentType) {
      return res.status(400).json({ success: false, message: "documentType is required" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "PDF file is required" });
    }

    // upload PDF na ImageKit
    const uploadRes = await imagekit.upload({
      file: req.file.buffer.toString("base64"),
      fileName: `doc_${documentType}_${Date.now()}.pdf`,
      folder: "/documents",
    });

    const doc = await Document.create({
      user: userId,
      documentType,
      fileUrl: uploadRes.url,
    });

    await User.findByIdAndUpdate(userId, { $push: { documents: doc._id } });

    return res.json({ success: true, message: "Document uploaded", document: doc });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
