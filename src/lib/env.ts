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
 * Uses fallback values for development if environment variables are missing
 */
export function getEnvConfig(): EnvConfig {
  const env = import.meta.env as unknown as EnvVars;
  
  // Fallback values for development (these should be set in production)
  const fallbackConfig = {
    apiKey: "AIzaSyASjJpwGyVpJ8LOcFtPP5Rl5cNp8D37U88",
    authDomain: "codenerds-35772.firebaseapp.com",
    projectId: "codenerds-35772",
    storageBucket: "codenerds-35772.firebasestorage.app",
    messagingSenderId: "114640648409",
    appId: "1:114640648409:web:62c35885ab3a104f90a6c8",
    measurementId: "G-KD2BSKHG70",
  };

  // Use environment variables if available, otherwise use fallbacks
  const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY || fallbackConfig.apiKey,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
    projectId: env.VITE_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId,
    appId: env.VITE_FIREBASE_APP_ID || fallbackConfig.appId,
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || fallbackConfig.measurementId,
  };

  return {
    firebase: firebaseConfig,
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
