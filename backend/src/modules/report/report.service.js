import prisma from "../../config/prisma.js";



const createReport = async (userId, companyId, reportData) => {

  try {
    
    // The companyId of the project report is creating and the user company id should be the same ,
    // if it not the current implementation is one user is creating report for another company project wich is logically not correct user can create report for only their companies project
  
    if (reportData.projectId) {
      const project = await prisma.project.findUnique({
        where: { id: Number(reportData.projectId) },
        select: { companyId: true },
      });
      if (project && project.companyId !== Number(companyId)) {
        throw new Error("Cannot create report for a project that does not belong to this company.");
      }
    }
 

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
  } catch (error) {
    throw new Error(error);
  }
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

// filter report by reportType DAILY OR WEEKLY
const filterReport = async (reportType) => {
  return await prisma.report.findMany({
    where: {
      reportType: reportType,
    },
  });
};

export default {
  createReport,
  getReportsByProject,
  getAllReports,
  downloadReport,
  filterReport,
};
