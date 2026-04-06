export const DEBUG_CODE = {
  APP_SYSTEM_ERROR: 'app:sys:error', // Debug code for system log (e.g. env, config, etc.)
  APP_SYSTEM_INFO: 'app:sys:info', // Debug code for system log (e.g. env, config, etc.)
  APP_BIZ: 'app:biz', // Debug code for business log
  APP_API: 'app:api', // Debug code for API log
  APP_DB: 'app:db', // Debug code for DB log
  APP_WORKER: 'app:worker', // Debug code for worker log
  APP_TEST: 'app:test', // Debug code for test log
};

export const ENVIRONMENT_SYSTEM = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  USER_ACCEPTANCE_TEST: 'uat',
  PRODUCTION: 'production',
  TEST: 'test',
};

export const PROTOCOL = {
  HTTP: 'http',
  WEB_SOCKET: 'ws',
};

export enum VERSION_API {
  V1 = 'v1',
  V2 = 'v2',
}

export const PREFIX_API = '/rest';

export const MODULE_OPTION_KEYS = {
  IMPORTS: 'imports',
  EXPORTS: 'exports',
  PROVIDERS: 'providers',
  CONTROLLERS: 'controllers',
  MODEL: 'model',
};

/** @public */
export enum ExceptionMetadataType {
  DEFAULT = 'other',
  TRANSLATE = 'translate',
}

export enum ErrorType {
  OPERATIONAL = 'operational',     // Expected failures (validation, business logic)
  PROGRAMMER = 'programmer',       // Bugs in code
  SYSTEM = 'system',               // System-level errors (DB, external services)
  NETWORK = 'network',             // Network-related errors
  SECURITY = 'security'            // Security-related errors
}
