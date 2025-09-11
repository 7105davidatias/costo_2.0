#!/usr/bin/env node
/**
 * Build Info Generator
 * יוצר קובץ build-info.json עם מטא-דאטה מלאה על הבניה
 */

import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

/**
 * קבלת מידע Git בטוח עם fallbacks
 */
function getGitInfo() {
  // אם Git לא זמין או יש בעיות הרשאות, השתמש בענב fallback
  const fallbackInfo = {
    commit: 'dev-build',
    shortCommit: 'dev',
    branch: 'main',
    tag: null,
    isDirty: false,
    lastCommitDate: new Date().toISOString(),
    lastCommitMessage: 'Build without Git info',
    author: 'developer',
    authorEmail: 'dev@local',
  };

  try {
    // בדיקה אם Git זמין בכלל
    execSync('git --version', { stdio: 'ignore' });
    
    const getGitCommand = (cmd, fallback = 'unknown') => {
      try {
        return execSync(cmd, { 
          cwd: projectRoot,
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore'],
          timeout: 5000 // timeout of 5 seconds
        }).trim();
      } catch {
        return fallback;
      }
    };

    // נסה לקבל מידע git, אם זה נכשל - חזור לfallback
    const gitInfo = {
      commit: getGitCommand('git rev-parse HEAD'),
      shortCommit: getGitCommand('git rev-parse --short HEAD'),
      branch: getGitCommand('git rev-parse --abbrev-ref HEAD', 'main'),
      tag: getGitCommand('git describe --tags --exact-match', null),
      isDirty: false, // הסר את status check שיוצר בעיות
      lastCommitDate: getGitCommand('git log -1 --format=%cI'),
      lastCommitMessage: getGitCommand('git log -1 --format=%s'), // %s במקום %B למניעת בעיות
      author: getGitCommand('git log -1 --format=%an'),
      authorEmail: getGitCommand('git log -1 --format=%ae'),
    };

    // בדוק אם קיבלנו מידע תקין
    if (gitInfo.commit === 'unknown' || gitInfo.commit.length < 7) {
      console.warn('Warning: Git information appears invalid, using fallback');
      return fallbackInfo;
    }

    return gitInfo;
  } catch (error) {
    console.warn('Warning: Git not available or permission denied, using fallback');
    return fallbackInfo;
  }
}

/**
 * יצירת BUILD_NUMBER ייחודי
 */
function generateBuildNumber() {
  // אם יש BUILD_NUMBER ב-environment, השתמש בו
  if (process.env.BUILD_NUMBER) {
    return process.env.BUILD_NUMBER;
  }

  // אחרת, צור BUILD_NUMBER על בסיס timestamp
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  
  return `${year}.${month}.${day}.${hour}${minute}`;
}

/**
 * זיהוי הסביבה
 */
function detectEnvironment() {
  // בדיקה ראשונה: משתני סביבה ייעודיים
  const appEnv = process.env.APP_ENV || process.env.VITE_APP_ENV;
  if (appEnv && ['development', 'staging', 'production'].includes(appEnv)) {
    return appEnv;
  }

  // בדיקה שנייה: Replit deployment
  if (process.env.REPLIT_DEPLOYMENT === '1') {
    return 'production';
  }

  // בדיקה שלישית: NODE_ENV
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv && ['development', 'staging', 'production'].includes(nodeEnv)) {
    return nodeEnv;
  }

  return 'development';
}

/**
 * קריאת package.json לקבלת גרסה
 */
function getPackageVersion() {
  try {
    const packageJsonPath = join(projectRoot, 'package.json');
    const packageJsonContent = readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    return packageJson.version || '1.0.0';
  } catch {
    return '1.0.0';
  }
}

/**
 * קבלת dependencies info
 */
function getDependenciesInfo() {
  try {
    const packageJsonPath = join(projectRoot, 'package.json');
    const packageJsonContent = readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    
    let npmVersion;
    try {
      npmVersion = execSync('npm --version', { encoding: 'utf8', timeout: 3000 }).trim();
    } catch {
      npmVersion = 'unknown';
    }
    
    return {
      nodeVersion: process.version,
      npmVersion,
      mainDependencies: Object.keys(packageJson.dependencies || {}).length,
      devDependencies: Object.keys(packageJson.devDependencies || {}).length,
      keyFrameworks: {
        react: packageJson.dependencies?.react || null,
        typescript: packageJson.devDependencies?.typescript || null,
        vite: packageJson.devDependencies?.vite || null,
        express: packageJson.dependencies?.express || null,
      }
    };
  } catch {
    return {
      nodeVersion: process.version,
      npmVersion: 'unknown',
      mainDependencies: 0,
      devDependencies: 0,
      keyFrameworks: {},
    };
  }
}

/**
 * יצירת מטא-דאטה מלא
 */
function generateBuildInfo() {
  const gitInfo = getGitInfo();
  const buildNumber = generateBuildNumber();
  const environment = detectEnvironment();
  const version = getPackageVersion();
  const dependencies = getDependenciesInfo();
  const timestamp = new Date().toISOString();

  return {
    // מידע בסיסי על הבניה
    buildNumber,
    version,
    environment,
    buildDate: timestamp,
    
    // Git information
    git: {
      commit: gitInfo.commit,
      shortCommit: gitInfo.shortCommit,
      branch: gitInfo.branch,
      tag: gitInfo.tag,
      isDirty: gitInfo.isDirty,
      lastCommitDate: gitInfo.lastCommitDate,
      lastCommitMessage: gitInfo.lastCommitMessage,
      author: gitInfo.author,
      authorEmail: gitInfo.authorEmail,
    },
    
    // Build environment
    build: {
      platform: process.platform,
      architecture: process.arch,
      nodeVersion: dependencies.nodeVersion,
      npmVersion: dependencies.npmVersion,
      buildTool: 'vite+esbuild',
      ci: !!(process.env.CI || process.env.GITHUB_ACTIONS || process.env.REPLIT_DEPLOYMENT),
      ciProvider: process.env.GITHUB_ACTIONS ? 'github' : 
                  process.env.REPLIT_DEPLOYMENT ? 'replit' : 'local',
    },
    
    // Dependencies information
    dependencies,
    
    // Deployment specific
    deployment: {
      deploymentDate: null, // יעודכן ברגע הפריסה בפועל
      sapDataVersion: null, // יעודכן כשיש אינטגרציה עם SAP
      deployedBy: process.env.GITHUB_ACTOR || process.env.USER || 'unknown',
    },
    
    // SAP-specific metadata (לעתיד)
    sap: {
      dataVersion: null,
      lastSyncDate: null,
      compatibilityLevel: 'v1.0',
    }
  };
}

/**
 * כתיבת הקובץ
 */
function writeBuildInfo() {
  const buildInfo = generateBuildInfo();
  
  // וודא שהתיקייה קיימת
  const outputDir = join(projectRoot, 'dist');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  
  // כתיבת הקובץ למספר מקומות
  const outputPaths = [
    join(projectRoot, 'build-info.json'),           // שורש הפרוייקט
    join(projectRoot, 'dist', 'build-info.json'),   // בתיקיית dist
    join(projectRoot, 'public', 'build-info.json'), // לגישה מהclient
  ];
  
  outputPaths.forEach(outputPath => {
    const dir = dirname(outputPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    
    try {
      writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2), 'utf8');
      console.log(`✅ Build info written to: ${outputPath}`);
    } catch (error) {
      console.warn(`⚠️  Could not write to ${outputPath}:`, error.message);
    }
  });
  
  return buildInfo;
}

/**
 * הפונקציה הראשית
 */
function main() {
  console.log('🔨 Generating build information...');
  
  try {
    const buildInfo = writeBuildInfo();
    
    console.log('📋 Build Information Summary:');
    console.log(`   📦 Version: ${buildInfo.version}`);
    console.log(`   🔢 Build: ${buildInfo.buildNumber}`);
    console.log(`   🌍 Environment: ${buildInfo.environment}`);
    console.log(`   🌳 Branch: ${buildInfo.git.branch}`);
    console.log(`   📝 Commit: ${buildInfo.git.shortCommit}`);
    console.log(`   ⏰ Build Date: ${buildInfo.buildDate}`);
    console.log('✅ Build info generation completed successfully!');
    
  } catch (error) {
    console.error('❌ Error generating build info:', error);
    process.exit(1);
  }
}

// הרצת הסקריפט
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}