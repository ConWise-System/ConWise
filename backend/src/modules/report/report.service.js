import prisma from "../../config/prisma.js";

const createReport = async (userId, companyId, reportData) => {
  return await prisma.report.create({
    data: {
      reportTitle: reportData.reportTitle,
      reportType: reportData.reportType,
      reportDate: new Date(reportData.reportDate),
      workCompleted: reportData.workCompleted,
      workersPresent: Number(reportData.workersPresent),
      materialsUsed: reportData.materialsUsed,
      weatherCondition: reportData.weatherCondition,
      challenges: reportData.challenges,
      progressPhotoUrl: reportData.progressPhotoUrl,

      // Relations - Use connect for all three
      user: {
        connect: { id: Number(userId) },
      },
      project: {
        connect: { id: Number(reportData.projectId) },
      },
      company: {
        connect: { id: Number(companyId) },
      },
    },
    include: {
      user: true, // optional - if you want to return user data
      project: true, // optional
      company: true, // optional
    },
  });
};

const getReportsByProject = async (projectId) => {
  return await prisma.report.findMany({
    where: {
      projectId: Number(projectId),
    },
    include: {
      user: {
        select: { firstName: true, lastName: true, role: true },
      },
    },
    orderBy: { reportDate: "desc" },
  });
};

const getAllReports = async () => {
  return await prisma.report.findMany({
    include: {
      user: {
        select: { firstName: true, lastName: true, role: true },
      },
      project: {
        select: { projectName: true, location: true, projectBudget: true },
      },
      company: {
        select: { name: true, address: true },
      },
    },
    orderBy: { reportDate: "desc" },
  });
};


const downloadReport = async (reportId) => {
  return await prisma.report.findUnique({
    where: { id: Number(reportId) },
    include: {
      user: {
        select: { firstName: true, lastName: true, email: true },
      },
      project: {
        select: { projectName: true, location: true, projectBudget: true },
      },
      company: {
        select: { name: true, address: true },
      },
    },
  });
};

const deleteReport = async (reportId) => {
  return await prisma.report.delete({
    where: { id: Number(reportId) },
  });
};


export default {
  createReport,
  getReportsByProject,
  downloadReport,
  getAllReports,
  deleteReport
};
