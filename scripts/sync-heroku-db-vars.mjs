#!/usr/bin/env node

import { execFileSync } from 'node:child_process';

function runHeroku(args) {
  return execFileSync('heroku', args, {
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
  }).trim();
}

function maskSecret(value) {
  if (!value) {
    return '<empty>';
  }

  if (value.length <= 6) {
    return '***';
  }

  return `${value.slice(0, 3)}***${value.slice(-3)}`;
}

function main() {
  const appName = process.argv[2];

  if (!appName) {
    console.error('Usage: node scripts/sync-heroku-db-vars.mjs <heroku-app-name>');
    process.exit(1);
  }

  let databaseUrl = '';

  try {
    databaseUrl = runHeroku(['config:get', 'DATABASE_URL', '-a', appName]);
  } catch (error) {
    const stderr = error?.stderr?.toString?.() ?? String(error);
    console.error(`Failed to read DATABASE_URL from Heroku app "${appName}":\n${stderr}`);
    process.exit(1);
  }

  if (!databaseUrl) {
    console.error(
      `DATABASE_URL is not set for app "${appName}". Add Heroku Postgres first: heroku addons:create heroku-postgresql:essential-0 -a ${appName}`,
    );
    process.exit(1);
  }

  let parsed;
  try {
    parsed = new URL(databaseUrl);
  } catch {
    console.error('DATABASE_URL is not a valid URL.');
    process.exit(1);
  }

  const databaseVars = {
    DATABASE_HOST: parsed.hostname,
    DATABASE_PORT: parsed.port || '5432',
    DATABASE_NAME: decodeURIComponent(parsed.pathname.replace(/^\//, '')),
    DATABASE_USERNAME: decodeURIComponent(parsed.username),
    DATABASE_PASSWORD: decodeURIComponent(parsed.password),
    DATABASE_SCHEMA: 'public',
  };

  const herokuSetArgs = ['config:set'];
  for (const [name, value] of Object.entries(databaseVars)) {
    herokuSetArgs.push(`${name}=${value}`);
  }
  herokuSetArgs.push('-a', appName);

  try {
    const output = runHeroku(herokuSetArgs);
    if (output) {
      console.log(output);
    }

    console.log('Database component variables synced from DATABASE_URL:');
    console.log(`- DATABASE_HOST=${databaseVars.DATABASE_HOST}`);
    console.log(`- DATABASE_PORT=${databaseVars.DATABASE_PORT}`);
    console.log(`- DATABASE_NAME=${databaseVars.DATABASE_NAME}`);
    console.log(`- DATABASE_USERNAME=${maskSecret(databaseVars.DATABASE_USERNAME)}`);
    console.log(`- DATABASE_PASSWORD=${maskSecret(databaseVars.DATABASE_PASSWORD)}`);
    console.log(`- DATABASE_SCHEMA=${databaseVars.DATABASE_SCHEMA}`);
  } catch (error) {
    const stderr = error?.stderr?.toString?.() ?? String(error);
    console.error(`Failed to set database component vars on Heroku:\n${stderr}`);
    process.exit(1);
  }
}

main();
