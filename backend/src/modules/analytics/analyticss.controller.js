import analyticsService from "./analyticss.service.js";

const getDashboardSummary = async (req, res, next) => {
  try {
    const { id: userId, companyId, role: userRole } = req.user;
    const data = await analyticsService.getDashboardSummary({
      userId,
      companyId,
      userRole,
    });

    res.status(200).json({
      success: true,
      message: "dashboard data fetched successfully!",
      data,
    });
  } catch (error) {
    next(err);
  }
};

export default { getDashboardSummary };
