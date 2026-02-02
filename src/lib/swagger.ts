export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Ghanaian Food Image Dataset API",
    description: "API for collecting Ghanaian local food images and metadata for research purposes",
    version: "1.0.0",
    contact: {
      name: "API Support",
      email: "ackahkelvin455@gmail.com",
    },
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
      description: "Development server",
    },
    {
      url: "https://your-production-domain.com",
      description: "Production server",
    },
  ],
  tags: [
    {
      name: "Submissions",
      description: "Food submission endpoints",
    },
    {
      name: "Users",
      description: "User management endpoints",
    },
    {
      name: "Dashboard",
      description: "Admin dashboard aggregate data",
    },
  ],
  paths: {
    "/api/submissions": {
      post: {
        tags: ["Submissions"],
        summary: "Create a new food submission",
        description: "Submit a new Ghanaian food image with metadata for the dataset",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["dishName", "region", "foodObtained", "accuracyConfirmed"],
                properties: {
                  dishName: {
                    type: "string",
                    description: "Name of the Ghanaian dish",
                    enum: [
                      "Yam",
                      "Plantain (boiled)",
                      "Kenkey",
                      "Banku",
                      "Kokonte",
                      "Fufu",
                      "Jollof",
                      "Plain Rice",
                      "Waakye",
                      "Bread",
                      "Koko",
                      "Beans (Gob3)",
                    ],
                  },
                  noPersonInImage: {
                    type: "boolean",
                    default: false,
                    description: "Confirmation that no person appears in the image",
                  },
                  mainImages: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        url: { type: "string", format: "uri" },
                        filename: { type: "string" },
                        size: { type: "integer" },
                        mimeType: { type: "string" },
                      },
                    },
                    description: "Main food images (up to 5)",
                  },
                  additionalImages: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        url: { type: "string", format: "uri" },
                        filename: { type: "string" },
                        size: { type: "integer" },
                        mimeType: { type: "string" },
                      },
                    },
                    description: "Additional food images (up to 5)",
                  },
                  stew: { type: "string", description: "Type of stew (for Rice/Yam/Plantain dishes)" },
                  stewOther: { type: "string", description: "Other stew type if not listed" },
                  extraItems: {
                    type: "array",
                    items: { type: "string" },
                    description: "Extra items served with the dish",
                  },
                  extraItemsOther: { type: "string", description: "Other extra items if not listed" },
                  kokoItems: {
                    type: "array",
                    items: { type: "string" },
                    description: "Items served with Koko",
                  },
                  soupContext: {
                    type: "string",
                    description: "Type of soup (for Banku/Fufu/Kokonte/Kenkey)",
                  },
                  pepper: {
                    type: "array",
                    items: { type: "string" },
                    description: "Type of pepper (for Banku/Kokonte/Kenkey)",
                  },
                  breadType: { type: "string", description: "Type of bread" },
                  breadServedWith: {
                    type: "array",
                    items: { type: "string" },
                    description: "Items served with bread",
                  },
                  gob3ServedWith: {
                    type: "array",
                    items: { type: "string" },
                    description: "Items served with Gob3",
                  },
                  proteinContext: {
                    type: "array",
                    items: { type: "string" },
                    description: "Protein/meat served with the dish",
                  },
                  region: {
                    type: "string",
                    enum: [
                      "AHAFO",
                      "ASHANTI",
                      "BONO EAST",
                      "BRONG AHAFO",
                      "CENTRAL",
                      "EASTERN",
                      "GREATER ACCRA",
                      "NORTH EAST",
                      "NORTHERN",
                      "OTI",
                      "SAVANNAH",
                      "UPPER EAST",
                      "UPPER WEST",
                      "VOLTA",
                      "WESTERN",
                      "WESTERN NORTH",
                    ],
                    description: "Region in Ghana where food was obtained",
                  },
                  town: { type: "string", description: "Town or community name" },
                  foodObtained: {
                    type: "string",
                    enum: ["Home kitchen", "Restaurant", "Chop bar", "Street vendor", "School canteen", "Other"],
                    description: "Where the food was obtained",
                  },
                  foodObtainedOther: { type: "string", description: "Other location if not listed" },
                  wantsAcknowledgement: {
                    type: "boolean",
                    default: false,
                    description: "Whether contributor wants acknowledgement",
                  },
                  acknowledgedName: { type: "string", description: "Name for acknowledgement" },
                  acknowledgedEmail: { type: "string", format: "email", description: "Email for acknowledgement" },
                  acknowledgedPhone: { type: "string", description: "Phone number for acknowledgement" },
                  accuracyConfirmed: {
                    type: "boolean",
                    description: "Confirmation that information is accurate",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Submission created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    submission: { type: "object" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request - missing or invalid fields",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                    message: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
      get: {
        tags: ["Submissions"],
        summary: "Get food submissions",
        description: "Retrieve a list of food submissions with optional filtering and pagination",
        parameters: [
          {
            name: "dishName",
            in: "query",
            schema: {
              type: "string",
              enum: [
                "Yam",
                "Plantain (boiled)",
                "Kenkey",
                "Banku",
                "Kokonte",
                "Fufu",
                "Jollof",
                "Plain Rice",
                "Waakye",
                "Bread",
                "Koko",
                "Beans (Gob3)",
              ],
            },
            description: "Filter by dish name",
          },
          {
            name: "region",
            in: "query",
            schema: { type: "string" },
            description: "Filter by region",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 50 },
            description: "Number of records to return",
          },
          {
            name: "offset",
            in: "query",
            schema: { type: "integer", default: 0 },
            description: "Number of records to skip",
          },
        ],
        responses: {
          "200": {
            description: "List of submissions retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: {
                      type: "array",
                      items: { type: "object" },
                    },
                    pagination: {
                      type: "object",
                      properties: {
                        total: { type: "integer" },
                        limit: { type: "integer" },
                        offset: { type: "integer" },
                        hasMore: { type: "boolean" },
                      },
                    },
                  },
                },
              },
            },
          },
          "500": {
            description: "Internal server error",
          },
        },
      },
      delete: {
        tags: ["Submissions"],
        summary: "Delete a food submission",
        description: "Delete a food submission by ID",
        parameters: [
          {
            name: "id",
            in: "query",
            required: true,
            schema: { type: "integer" },
            description: "ID of the submission to delete",
          },
        ],
        responses: {
          "200": {
            description: "Submission deleted successfully",
          },
          "400": {
            description: "Bad request - missing ID",
          },
          "500": {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/submissions/{id}": {
      get: {
        tags: ["Submissions"],
        summary: "Get a submission by ID",
        description: "Returns a single food submission with full details including images and dish-specific metadata.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", description: "Submission ID" },
            description: "ID of the submission",
          },
        ],
        responses: {
          "200": {
            description: "Submission retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    submission: {
                      type: "object",
                      description: "Submission with images and metadata",
                      properties: {
                        id: { type: "integer" },
                        dishName: { type: "string" },
                        region: { type: "string" },
                        town: { type: "string", nullable: true },
                        foodObtained: { type: "string" },
                        images: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: { type: "integer" },
                              url: { type: "string" },
                              type: { type: "string", enum: ["main", "additional"] },
                              filename: { type: "string" },
                            },
                          },
                        },
                        riceYamPlantainMeta: { type: "object", nullable: true },
                        kokoMeta: { type: "object", nullable: true },
                        bankuFufuMeta: { type: "object", nullable: true },
                        breadMeta: { type: "object", nullable: true },
                        gob3Meta: { type: "object", nullable: true },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid submission ID",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string", example: "Invalid submission ID" } },
                },
              },
            },
          },
          "404": {
            description: "Submission not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string", example: "Submission not found" } },
                },
              },
            },
          },
          "500": {
            description: "Internal server error",
          },
        },
      },
      delete: {
        tags: ["Submissions"],
        summary: "Delete a submission by ID",
        description: "Deletes a single food submission by ID.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", description: "Submission ID" },
            description: "ID of the submission to delete",
          },
        ],
        responses: {
          "200": {
            description: "Submission deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    submission: { type: "object", description: "Deleted submission" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid submission ID",
          },
          "404": {
            description: "Submission not found",
          },
          "500": {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/dashboard/data": {
      get: {
        tags: ["Dashboard"],
        summary: "Get dashboard totals",
        description: "Returns aggregate counts for users, submissions, and images. Requires an authenticated session.",
        responses: {
          "200": {
            description: "Dashboard totals retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    totals: {
                      type: "object",
                      properties: {
                        users: { type: "integer", description: "Total number of users" },
                        submissions: { type: "integer", description: "Total number of submissions" },
                        images: { type: "integer", description: "Total number of images" },
                      },
                    },
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized - valid session required",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string", example: "Unauthorized" },
                  },
                },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string", example: "Failed to fetch data" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/user": {
      post: {
        tags: ["Users"],
        summary: "Create a new user",
        description: "Register a new user account",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["fullName", "email", "password", "userType"],
                properties: {
                  fullName: {
                    type: "string",
                    description: "User's full name",
                  },
                  email: {
                    type: "string",
                    format: "email",
                    description: "User's email address",
                  },
                  password: {
                    type: "string",
                    format: "password",
                    description: "User's password (will be hashed)",
                  },
                  userType: {
                    type: "string",
                    enum: ["ADMIN", "USER"],
                    description: "Type of user account",
                  },
                  phone: {
                    type: "string",
                    description: "User's phone number (optional)",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    fullName: { type: "string" },
                    email: { type: "string" },
                    userType: { type: "string" },
                    phone: { type: "string", nullable: true },
                    createdAt: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request - validation error or user already exists",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
          "500": {
            description: "Internal server error",
          },
        },
      },
      get: {
        tags: ["Users"],
        summary: "Get all users",
        description: "Retrieve a list of all users (password excluded)",
        responses: {
          "200": {
            description: "List of users retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      fullName: { type: "string" },
                      email: { type: "string" },
                      userType: { type: "string" },
                      phone: { type: "string", nullable: true },
                      createdAt: { type: "string", format: "date-time" },
                      updatedAt: { type: "string", format: "date-time" },
                    },
                  },
                },
              },
            },
          },
          "500": {
            description: "Internal server error",
          },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Delete a user",
        description: "Delete a user account by ID",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id"],
                properties: {
                  id: {
                    type: "integer",
                    description: "ID of the user to delete",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "User deleted successfully",
          },
          "500": {
            description: "Internal server error",
          },
        },
      },
    },
    "/api/user/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user by ID",
        description: "Retrieve a specific user by their ID (password excluded)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "User ID",
          },
        ],
        responses: {
          "200": {
            description: "User retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    fullName: { type: "string" },
                    email: { type: "string" },
                    userType: { type: "string" },
                    phone: { type: "string", nullable: true },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
          "404": {
            description: "User not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
          "500": {
            description: "Internal server error",
          },
        },
      },
    },
  },
};
