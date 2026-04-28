#!/usr/bin/env node

function isMissing(value) {
  return value === undefined || value === null || String(value).trim() === '';
}

function isPlaceholder(value) {
  if (isMissing(value)) {
    return false;
  }

  const normalized = String(value).trim().toLowerCase();

  return (
    normalized.includes('replace_me') ||
    normalized.includes('replace_with_4_keys') ||
    normalized.includes('change-this') ||
    normalized.includes('<k1>') ||
    normalized.includes('<your-backend-app-name>') ||
    normalized.includes('your-heroku-app-name')
  );
}

function splitCsv(value) {
  return String(value)
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

function requireVar(errors, env, name) {
  const value = env[name];

  if (isMissing(value)) {
    errors.push(`${name} is missing.`);
    return;
  }

  if (isPlaceholder(value)) {
    errors.push(`${name} still has a placeholder value.`);
  }
}

function validateProductionEnv() {
  const env = process.env;
  const errors = [];

  const requiredVars = [
    'HOST',
    'PUBLIC_URL',
    'APP_KEYS',
    'API_TOKEN_SALT',
    'ADMIN_JWT_SECRET',
    'TRANSFER_TOKEN_SALT',
    'JWT_SECRET',
    'ENCRYPTION_KEY',
    'DATABASE_CLIENT',
  ];

  for (const name of requiredVars) {
    requireVar(errors, env, name);
  }

  if (!isMissing(env.PUBLIC_URL) && !String(env.PUBLIC_URL).startsWith('https://')) {
    errors.push('PUBLIC_URL must start with https:// in production.');
  }

  const appKeys = splitCsv(env.APP_KEYS ?? '');
  if (appKeys.length < 4) {
    errors.push('APP_KEYS must contain at least 4 comma-separated keys.');
  }

  for (const key of appKeys) {
    if (key.length < 16) {
      errors.push('Each APP_KEYS entry must have at least 16 characters.');
      break;
    }

    if (isPlaceholder(key)) {
      errors.push('APP_KEYS contains placeholder values.');
      break;
    }
  }

  const hasDatabaseUrl = !isMissing(env.DATABASE_URL);
  if (hasDatabaseUrl && isPlaceholder(env.DATABASE_URL)) {
    errors.push('DATABASE_URL still has a placeholder value.');
  }

  if (!hasDatabaseUrl) {
    for (const name of ['DATABASE_HOST', 'DATABASE_PORT', 'DATABASE_NAME', 'DATABASE_USERNAME', 'DATABASE_PASSWORD']) {
      requireVar(errors, env, name);
    }
  }

  if (errors.length > 0) {
    console.error('[prestart] Environment validation failed:');
    for (const error of errors) {
      console.error(`- ${error}`);
    }

    console.error('[prestart] Set real config vars in Heroku with `heroku config:set ...` and restart the dyno.');
    process.exit(1);
  }

  console.log('[prestart] Production environment validation passed.');
}

function main() {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[prestart] NODE_ENV is not production; strict env validation skipped.');
    return;
  }

  validateProductionEnv();
}

main();
