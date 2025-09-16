// Type for our environment variables
type EnvVars = {
  VITE_FIREBASE_API_KEY: string;
  VITE_FIREBASE_AUTH_DOMAIN: string;
  VITE_FIREBASE_PROJECT_ID: string;
  VITE_FIREBASE_STORAGE_BUCKET: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  VITE_FIREBASE_APP_ID: string;
  VITE_FIREBASE_MEASUREMENT_ID: string;
  VITE_APP_NAME?: string;
  VITE_APP_VERSION?: string;
  PROD?: string;
};

interface EnvConfig {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };
  app: {
    name: string;
    version: string;
    isProduction: boolean;
  };
}

/**
 * Validates and returns the environment configuration
 * @throws {Error} If required environment variables are missing
 */
export function getEnvConfig(): EnvConfig {
  const env = import.meta.env as unknown as EnvVars;
  
  // List of required environment variables
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
    'VITE_FIREBASE_MEASUREMENT_ID',
  ];

  // Check for missing required variables
  const missingVars = requiredVars.filter(varName => !env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return {
    firebase: {
      apiKey: env.VITE_FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: env.VITE_FIREBASE_APP_ID,
      measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
    },
    app: {
      name: env.VITE_APP_NAME || 'Code Nerds Hub',
      version: env.VITE_APP_VERSION || '1.0.0',
      isProduction: env.PROD === 'true' || process.env.NODE_ENV === 'production',
    },
  };
}

// Export the validated config
export const envConfig = getEnvConfig();

// Type guard for environment variables
export function isEnvVarSet(varName: string): varName is keyof EnvVars {
  const env = import.meta.env as unknown as EnvVars;
  return varName in env && typeof env[varName as keyof EnvVars] === 'string';
}

// Helper to safely get environment variables with type checking
export function getEnvVar<T extends string | number | boolean>(
  varName: string,
  defaultValue?: T
): T {
  if (!isEnvVarSet(varName)) {
    if (defaultValue === undefined) {
      throw new Error(`Environment variable ${varName} is not set and no default value provided`);
    }
    return defaultValue;
  }
  
  const value = import.meta.env[varName];
  
  if (typeof defaultValue === 'number') {
    return (value ? Number(value) : defaultValue) as T;
  }
  
  if (typeof defaultValue === 'boolean') {
    return (value ? value === 'true' : defaultValue) as T;
  }
  
  return (value || defaultValue) as T;
}
