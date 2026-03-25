/**
 * init.js — Core copy logic for claudekit init / sync commands.
 *
 * Copies claude/ and/or cursor/ templates into the user's project.
 * Handles overwrite prompts, template variable substitution, and post-install summary.
 */

'use strict';

const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { copyDir, ensureDir, replaceTemplateVars, log } = require('./utils');

const PKG_ROOT = path.join(__dirname, '..');

/**
 * Main entry point — routes install based on flags.
 *
 * @param {object} flags
 * @param {boolean} flags.claude   - Install .claude/
 * @param {boolean} flags.cursor   - Install .cursor/
 * @param {boolean} flags.all      - Install both (default)
 * @param {boolean} flags.force    - Skip overwrite prompts
 * @param {boolean} flags.dryRun   - Show plan without writing
 * @param {boolean} flags.isSync   - true = sync mode (force=true, no prompt)
 * @param {string}  flags.cwd      - Override CWD (for testing)
 */
async function init(flags = {}) {
  const cwd = flags.cwd ? path.resolve(flags.cwd) : process.cwd();
  const projectName = path.basename(cwd);
  const force = flags.force || flags.isSync || process.env.CI === 'true';
  const dryRun = flags.dryRun || false;
  const all = flags.all || (!flags.claude && !flags.cursor);

  const installed = [];

  if (flags.claude || all) {
    const ok = await installClaude(cwd, force, dryRun);
    if (ok) installed.push('.claude/');
  }

  if (flags.cursor || all) {
    const ok = await installCursor(cwd, force, dryRun);
    if (ok) installed.push('.cursor/');
  }

  if (all) {
    const ok = await installShared(cwd, projectName, force, dryRun);
    if (ok) installed.push('CLAUDE.md', 'AGENTS.md');

    const tplOk = await installPlanTemplates(cwd, dryRun);
    if (tplOk) installed.push('plans/templates/');
  }

  printSummary(installed, dryRun, flags.isSync);
}

/**
 * Copy claude/ template → <cwd>/.claude/
 */
async function installClaude(cwd, force, dryRun) {
  const src = path.join(PKG_ROOT, 'claude');
  const dest = path.join(cwd, '.claude');

  if (!force && fs.existsSync(dest)) {
    const confirmed = await promptOverwrite(dest);
    if (!confirmed) {
      log('  Skipped .claude/');
      return false;
    }
  }

  if (!dryRun) {
    ensureDir(dest);
    copyDir(src, dest);
  }
  log(`  ${dryRun ? '[dry-run] ' : ''}✓ .claude/ installed`);
  return true;
}

/**
 * Copy cursor/ template → <cwd>/.cursor/
 */
async function installCursor(cwd, force, dryRun) {
  const src = path.join(PKG_ROOT, 'cursor');
  const dest = path.join(cwd, '.cursor');

  if (!force && fs.existsSync(dest)) {
    const confirmed = await promptOverwrite(dest);
    if (!confirmed) {
      log('  Skipped .cursor/');
      return false;
    }
  }

  if (!dryRun) {
    ensureDir(dest);
    copyDir(src, dest);
  }
  log(`  ${dryRun ? '[dry-run] ' : ''}✓ .cursor/ installed`);
  return true;
}

/**
 * Copy shared/ .tpl files → <cwd>/ with template vars replaced.
 * Skips files that already exist (unless force).
 */
async function installShared(cwd, projectName, force, dryRun) {
  const sharedDir = path.join(PKG_ROOT, 'shared');
  if (!fs.existsSync(sharedDir)) return false;

  const vars = {
    PROJECT_NAME: projectName,
    PROJECT_DESCRIPTION: 'Add your project description here.',
  };

  const tplFiles = fs.readdirSync(sharedDir).filter((f) => f.endsWith('.tpl'));

  for (const tplFile of tplFiles) {
    // Output filename strips .tpl extension (e.g., CLAUDE.md.tpl → CLAUDE.md)
    const outName = tplFile.replace(/\.tpl$/, '');
    const destPath = path.join(cwd, outName);

    if (!force && fs.existsSync(destPath)) {
      log(`  Skipped ${outName} (already exists — use --force to overwrite)`);
      continue;
    }

    if (!dryRun) {
      const raw = fs.readFileSync(path.join(sharedDir, tplFile), 'utf8');
      const content = replaceTemplateVars(raw, vars);
      fs.writeFileSync(destPath, content, 'utf8');
    }
    log(`  ${dryRun ? '[dry-run] ' : ''}✓ ${outName}`);
  }

  return true;
}

/**
 * Copy shared/plan-templates/ → <cwd>/plans/templates/
 * Only copies files that don't already exist (never overwrites user plans).
 */
async function installPlanTemplates(cwd, dryRun) {
  const src = path.join(PKG_ROOT, 'shared', 'plan-templates');
  if (!fs.existsSync(src)) return false;

  const dest = path.join(cwd, 'plans', 'templates');

  if (!dryRun) {
    ensureDir(dest);
    // Copy each template file individually — skip existing to preserve user edits
    const files = fs.readdirSync(src);
    for (const file of files) {
      const destFile = path.join(dest, file);
      if (!fs.existsSync(destFile)) {
        fs.copyFileSync(path.join(src, file), destFile);
      }
    }
  }
  log(`  ${dryRun ? '[dry-run] ' : ''}✓ plans/templates/ installed`);
  return true;
}

/**
 * Prompt user to confirm overwrite of an existing directory.
 * Returns true if user confirms, false otherwise.
 * Auto-confirms in CI or when stdin is not a TTY.
 */
function promptOverwrite(dirPath) {
  return new Promise((resolve) => {
    // Non-interactive environment: default to No (safe)
    if (!process.stdin.isTTY) {
      log(`  Note: ${path.basename(dirPath)}/ already exists. Use --force to overwrite.`);
      return resolve(false);
    }

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(
      `  ${path.basename(dirPath)}/ already exists. Overwrite? [y/N] `,
      (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === 'y');
      }
    );
  });
}

/**
 * Print post-install summary and next steps.
 */
function printSummary(installed, dryRun, isSync) {
  if (installed.length === 0) {
    log('\n  Nothing installed.');
    return;
  }

  const action = dryRun ? 'Would install' : isSync ? 'Synced' : 'Installed';
  log(`\n✓ claudekit ${action.toLowerCase()}!`);
  log('');
  installed.forEach((item) => log(`  ${item}`));

  if (!dryRun) {
    log(`
Next steps:
  1. Run: .claude/skills/install.sh    (sets up Python/Node deps for skills)
  2. Review CLAUDE.md — update project name/description if needed
  3. For Cursor/Windsurf: restart the editor to load .cursor/ rules and skills
  4. Plan templates ready at: plans/templates/

Docs: https://github.com/droppii/droppii-agents
`);
  }
}

module.exports = { init };
