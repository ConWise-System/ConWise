import catchAsync from "../../utils/catchAsync.js";
import reportService from "./report.service.js";
import PDFDocument from "pdfkit";

const handleError = (res, error, context) => {
  if (error.statusCode === 403) {
    return res.status(403).json({ success: false, message: error.message });
  }
  if (error.statusCode === 404) {
    return res.status(404).json({ success: false, message: error.message });
  }
  if (error.statusCode === 409) {
    return res.status(409).json({ success: false, message: error.message });
  }
  console.error(`Error in ${context}:`, error);
  return res
    .status(500)
    .json({ success: false, message: "Internal server error." });
};

const submitReport = async (req, res) => {
  try {
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
  } catch (error) {
    handleError(res, error, "submitReport");
  }
};

const getProjectReports = async (req, res) => {
  try {
    const { projectId } = req.query;
    const reports = await reportService.getReportsByProject(
      projectId,
      req.user.companyId,
    );

    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    handleError(res, error, "getProjectReports");
  }
};


// get company report
const getAllReports = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    const reports = await reportService.getAllReports(companyId);

    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    handleError(res, error, "getAllReports");
  }
};

const downloadReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await reportService.downloadReport(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found!",
      });
    }

    //1. create pdf document

    const doc = new PDFDocument({ margin: 50, size: "A4" });

    // 2. Set Headers for Download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Report-${report.reportTitle.replace(/\s+/g, "_")}.pdf`,
    );

    // 3. Pipe the PDF into the response
    doc.pipe(res);

    // --- PDF CONTENT DESIGN ---

    // Header
    doc.fontSize(20).text(report.company.name, { align: "center" });
    doc.fontSize(10).text(report.company.address, { align: "center" });
    doc.fontSize(10).text("Construction Site Report", { align: "center" });
    doc.moveDown();
    doc.moveTo(50, 100).lineTo(550, 100).stroke();
    doc.moveDown();

    // Project Info Table-like structure
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(`Project: `, { continued: true })
      .font("Helvetica")
      .text(report.project.projectName);
    doc
      .font("Helvetica-Bold")
      .text(`Date: `, { continued: true })
      .font("Helvetica")
      .text(new Date(report.reportDate).toDateString());
    doc
      .font("Helvetica-Bold")
      .text(`Submitted By: `, { continued: true })
      .font("Helvetica")
      .text(`${report.user.firstName} ${report.user.lastName}`);

    doc.moveDown();
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(report.reportTitle, { underline: true });
    doc.moveDown(0.5);

    // Report Details
    const details = [
      { label: "Report Type", value: report.reportType },
      { label: "Workers Present", value: report.workersPresent },
      { label: "Weather", value: report.weatherCondition || "N/A" },
    ];

    details.forEach((detail) => {
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .text(`${detail.label}: `, { continued: true })
        .font("Helvetica")
        .text(detail.value);
    });

    doc.moveDown();
    doc.font("Helvetica-Bold").text("Work Completed:");
    doc.font("Helvetica").text(report.workCompleted);

    if (report.challenges) {
      doc.moveDown();
      doc.font("Helvetica-Bold").text("Challenges/Issues:");
      doc.font("Helvetica").text(report.challenges);
    }

    // 4. Finalize the PDF
    doc.end();
  } catch (error) {
    handleError(res, error, "downloadReport");
  }
};

const reportFilter = async (req, res) => {
  try {
    const { reportType } = req.query;

    const report = await reportService.reportFilter(reportType);

    res.status(200).json({
      success: true,
      message:
        report.length > 0 ? "Report found successfully" : "No report found",
      data: {
        report,
        count: report.length,
      },
    });
  } catch (error) {
    handleError(res, error, "reportFilter");
  }
};

const deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    await reportService.deleteReport(reportId);

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    handleError(res, error, "deleteReport");
  }
};

export default {
  submitReport,
  getProjectReports,
  getAllReports,
  downloadReport,
  reportFilter,
  deleteReport,
};
