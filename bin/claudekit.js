#!/usr/bin/env node
/**
 * claudekit CLI — Multi-AI coding agent setup for Claude Code + Cursor
 *
 * Usage:
 *   claudekit init [--claude|--cursor|--all] [--force] [--dry-run]
 *   claudekit sync [--claude|--cursor|--all]
 *   claudekit --help
 */

const { init } = require('../src/init');

const args = process.argv.slice(2);
const cmd = args[0];

// Parse flags from argv
const flags = {
  claude: args.includes('--claude'),
  cursor: args.includes('--cursor'),
  all: args.includes('--all'),
  force: args.includes('--force'),
  dryRun: args.includes('--dry-run'),
  // --cwd <path> for testability
  cwd: (() => {
    const idx = args.indexOf('--cwd');
    return idx !== -1 ? args[idx + 1] : null;
  })(),
};

// Default: if neither --claude nor --cursor specified, treat as --all
if (!flags.claude && !flags.cursor) {
  flags.all = true;
}

if (cmd === 'init') {
  init({ ...flags, isSync: false }).catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
} else if (cmd === 'sync') {
  // sync = init with --force (no overwrite prompt)
  init({ ...flags, isSync: true, force: true }).catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
} else {
  printHelp();
}

function printHelp() {
  console.log(`
claudekit — Multi-AI coding agent setup for Claude Code + Cursor

Usage:
  claudekit init [options]   Fresh install into current directory
  claudekit sync [options]   Update existing install (overwrites)

Options:
  --claude     Install Claude Code setup only (.claude/)
  --cursor     Install Cursor setup only (.cursor/)
  --all        Install both Claude + Cursor (default)
  --force      Skip overwrite prompts
  --dry-run    Show what would be installed without writing

Examples:
  npx github:yourorg/claudekit init
  npx github:yourorg/claudekit init --claude
  npx github:yourorg/claudekit init --cursor
  npx github:yourorg/claudekit sync
`);
}
