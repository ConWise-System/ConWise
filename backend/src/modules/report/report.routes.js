import express from "express";
import reportController from "./report.controller.js";
import validate from "../../middlewares/validate.middleware.js";
import authenticate from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";
import {
  createReportSchema,
  filerReportByTypeSchema,
} from "./report.validation.js";
import { ROLES } from "../../config/constants.js";
import { get } from "https";

const router = express.Router();

router.use(authenticate);

// Site Supervisors/Engineers submit reports
router.post(
  "/",
  authorizeRoles(ROLES.SITE_SUPERVISOR),
  validate(createReportSchema),
  reportController.submitReport,
);

// Managers and Admins view reports
router.get(
  "/",
  authorizeRoles(ROLES.PROJECT_MANAGER, ROLES.COMPANY_ADMIN),
  reportController.getProjectReports,
);

//get all reports
router.get(
  "/all",
  authorizeRoles(
    ROLES.PROJECT_MANAGER,
    ROLES.SITE_ENGINEER,
    ROLES.SITE_SUPERVISOR,
    ROLES.COMPANY_ADMIN,
  ),
  reportController.getAllReports,
);

//download report
router.get(
  "/:reportId/download",
  authorizeRoles(ROLES.PROJECT_MANAGER, ROLES.COMPANY_ADMIN),
  reportController.downloadReport,
);

// filter report

router.get(
  "/filter-report-by-type",
  authorizeRoles(ROLES.PROJECT_MANAGER, ROLES.COMPANY_ADMIN),
  validate(filerReportByTypeSchema, "query"),
  reportController.reportFilter,
);

// delete report
router.delete(
  "/:reportId",
  authorizeRoles(ROLES.PROJECT_MANAGER, ROLES.COMPANY_ADMIN),
  reportController.deleteReport,
);

export default router;
