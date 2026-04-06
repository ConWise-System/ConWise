export const swaggerSchemas = {
  User: {
    type: "object",
    properties: {
      id: { type: "integer", example: 1 },
      firstName: { type: "string", example: "Firomsa" },
      lastName: { type: "string", example: "Hika" },
      fullName: { type: "string", example: "Firomsa Hika" },
      email: { type: "string", example: "admin@abcconstruction.com" },
      phone: { type: "string", example: "+25191623456" },
      role: {
        type: "string",
        enum: [
          "PLATFORM_ADMIN",
          "COMPANY_ADMIN",
          "PROJECT_MANAGER",
          "SITE_ENGINEER",
          "SITE_SUPERVISOR",
        ],
      },
      status: {
        type: "string",
        enum: ["PENDING_VERIFICATION", "ACTIVE", "INACTIVE", "SUSPENDED"],
      },
      isVerified: { type: "boolean", example: false },
      bio: { type: "string", example: "MERN Stack Developer" },
      companyId: { type: "integer", example: 1 },
      lastLoginAt: { type: "string", nullable: true },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },

  VerifiedUser: {
    type: "object",
    properties: {
      id: { type: "integer", example: 1 },
      firstName: { type: "string", example: "Firomsa" },
      lastName: { type: "string", example: "Hika" },
      fullName: { type: "string", example: "Firomsa Hika" },
      email: { type: "string", example: "admin@abcconstruction.com" },
      phone: { type: "string", example: "+25191623456" },
      role: {
        type: "string",
        enum: [
          "PLATFORM_ADMIN",
          "COMPANY_ADMIN",
          "PROJECT_MANAGER",
          "SITE_ENGINEER",
          "SITE_SUPERVISOR",
        ],
      },
      status: {
        type: "string",
        enum: ["PENDING_VERIFICATION", "ACTIVE", "INACTIVE", "SUSPENDED"],
        example: "ACTIVE",
      },
      isVerified: {
        type: "boolean",
        example: true, // ← This is the key difference
      },
      bio: { type: "string", example: "MERN Stack Developer" },
      companyId: { type: "integer", example: 1 },
      lastLoginAt: { type: "string", format: "date-time", nullable: true },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },

  Company: {
    type: "object",
    properties: {
      id: { type: "integer", example: 1 },
      name: { type: "string", example: "ABC Construction PLC" },
      email: { type: "string", example: "info@abcconstruction.com" },
      phone: { type: "string", example: "+251912145161" },
      address: { type: "string", example: "Addis Ababa" },
      status: {
        type: "string",
        enum: ["PENDING", "ACTIVE", "SUSPENDED"],
      },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },

  // New Schemas for Registration
  RegisterCompanyRequest: {
    type: "object",
    required: [
      "companyName",
      "companyEmail",
      "firstName",
      "lastName",
      "email",
      "password",
      "confirmPassword",
    ],
    properties: {
      companyName: { type: "string", example: "ABC Construction PLC" },
      companyEmail: {
        type: "string",
        format: "email",
        example: "info@abcconstruction.com",
      },
      companyPhone: {
        type: "string",
        example: "+251912145161",
      },
      companyAddress: {
        type: "string",
        example: "Addis Ababa",
      },
      firstName: { type: "string", example: "Firomsa" },
      lastName: { type: "string", example: "Hika" },
      email: {
        type: "string",
        format: "email",
        example: "admin@abcconstruction.com",
      },
      phone: {
        type: "string",
        example: "+25191623456",
      },
      password: {
        type: "string",
        format: "password",
        example: "password123",
      },
      confirmPassword: {
        type: "string",
        format: "password",
        example: "password123",
      },
    },
  },

  RegisterCompanyResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: {
        type: "string",
        example:
          "Registration successful. Please verify your account using the code sent to you.",
      },
      data: {
        type: "object",
        properties: {
          user: {
            $ref: "#/components/schemas/UserWithCompany",
          },
          company: {
            $ref: "#/components/schemas/Company",
          },
          verification: {
            type: "object",
            properties: {
              verificationId: { type: "integer", example: 1 },
              type: { type: "string", example: "EMAIL_VERIFICATION" },
              expiresAt: { type: "string", format: "date-time" },
              destination: {
                type: "string",
                format: "email",
                example: "admin@abcconstruction.com",
              },
            },
          },
        },
      },
    },
  },

  // Helper schema used in RegisterCompanyResponse
  UserWithCompany: {
    type: "object",
    properties: {
      id: { type: "integer", example: 1 },
      companyId: { type: "integer", example: 1 },
      role: { type: "string", example: "COMPANY_ADMIN" },
      firstName: { type: "string", example: "Firomsa" },
      lastName: { type: "string", example: "Hika" },
      fullName: { type: "string", example: "Firomsa Hika" },
      email: { type: "string", example: "admin@abcconstruction.com" },
      phone: { type: "string", example: "+25191623456" },
      isVerified: { type: "boolean", example: false },
      status: { type: "string", example: "PENDING_VERIFICATION" },
      lastLoginAt: { type: "string", nullable: true },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
      company: {
        $ref: "#/components/schemas/Company",
      },
    },
  },

  AuthResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string" },
      data: {
        type: "object",
        properties: {
          accessToken: { type: "string" },
          refreshToken: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
        },
      },
    },
  },
  // ==================== Verify Account Schemas ====================
  // Verify Account Schemas
  VerifyAccountRequest: {
    type: "object",
    required: ["identifier", "code"],
    properties: {
      identifier: {
        type: "string",
        format: "email",
        example: "firomsahika2022@gmail.com",
      },
      code: { type: "string", example: "419845" },
    },
  },

  VerifyAccountResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: {
        type: "string",
        example: "Account verified successfully",
      },
      data: {
        type: "object",
        properties: {
          user: {
            $ref: "#/components/schemas/VerifiedUser", // ← Use VerifiedUser here
          },
          redirectTo: {
            type: "string",
            example: "/dashboard",
          },
        },
      },
    },
  },

  // ==================== NEW SCHEMAS FOR CHANGE ROLE ====================

  UpdateUserRoleRequest: {
    type: "object",
    required: ["role"],
    properties: {
      role: {
        type: "string",
        enum: [
          "PLATFORM_ADMIN",
          "COMPANY_ADMIN",
          "PROJECT_MANAGER",
          "SITE_ENGINEER",
          "SITE_SUPERVISOR",
        ],
        example: "SITE_ENGINEER",
      },
    },
  },

  UpdateUserRoleResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: {
        type: "string",
        example: "User role updated successfully",
      },
      data: {
        type: "object",
        properties: {
          user: {
            $ref: "#/components/schemas/User",
          },
        },
      },
    },
  },

  // ==================== List Company Users ====================

  CompanyUsersQuery: {
    type: "object",
    properties: {
      page: {
        type: "integer",
        example: 1,
      },
      limit: {
        type: "integer",
        example: 10,
      },
      search: {
        type: "string",
        example: "firomsa",
      },
      role: {
        type: "string",
        enum: [
          "COMPANY_ADMIN",
          "PROJECT_MANAGER",
          "SITE_ENGINEER",
          "SITE_SUPERVISOR",
        ],
        example: "SITE_ENGINEER",
      },
      status: {
        type: "string",
        enum: ["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING_VERIFICATION"],
        example: "ACTIVE",
      },
    },
  },

  Pagination: {
    type: "object",
    properties: {
      page: { type: "integer", example: 1 },
      limit: { type: "integer", example: 10 },
      total: { type: "integer", example: 2 },
      totalPages: { type: "integer", example: 1 },
    },
  },

  UserListItem: {
    type: "object",
    properties: {
      id: { type: "integer", example: 14 },
      companyId: { type: "integer", example: 5 },
      role: {
        type: "string",
        example: "SITE_ENGINEER",
      },
      firstName: { type: "string", example: "Lencho" },
      lastName: { type: "string", example: "Bekele" },
      fullName: { type: "string", example: "Lencho Bekele" },
      email: { type: "string", example: "firomsa.hika@astu.edu.et" },
      phone: { type: "string", example: "+2519763456" },
      isVerified: { type: "boolean", example: true },
      status: {
        type: "string",
        example: "ACTIVE",
      },
      lastLoginAt: {
        type: "string",
        format: "date-time",
        nullable: true,
      },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },

  ListCompanyUsersResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: {
        type: "string",
        example: "Users fetched successfully.",
      },
      data: {
        type: "object",
        properties: {
          users: {
            type: "array",
            items: {
              $ref: "#/components/schemas/UserListItem",
            },
          },
          pagination: {
            $ref: "#/components/schemas/Pagination",
          },
        },
      },
    },
  },

  // ==================== PROJECT SCHEMAS ====================
  // Add these inside the swaggerSchemas object in swagger.schema.js

  CreateProjectRequest: {
    type: "object",
    required: [
      "projectName",
      "location",
      "startDate",
      "clientName",
      "projectBudget",
    ],
    properties: {
      projectName: {
        type: "string",
        minLength: 2,
        maxLength: 100,
        example: "Adama Office Complex",
      },
      location: {
        type: "string",
        minLength: 2,
        maxLength: 100,
        example: "Adama, Ethiopia",
      },
      startDate: {
        type: "string",
        format: "date",
        example: "2026-01-01",
      },
      endDate: {
        type: "string",
        format: "date",
        example: "2026-12-31",
        nullable: true,
      },
      clientName: {
        type: "string",
        minLength: 2,
        maxLength: 100,
        example: "ABC Construction PLC",
      },
      projectBudget: {
        type: "number",
        example: 5000000,
      },
      status: {
        type: "string",
        enum: ["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"],
        example: "PLANNING",
      },
    },
  },

  ProjectOwner: {
    type: "object",
    properties: {
      id: { type: "integer", example: 1 },
      firstName: { type: "string", example: "Firomsa" },
      lastName: { type: "string", example: "Hika" },
      email: { type: "string", example: "firomsa@conwise.et" },
      role: { type: "string", example: "PROJECT_MANAGER" },
    },
  },

  ProjectProgress: {
    type: "object",
    properties: {
      id: { type: "integer", example: 1 },
      projectId: { type: "integer", example: 1 },
      completionPercentage: { type: "string", example: "0.00" },
      totalTasks: { type: "integer", example: 0 },
      tasksCompleted: { type: "integer", example: 0 },
      lastUpdated: { type: "string", format: "date-time" },
    },
  },

  ProjectCostSummary: {
    type: "object",
    nullable: true,
    properties: {
      id: { type: "integer", example: 1 },
      projectId: { type: "integer", example: 1 },
      estimatedCost: { type: "string", example: "5000000.00" },
      actualTaskCost: { type: "string", example: "1200000.00" },
      costVariance: { type: "string", example: "3800000.00" },
      lastUpdated: { type: "string", format: "date-time" },
    },
  },

  Project: {
    type: "object",
    properties: {
      id: { type: "integer", example: 1 },
      companyId: { type: "integer", example: 1 },
      ownerUserId: { type: "integer", example: 1 },
      projectName: { type: "string", example: "Adama Office Complex" },
      location: { type: "string", example: "Adama, Ethiopia" },
      startDate: { type: "string", format: "date-time" },
      endDate: {
        type: "string",
        format: "date-time",
        nullable: true,
      },
      clientName: { type: "string", example: "ABC Construction PLC" },
      projectBudget: { type: "string", example: "5000000.00" },
      status: {
        type: "string",
        enum: ["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"],
        example: "PLANNING",
      },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
      owner: { $ref: "#/components/schemas/ProjectOwner" },
      projectProgress: { $ref: "#/components/schemas/ProjectProgress" },
      costSummary: { $ref: "#/components/schemas/ProjectCostSummary" },
    },
  },

  ProjectResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: {
        type: "string",
        example: "Project created successfully.",
      },
      data: {
        $ref: "#/components/schemas/Project",
      },
    },
  },

  ProjectListResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: {
        type: "string",
        example: "Projects retrieved successfully.",
      },
      data: {
        type: "array",
        items: {
          $ref: "#/components/schemas/Project",
        },
      },
    },
  },

  DeleteProjectResponse: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: {
        type: "string",
        example: 'Project "Adama Office Complex" deleted successfully.',
      },
      data: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
        },
      },
    },
  },
};
