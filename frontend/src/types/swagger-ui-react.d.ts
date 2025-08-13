declare module 'swagger-ui-react' {
  import React from 'react';

  interface SwaggerUIProps {
    spec?: any;
    url?: string;
    docExpansion?: 'list' | 'full' | 'none';
    deepLinking?: boolean;
    displayOperationId?: boolean;
    defaultModelsExpandDepth?: number;
    defaultModelExpandDepth?: number;
    defaultModelRendering?: 'example' | 'model';
    displayRequestDuration?: boolean;
    tryItOutEnabled?: boolean;
    filter?: boolean | string;
    layout?: string;
    validatorUrl?: string | null;
    supportedSubmitMethods?: string[];
    onComplete?: (system: any) => void;
    requestInterceptor?: (request: any) => any;
    responseInterceptor?: (response: any) => any;
    showMutatedRequest?: boolean;
    showExtensions?: boolean;
    showCommonExtensions?: boolean;
    plugins?: any[];
    presets?: any[];
  }

  const SwaggerUI: React.ComponentType<SwaggerUIProps>;
  export default SwaggerUI;
}

declare module 'swagger-ui-react/swagger-ui.css';
