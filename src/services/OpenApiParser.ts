import { OpenApiSpec, ApiEndpoint, Operation, PathItem } from '../types';

export class OpenApiParser {
  /**
   * Parse OpenAPI specification from object or file path
   */
  async parse(input: OpenApiSpec | string): Promise<OpenApiSpec> {
    if (typeof input === 'string') {
      // If input is a file path, read and parse the file
      const fs = await import('fs');
      const yaml = await import('yaml');
      
      const content = fs.readFileSync(input, 'utf8');
      
      // Try to parse as JSON first, then YAML
      try {
        return JSON.parse(content);
      } catch {
        return yaml.parse(content);
      }
    }
    
    return input as OpenApiSpec;
  }

  /**
   * Validate OpenAPI specification
   */
  async validate(spec: OpenApiSpec): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Basic validation
    if (!spec.openapi) {
      errors.push('Missing required field: openapi');
    }

    if (!spec.info) {
      errors.push('Missing required field: info');
    } else {
      if (!spec.info.title) {
        errors.push('Missing required field: info.title');
      }
      if (!spec.info.version) {
        errors.push('Missing required field: info.version');
      }
    }

    if (!spec.paths) {
      errors.push('Missing required field: paths');
    }

    // Validate OpenAPI version
    if (spec.openapi && !spec.openapi.startsWith('3.')) {
      errors.push('Only OpenAPI 3.x specifications are supported');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Extract all API endpoints from OpenAPI specification
   */
  async extractEndpoints(spec: OpenApiSpec): Promise<ApiEndpoint[]> {
    const endpoints: ApiEndpoint[] = [];

    if (!spec.paths) {
      return endpoints;
    }

    Object.entries(spec.paths).forEach(([path, pathItem]: [string, PathItem]) => {
      const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'trace'];
      
      methods.forEach(method => {
        const operation = pathItem[method as keyof PathItem] as Operation;
        
        if (operation) {
          endpoints.push({
            id: `${method.toUpperCase()}_${path.replace(/[^a-zA-Z0-9]/g, '_')}`,
            path,
            method: method.toUpperCase(),
            operationId: operation.operationId,
            summary: operation.summary,
            description: operation.description,
            tags: operation.tags,
            testCoverage: {
              covered: false,
              testCases: [],
              coverage: 0
            }
          });
        }
      });
    });

    return endpoints;
  }

  /**
   * Extract components and schemas from OpenAPI specification
   */
  async extractComponents(spec: OpenApiSpec): Promise<any[]> {
    const components: any[] = [];

    if (!spec.components?.schemas) {
      return components;
    }

    Object.entries(spec.components.schemas).forEach(([name, schema]) => {
      components.push({
        name,
        type: 'schema',
        definition: schema
      });
    });

    return components;
  }

  /**
   * Generate API documentation from OpenAPI specification
   */
  async generateDocumentation(spec: OpenApiSpec): Promise<string> {
    let documentation = `# ${spec.info.title}\n\n`;
    
    if (spec.info.description) {
      documentation += `${spec.info.description}\n\n`;
    }

    documentation += `**Version:** ${spec.info.version}\n\n`;

    if (spec.servers && spec.servers.length > 0) {
      documentation += '## Servers\n\n';
      spec.servers.forEach(server => {
        documentation += `- ${server.url}`;
        if (server.description) {
          documentation += ` - ${server.description}`;
        }
        documentation += '\n';
      });
      documentation += '\n';
    }

    // Group endpoints by tags
    const endpoints = await this.extractEndpoints(spec);
    const endpointsByTag: Record<string, ApiEndpoint[]> = {};

    endpoints.forEach(endpoint => {
      const tag = endpoint.tags?.[0] || 'Untagged';
      if (!endpointsByTag[tag]) {
        endpointsByTag[tag] = [];
      }
      endpointsByTag[tag].push(endpoint);
    });

    Object.entries(endpointsByTag).forEach(([tag, tagEndpoints]) => {
      documentation += `## ${tag}\n\n`;
      
      tagEndpoints.forEach(endpoint => {
        documentation += `### ${endpoint.method} ${endpoint.path}\n\n`;
        
        if (endpoint.summary) {
          documentation += `${endpoint.summary}\n\n`;
        }
        
        if (endpoint.description) {
          documentation += `${endpoint.description}\n\n`;
        }
      });
    });

    return documentation;
  }
}
