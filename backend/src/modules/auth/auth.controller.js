  import catchAsync from "../../utils/catchAsync.js";
  import authService from "./auth.service.js";

  // ─── Shared error handler ─────────────────────────────────────────────────────
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

  const registerCompany = async (req, res) => {
    try {
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
    } catch (error) {
      return handleError(res, error, "registerCompany");
    }
  };

  const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body, {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    return res.status(200).json({
      success: false, // Matches your common frontend validation schemas
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
  } catch (error) {
    // Intercept expected custom authentication or validation errors
    if (error.statusCode === 401 || error.isOperational) {
      return res.status(error.statusCode || 401).json({
        success: false,
        message: error.message || "Invalid email or password.",
      });
    }
    
    // Fall back to your default logger for real unhandled exceptions (e.g. Database down)
    return handleError(res, error, "login");
  }
};

  

  const verifyAccount = async (req, res) => {
    try {
      const result = await authService.verifyAccount(req.body);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          user: result.user,
          redirectTo: result.redirectTo,
        },
      });
    } catch (error) {
      return handleError(res, error, "verifyAccount");
    }
  };

  const getCurrentUser = async (req, res) => {
    try {
      const result = await authService.getMyProfile(req.user.id);

      return res.status(200).json({
        success: true,
        message: "Profile fetched successfully.",
        data: result,
      });
    } catch (error) {
      return handleError(res, error, "getCurrentUser");
    }
  };

  const createStaffUser = async (req, res) => {
    try {
      const result = await authService.createStaffUser(req.user, req.body);

      return res.status(201).json({
        success: true,
        message: result.message,
        data: {
          user: result.user,
          verification: result.verification ?? null,
        },
      });
    } catch (error) {
      return handleError(res, error, "createStaffUser");
    }
  };

  const changePassword = async (req, res) => {
    try {
      const result = await authService.changePassword(
        req.user.id,
        req.body.newPassword,
      );

      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.user,
      });
    } catch (error) {
      return handleError(res, error, "changePassword");
    }
  };

  const listCompanyUsers = async (req, res) => {
    try {
      const result = await authService.listCompanyUsers(req.user, req.query);

      return res.status(200).json({
        success: true,
        message: "Users fetched successfully.",
        data: result,
      });
    } catch (error) {
      return handleError(res, error, "listCompanyUsers");
    }
  };

  const getUserById = async (req, res) => {
    try {
      const result = await authService.getUserById(req.user, req.params.userId);

      return res.status(200).json({
        success: true,
        message: "User fetched successfully.",
        data: result,
      });
    } catch (error) {
      return handleError(res, error, "getUserById");
    }
  };

  const updateProfile = async (req, res) => {
    try {
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
    } catch (error) {
      return handleError(res, error, "updateProfile");
    }
  };

  const changeUserRole = async (req, res) => {
    try {
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
    } catch (error) {
      return handleError(res, error, "changeUserRole");
    }
  };

  const searchUser = async (req, res) => {
    try {
      const { q } = req.query;

      const users = await authService.searchUser(q, req.user?.companyId);

      return res.status(200).json({
        success: true,
        message: users.length > 0 ? "Users found successfully" : "No users found",
        data: {
          users,
          count: users.length,
        },
      });
    } catch (error) {
      return handleError(res, error, "searchUser");
    }
  };

  const filterUserByRole = async (req, res) => {
    try {
      const { role } = req.query;

      const users = await authService.filterUserByRole(req.user?.companyId, role);

      return res.status(200).json({
        success: true,
        message: users.length > 0 ? "Users found successfully" : "No users found",
        data: {
          users,
          count: users.length,
        },
      });
    } catch (error) {
      return handleError(res, error, "filterUserByRole");
    }
  };

  const resendVerificationCode = async (req, res) => {
    try {
      const result = await authService.resendVerificationCode(req.body);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: {
          verification: result.verification,
        },
      });
    } catch (error) {
      return handleError(res, error, "resendVerificationCode");
    }
  };

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

  const inviteUser = async (req, res) => {
    const result = await authService.inviteUser(req.user, req.body);

    return res.status(201).json({
      success: true,
      message: result.message,
      data: {
        user: result.user,
        invite: result.invite,
      },
    });
  };

  const acceptInvite = async (req, res) => {
    const result = await authService.acceptInvite(req.body);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        user: result.user,
        redirectTo: result.redirectTo,
      },
    });
  };

  const updateUserStatus = async (req, res) => {
    try {
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
    } catch (error) {
      return handleError(res, error, "updateUserStatus");
    }
  };

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

 const deleteUser = async (req, res) => {
  try {
    // Extract the id parameter from the route (/api/auth/users/:id)
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID parameter is required.",
      });
    }

    // Call your backend service layer execution step
    await authService.deleteUser(id);

    return res.status(200).json({
      success: true,
      message: "User account deleted successfully.",
    });
  } catch (error) {
    // If the error has a custom statusCode assigned in the service layer, use it
    const statusCode = error.statusCode || 500;
    
    // Check if you use a centralized handleError utility or fallback to inline JSON
    if (typeof handleError === "function") {
      return handleError(res, error, "deleteUserController");
    }

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Internal server error during user deletion.",
    });
  }
};

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
    deleteUser,
    createStaffUser,
    inviteUser,
    acceptInvite,
    listCompanyUsers,
    getUserById,
    searchUser,
    filterUserByRole,
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
