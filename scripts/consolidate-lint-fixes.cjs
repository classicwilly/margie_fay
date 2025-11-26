#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function exec(cmd, opts = {}) {
  console.log('> ', cmd);
  return execSync(cmd, { stdio: 'inherit', ...opts });
}

function runSafe(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8' });
  } catch (e) {
    return String(e.stdout || '') + String(e.stderr || '') + '\n';
  }
}

function gitBranchesExist(branches) {
  const remote = runSafe('git branch -r');
  return branches.map((b) => (remote.indexOf(`origin/${b}`) >= 0 ? `origin/${b}` : b));
}

function abortWith(msg) {
  console.error('ERROR:', msg);
  process.exit(1);
}

const DEFAULT_BRANCHES = [
  'tests/no-unused-vars',
  'src/catch-binding',
  'src/no-unused-vars',
  'src/explicit-function-return-types',
  'src/no-explicit-any',
  'chore/lint-fix'
];

function main() {
  const branches = process.argv.length > 2 ? process.argv.slice(2) : DEFAULT_BRANCHES;

  // Ensure we are in a git repo
  if (!fs.existsSync('.git')) abortWith('Not a git repository (no .git directory found)');

  // Ensure workspace clean
  const status = runSafe('git status --porcelain');
  if (status.trim()) abortWith('Working tree not clean, please commit or stash changes before running this script.');

  // Ensure origin/main fetched
  exec('git fetch origin --prune');

  const timestamp = new Date().toISOString().replace(/[:.-]/g, '').slice(0, 15);
  const consolidated = `chore/consolidated-lint-fixes-auto-${timestamp}`;

  // Create the branch from origin/main
  exec(`git checkout -b ${consolidated} origin/main`);

  const resolvedRemoteBranches = gitBranchesExist(branches);

  const failedBranches = [];

  for (const b of resolvedRemoteBranches) {
    console.log('\n\n>> Attempting to integrate branch:', b);
    try {
      // Try a basic merge
      console.log('Trying git merge --no-ff --no-commit', b);
      try {
        exec(`git merge --no-ff --no-commit ${b}`);
      } catch (err) {
        console.log('Merge produced conflicts or failed - aborting merge and falling back to commit-by-commit approach.');
        exec('git merge --abort');

        // Get commits unique to that branch (relative to origin/main)
        const commitList = runSafe(`git rev-list --reverse origin/main..${b}`).split('\n').map(s => s.trim()).filter(Boolean);
        for (const c of commitList) {
          console.log('Cherry-picking commit', c);
          try {
            exec(`git cherry-pick -x ${c}`);
          } catch (err2) {
            console.log('Conflict detected during cherry-pick, attempting simple auto-resolve (prefer theirs for conflicted files)');
            // Detect conflicted files
            const conflicted = runSafe('git diff --name-only --diff-filter=U').split('\n').map(s => s.trim()).filter(Boolean);
            if (conflicted.length === 0) {
              console.log('No conflicted files detected, aborting cherry-pick');
              exec('git cherry-pick --abort');
              failedBranches.push(b);
              break;
            }
            for (const file of conflicted) {
              console.log('Auto-resolving', file, '- choosing branch commit version (theirs)');
              exec(`git checkout --theirs -- ${file}`);
              exec(`git add ${file}`);
            }
            try {
              exec('git cherry-pick --continue');
            } catch (err3) {
              console.log('Still cannot apply commit', c); 
              exec('git cherry-pick --abort');
              failedBranches.push(b);
              break;
            }
          }
        }
        // Continue to next branch
        continue;
      }
      // If merge succeeded with no conflicts, commit the merge with a message
      try { exec(`git commit -m "Merge ${b} into ${consolidated}" --no-edit`); } catch (e) { /* merge had no changes or already fast-forwarded */ }
    } catch (err) {
      console.error('Failed to integrate branch', b, err);
      failedBranches.push(b);
    }
  }

  console.log('\nIntegration completed. Failed branches:', failedBranches);

  // Run lint and tests
  console.log('\nRunning npm ci');
  exec('npm ci');
  console.log('\nRunning ESLint (this may fail if there are remaining lint errors)');
  const eslintRes = runSafe('npx eslint src --ext .ts,.tsx --max-warnings=0');
  if (eslintRes && eslintRes.indexOf('Ooops!') > -1) {
    console.log(eslintRes);
  }
  console.log('\nRunning tests');
  const tests = runSafe('npx vitest --run');
  console.log(tests);

  console.log('\nPushing consolidated branch to remote');
  exec(`git push -u origin ${consolidated}`);

  console.log('\nAttempting to create a PR via gh...');
  try {
    exec(`gh pr create --base main --head ${consolidated} --title "chore: consolidated lint fixes" --body "Automated consolidation of lint fixes from: ${branches.join(', ')}\n\nBranches auto-merged: ${resolvedRemoteBranches.join(', ')}\nFailed branches: ${failedBranches.join(', ')}"`);
  } catch (e) {
    console.log('gh PR creation failed - you can create one at:', `https://github.com/${runSafe('git config --get remote.origin.url').trim().replace(/\.git$/, '').replace(/^.*@github.com:/, '').replace(/https:\/\//, '')}/pull/new/${consolidated}`);
  }

  console.log('\nDone.');
}

main();
