import catchAsync from "../../utils/catchAsync.js";
import authService from "./auth.service.js";

const registerCompany = catchAsync(async (req, res) => {
  const result = await authService.registerCompany(req.body);

  return res.status(201).json({
    success: true,
    message: result.message,
    data: {
      user: result.user,
      company: result.company,
      verification: result.verification,
    },
  });
});


const login = catchAsync(async (req, res) => {
  const result = await authService.loginUser(req.body, {
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
  });

  return res.status(200).json({
    success: true,
    message: result.message,
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      refreshTokenExpiresAt: result.refreshTokenExpiresAt,
      user: result.user,
      redirectTo: result.redirectTo,
    },
  });
});

const verifyAccount = catchAsync(async (req, res) => {
  const result = await authService.verifyAccount(req.body);

  return res.status(200).json({
    success: true,
    message: result.message,
    data: {
      user: result.user,
      redirectTo: result.redirectTo,
    },
  });
});

const getCurrentUser = catchAsync(async (req, res) => {
  const result = await authService.getMyProfile(req.user.id);

  return res.status(200).json({
    success: true,
    message: "Profile fetched successfully.",
    data: result,
  });
});

const createStaffUser = catchAsync(async (req, res) => {
  const result = await authService.createStaffUser(req.user, req.body);

  return res.status(201).json({
    success: true,
    message: result.message,
    data: {
      user: result.user,
      verification: result.verification ?? null,
    },
  });
});


const changePassword = catchAsync(async (req, res) => {
  const result = await authService.changePassword(
    req.user.id,
    req.body.newPassword,
  );

  return res.status(200).json({
    success: true,
    message: result.message,
    data: result.user,
  });
});

const listCompanyUsers = catchAsync(async (req, res) => {
  const result = await authService.listCompanyUsers(req.user, req.query);

  return res.status(200).json({
    success: true,
    message: "Users fetched successfully.",
    data: result,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const result = await authService.getUserById(req.user, req.params.userId);

  return res.status(200).json({
    success: true,
    message: "User fetched successfully.",
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const result = await authService.updateProfile(
    req.user,
    req.params.userId,
    req.body,
  );

  return res.status(200).json({
    success: true,
    message: result.message,
    data: {
      user: result.user,
    },
  });
});

const changeUserRole = catchAsync(async (req, res) => {
  const result = await authService.changeUserRole(
    req.user,
    req.params.userId,
    req.body,
  );

  return res.status(200).json({
    success: true,
    message: result.message,
    data: {
      user: result.user,
    },
  });
});

const resendVerificationCode = catchAsync(async (req, res) => {
  const result = await authService.resendVerificationCode(req.body);

  return res.status(200).json({
    success: true,
    message: result.message,
    data: {
      verification: result.verification,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const result = await authService.refreshUserToken(req.body, {
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
  });

  return res.status(200).json({
    success: true,
    message: result.message,
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      refreshTokenExpiresAt: result.refreshTokenExpiresAt,
      user: result.user,
      redirectTo: result.redirectTo,
    },
  });
});

const logout = catchAsync(async (req, res) => {
  const result = await authService.logoutUser(req.body);

  return res.status(200).json({
    success: true,
    message: result.message,
    data: {},
  });
});




const inviteUser = catchAsync(async (req, res) => {
  const result = await authService.inviteUser(req.user, req.body);

  return res.status(201).json({
    success: true,
    message: result.message,
    data: {
      user: result.user,
      invite: result.invite,
    },
  });
});

const acceptInvite = catchAsync(async (req, res) => {
  const result = await authService.acceptInvite(req.body);

  return res.status(200).json({
    success: true,
    message: result.message,
    data: {
      user: result.user,
      redirectTo: result.redirectTo,
    },
  });
});



const updateUserStatus = catchAsync(async (req, res) => {
  const result = await authService.updateUserStatus(
    req.user,
    req.params.userId,
    req.body,
  );

  return res.status(200).json({
    success: true,
    message: result.message,
    data: {
      user: result.user,
    },
  });
});

const deactivateUser = catchAsync(async (req, res) => {
  const result = await authService.deactivateUser(req.user, req.params.userId);

  return res.status(200).json({
    success: true,
    message: result.message,
    data: {
      user: result.user,
    },
  });
});

const activateUser = catchAsync(async (req, res) => {
  const result = await authService.activateUser(req.user, req.params.userId);

  return res.status(200).json({
    success: true,
    message: result.message,
    data: {
      user: result.user,
    },
  });
});

const suspendUser = catchAsync(async (req, res) => {
  const result = await authService.suspendUser(req.user, req.params.userId);

  return res.status(200).json({
    success: true,
    message: result.message,
    data: {
      user: result.user,
    },
  });
});

const getUserSessions = catchAsync(async (req, res) => {
  const result = await authService.getUserSessions(req.user.id);

  return res.status(200).json({
    success: true,
    message: "Sessions fetched successfully.",
    data: result,
  });
});

const revokeMySession = catchAsync(async (req, res) => {
  const result = await authService.revokeSession(
    req.user.id,
    req.params.sessionId,
  );

  return res.status(200).json({
    success: true,
    message: result.message,
    data: {},
  });
});

const logoutAllMySessions = catchAsync(async (req, res) => {
  const result = await authService.logoutAllSessions(req.user.id);

  return res.status(200).json({
    success: true,
    message: result.message,
    data: {},
  });
});

export default {
  registerCompany,
  login,
  verifyAccount,
  resendVerificationCode,
  refreshToken,
  logout,
  getCurrentUser,
  createStaffUser,
  inviteUser,
  acceptInvite,
  listCompanyUsers,
  getUserById,
  changeUserRole,
  changePassword,
  updateUserStatus,
  updateProfile,
  deactivateUser,
  activateUser,
  suspendUser,
  getUserSessions,
  revokeMySession,
  logoutAllMySessions,
};
