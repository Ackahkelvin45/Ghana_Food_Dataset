# Swagger API Documentation Setup

This project includes Swagger/OpenAPI documentation for all API endpoints.

## Installation

First, install the required dependencies:

```bash
npm install swagger-jsdoc swagger-ui-react
```

## Accessing the Documentation

Once the dependencies are installed and the server is running, you can access the Swagger UI at:

- **Swagger UI**: `http://localhost:3000/api/docs`
- **OpenAPI JSON**: `http://localhost:3000/api/docs` (returns JSON)

## API Endpoints Documented

### Submissions API (`/api/submissions`)

- **POST** - Create a new food submission
- **GET** - Retrieve food submissions with filtering and pagination
- **DELETE** - Delete a food submission by ID

## Configuration

The Swagger configuration is located in `src/lib/swagger.ts`. You can customize:

- API title and description
- Server URLs
- Schema definitions
- Tags and categories

## Adding Documentation to New Endpoints

To document a new API endpoint, add JSDoc comments with Swagger annotations:

```typescript
/**
 * @swagger
 * /api/your-endpoint:
 *   get:
 *     summary: Your endpoint summary
 *     tags: [YourTag]
 *     responses:
 *       200:
 *         description: Success response
 */
export async function GET(req: Request) {
  // Your implementation
}
```

## Notes

- The Swagger UI uses a CDN-based implementation to avoid SSR issues
- All schemas are defined in `src/lib/swagger.ts`
- The OpenAPI spec is generated from JSDoc comments in the API route files

