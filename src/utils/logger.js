// src/utils/logger.js
import fs from 'node:fs';
import path from 'node:path';
import pino from 'pino';

// fixed defaults
const level = 'info';

export const consoleLogger = pino({
  level,
  timestamp: pino.stdTimeFunctions.isoTime
}, pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'SYS:standard',
    ignore: 'pid,hostname'
  }
}));

/**
 * Create a per-test logger.
 * File: logs/<project>__<spec>__<testSlug>__<ISO>.log
 */
export function createPerTestLogger(testInfo) {
  const logsDir = path.resolve(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

  const project  = testInfo.project?.name || 'project';
  const specBase = path.basename(testInfo.file || 'spec.js');
  const testSlug = testInfo.titlePath.join(' > ').replace(/[^\w\-]+/g, '_').slice(0, 120);
  const stamp    = new Date().toISOString().replace(/[:.]/g, '-');

  const filePath = path.join(logsDir, `${project}__${specBase}__${testSlug}__${stamp}.log`);
  const fileDest = pino.destination({ dest: filePath, sync: false });

  const fileLogger = pino({
    level,
    timestamp: pino.stdTimeFunctions.isoTime,
    base: {
      project,
      spec: specBase,
      test: testInfo.title,
      path: testInfo.titlePath
    }
  }, fileDest);

  return {
    info:  (obj, msg) => { fileLogger.info(obj, msg);  consoleLogger.info(obj, msg);  },
    debug: (obj, msg) => { fileLogger.debug(obj, msg); consoleLogger.debug(obj, msg); },
    warn:  (obj, msg) => { fileLogger.warn(obj, msg);  consoleLogger.warn(obj, msg);  },
    error: (obj, msg) => { fileLogger.error(obj, msg); consoleLogger.error(obj, msg); },
    flush: () => fileDest.flush?.(),
    _filePath: filePath
  };
}
