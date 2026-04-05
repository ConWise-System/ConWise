import catchAsync from "../../utils/catchAsync.js";
import reportService from "./report.service.js";

const submitReport = catchAsync(async (req, res) => {
  const report = await reportService.createReport(
    req.user.id, // userId
    req.user.companyId, // companyId
    req.body,
  );

  res.status(201).json({
    success: true,
    message: "Site report submitted successfully",
    data: report,
  });
});

const getProjectReports = catchAsync(async (req, res) => {
  const { projectId } = req.query;
  const reports = await reportService.getReportsByProject(
    projectId,
    req.user.companyId,
  );

  res.status(200).json({
    success: true,
    data: reports,
  });
});

export default {
  submitReport,
  getProjectReports,
};
