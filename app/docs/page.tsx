'use client';

import { useEffect } from 'react';

export default function SwaggerPage() {
  useEffect(() => {
    // Load Swagger UI from CDN
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      if (window.SwaggerUIBundle) {
        // @ts-ignore
        window.ui = window.SwaggerUIBundle({
          url: '/api/docs',
          dom_id: '#swagger-ui',
          presets: [
            // @ts-ignore
            window.SwaggerUIBundle.presets.apis,
            // @ts-ignore
            window.SwaggerUIBundle.presets.standalone,
          ],
          layout: 'BaseLayout',
        });
      }
    };
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css';
    document.head.appendChild(link);

    return () => {
      // Cleanup: remove script and link if they exist
      if (script.parentNode) {
        document.head.removeChild(script);
      }
      if (link.parentNode) {
        document.head.removeChild(link);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">API Documentation</h1>
        <p className="text-gray-600 mb-6">
          Interactive API documentation for the Ghanaian Food Image Dataset API
        </p>
        <div id="swagger-ui" className="swagger-ui-wrap" />
      </div>
    </div>
  );
}

