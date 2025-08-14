/**
 * Environment Configuration
 * Centralized configuration management for the Enterprise Trace application
 */

interface AppConfig {
  apiBaseUrl: string;
  apiVersion: string;
  environment: string;
  appName: string;
  enableDebug: boolean;
}

class ConfigService {
  private static instance: ConfigService;
  private config: AppConfig;

  private constructor() {
    this.config = {
      apiBaseUrl: this.getEnvVar('REACT_APP_API_BASE_URL', 'http://localhost:8081'),
      apiVersion: this.getEnvVar('REACT_APP_API_VERSION', 'v1'),
      environment: this.getEnvVar('REACT_APP_ENVIRONMENT', 'development'),
      appName: this.getEnvVar('REACT_APP_APP_NAME', 'Enterprise Trace'),
      enableDebug: this.getEnvVar('REACT_APP_ENABLE_DEBUG', 'false') === 'true',
    };

    // Validate configuration
    this.validateConfig();
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  private getEnvVar(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
  }

  private validateConfig(): void {
    if (!this.config.apiBaseUrl) {
      throw new Error('API_BASE_URL is required but not configured');
    }

    // Remove trailing slash from API base URL
    this.config.apiBaseUrl = this.config.apiBaseUrl.replace(/\/$/, '');

    if (this.config.enableDebug) {
      console.log('🔧 Enterprise Trace Configuration:', this.config);
    }
  }

  public getConfig(): AppConfig {
    return { ...this.config };
  }

  public get apiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }

  public get apiVersion(): string {
    return this.config.apiVersion;
  }

  public get environment(): string {
    return this.config.environment;
  }

  public get appName(): string {
    return this.config.appName;
  }

  public get enableDebug(): boolean {
    return this.config.enableDebug;
  }

  public get isProduction(): boolean {
    return this.config.environment === 'production';
  }

  public get isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  public get isStaging(): boolean {
    return this.config.environment === 'staging';
  }

  /**
   * Build API endpoint URL
   */
  public buildApiUrl(endpoint: string): string {
    // Remove leading slash from endpoint if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.apiBaseUrl}/api/${cleanEndpoint}`;
  }

  /**
   * Build API endpoint URL with version
   */
  public buildApiUrlWithVersion(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${this.apiBaseUrl}/api/${this.apiVersion}/${cleanEndpoint}`;
  }

  /**
   * Log debug information (only in development)
   */
  public debug(message: string, data?: any): void {
    if (this.enableDebug && !this.isProduction) {
      console.log(`🐛 [${this.appName}] ${message}`, data || '');
    }
  }

  /**
   * Log error information
   */
  public error(message: string, error?: any): void {
    console.error(`❌ [${this.appName}] ${message}`, error || '');
  }
}

// Export singleton instance
export const config = ConfigService.getInstance();
export default config;

// Export types
export type { AppConfig };
