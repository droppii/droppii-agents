/**
 * Shared utility helpers for claudekit CLI.
 * Pure Node.js — no external dependencies.
 */

const fs = require('fs');
const path = require('path');

/**
 * Recursively copy a directory from src to dest.
 * Uses fs.cpSync (Node 16.7+) which handles symlinks correctly.
 */
function copyDir(src, dest) {
  fs.cpSync(src, dest, {
    recursive: true,
    force: true,
  });
}

/**
 * Ensure a directory exists, creating it recursively if needed.
 */
function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

/**
 * Check if a path exists (file or directory).
 */
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Replace {{KEY}} placeholders in a string with values from vars map.
 * Uses simple string replacement — no eval, no regex injection risk.
 */
function replaceTemplateVars(content, vars) {
  return Object.entries(vars).reduce(
    (str, [key, value]) => str.replaceAll(`{{${key}}}`, value),
    content
  );
}

/**
 * Print a formatted log message to stdout.
 */
function log(msg) {
  console.log(msg);
}

module.exports = { copyDir, ensureDir, fileExists, replaceTemplateVars, log };
