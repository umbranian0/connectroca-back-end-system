#!/usr/bin/env node

import { readFileSync } from 'node:fs';

function parseEnvTemplate(content) {
  const result = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');
    if (separatorIndex < 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (!key) {
      continue;
    }

    result[key] = value;
  }

  return result;
}

function resolvePlaceholders(value) {
  return value.replace(/\$\{([A-Z0-9_]+)\}/g, (_, envName) => {
    const resolved = process.env[envName];

    if (resolved === undefined) {
      throw new Error(`Missing required environment variable: ${envName}`);
    }

    return resolved;
  });
}

function buildConfigVarsFromTemplate(templatePath) {
  const fileContent = readFileSync(templatePath, 'utf8');
  const parsed = parseEnvTemplate(fileContent);
  const resolved = {};

  for (const [key, value] of Object.entries(parsed)) {
    resolved[key] = resolvePlaceholders(value);
  }

  return resolved;
}

async function syncHerokuConfig({ apiKey, appName, configVars }) {
  const response = await fetch(`https://api.heroku.com/apps/${appName}/config-vars`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/vnd.heroku+json; version=3',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(configVars),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Heroku config sync failed (${response.status}): ${details}`);
  }
}

async function main() {
  const apiKey = process.env.HEROKU_API_KEY;
  const appName = process.env.HEROKU_APP_NAME;
  const templatePath = process.argv[2] ?? 'cloud/heroku.env.template';

  if (!apiKey) {
    throw new Error('HEROKU_API_KEY is required.');
  }

  if (!appName) {
    throw new Error('HEROKU_APP_NAME is required.');
  }

  const configVars = buildConfigVarsFromTemplate(templatePath);
  await syncHerokuConfig({ apiKey, appName, configVars });

  console.log(`Synced ${Object.keys(configVars).length} config vars to Heroku app "${appName}".`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
