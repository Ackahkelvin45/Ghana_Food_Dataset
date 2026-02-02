"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { swaggerSpec } from "@/src/lib/swagger";

export default function SwaggerPage() {
  // Hide Swagger in production (optional)
  if (process.env.NODE_ENV === "production") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">API documentation is not available in production.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SwaggerUI spec={swaggerSpec} />
    </div>
  );
}

