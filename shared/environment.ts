/**
 * Environment detection utilities for build tracking system
 */

export type Environment = 'development' | 'staging' | 'production';

/**
 * זיהוי הסביבה הנוכחית על בסיס environment variables
 * @returns הסביבה הנוכחית
 */
export function detectCurrentEnvironment(): Environment {
  // בדיקה ראשונה: ENV vars ייעודיים למערכת
  const appEnv = process.env.APP_ENV || process.env.VITE_APP_ENV;
  if (appEnv && isValidEnvironment(appEnv)) {
    return appEnv as Environment;
  }

  // בדיקה שנייה: Replit deployment detection
  if (process.env.REPLIT_DEPLOYMENT === '1') {
    return 'production';
  }

  // בדיקה שלישית: NODE_ENV standard
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv && isValidEnvironment(nodeEnv)) {
    return nodeEnv as Environment;
  }

  // ברירת מחדל
  return 'development';
}

/**
 * בדיקה אם הערך הוא סביבה תקינה
 */
export function isValidEnvironment(env: string): env is Environment {
  return ['development', 'staging', 'production'].includes(env);
}

/**
 * יצירת מזהה build number ייחודי
 */
export function generateBuildNumber(): string {
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15); // YYYYMMDDTHHMMSS
  const randomSuffix = Math.random().toString(36).substring(2, 5);
  return `${timestamp}-${randomSuffix}`;
}

/**
 * קבלת מידע git נוכחי (stub לעת עתה)
 */
export function getCurrentGitInfo(): { commit: string; branch?: string } {
  // TODO: בעתיד - אימפלמנטציה אמיתית של git info
  return {
    commit: process.env.GIT_COMMIT || 'unknown',
    branch: process.env.GIT_BRANCH || 'main',
  };
}

/**
 * יצירת metadata בסיסי לbuild
 */
export function createBuildMetadata(): Record<string, any> {
  const gitInfo = getCurrentGitInfo();
  return {
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
    gitBranch: gitInfo.branch,
    buildTool: 'vite+esbuild',
    timestamp: new Date().toISOString(),
  };
}