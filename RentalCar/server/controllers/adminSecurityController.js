import SecurityLog from "../models/SecurityLog.js";

// Get security logs (ADMIN only)
export const getSecurityLogs = async (req, res) => {
  try {
    const { event, limit = 50 } = req.query;

    const query = {};

    if (event) {
      query.event = event;
    }

    const logs = await SecurityLog.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate("user", "email name");

    return res.status(200).json({
      success: true,
      count: logs.length,
      logs
    });

  } catch (error) {
    console.error("Get security logs error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch security logs"
    });
  }
};