const authorizeRoles = (...allowedRoles) => {
  const normalizedAllowedRoles = allowedRoles.flat().filter(Boolean);

  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!userRole) {
      return res.status(403).json({
        success: false,
        message: "User role is missing.",
      });
    }

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource.",
      });
    }

    next();
  };
};

export default authorizeRoles;
