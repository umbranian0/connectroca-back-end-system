import type { Core } from '@strapi/strapi';
import type { ClientKind } from '@strapi/types/dist/core/config/database';

type ParsedDatabaseUrl = {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
};

const DEFAULT_POSTGRES_PORT = 5432;

function decodeUrlPart(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function parseDatabaseUrl(databaseUrl?: string): ParsedDatabaseUrl | null {
  if (!databaseUrl) {
    return null;
  }

  try {
    const parsedUrl = new URL(databaseUrl);

    return {
      host: parsedUrl.hostname,
      port: Number(parsedUrl.port || DEFAULT_POSTGRES_PORT),
      database: decodeUrlPart(parsedUrl.pathname.replace(/^\//, '')),
      user: decodeUrlPart(parsedUrl.username),
      password: decodeUrlPart(parsedUrl.password),
    };
  } catch {
    return null;
  }
}

function defineEnvIfMissing(name: string, value: string | number | undefined) {
  if (value === undefined || value === '' || process.env[name]) {
    return;
  }

  process.env[name] = String(value);
}

const databaseConfig = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Database => {
  const databaseUrl = env('DATABASE_URL');
  const parsedDatabaseUrl = parseDatabaseUrl(databaseUrl);

  // Keep component-style variables available when Heroku only provides DATABASE_URL.
  defineEnvIfMissing('DATABASE_HOST', parsedDatabaseUrl?.host);
  defineEnvIfMissing('DATABASE_PORT', parsedDatabaseUrl?.port);
  defineEnvIfMissing('DATABASE_NAME', parsedDatabaseUrl?.database);
  defineEnvIfMissing('DATABASE_USERNAME', parsedDatabaseUrl?.user);
  defineEnvIfMissing('DATABASE_PASSWORD', parsedDatabaseUrl?.password);

  const hasDatabaseUrl = Boolean(databaseUrl);
  const useSsl = env.bool('DATABASE_SSL', hasDatabaseUrl);

  return {
    connection: {
      client: env('DATABASE_CLIENT', 'postgres') as ClientKind,
      connection: {
        ...(databaseUrl ? { connectionString: databaseUrl } : {}),
        host: env('DATABASE_HOST', parsedDatabaseUrl?.host ?? 'postgres'),
        port: env.int('DATABASE_PORT', parsedDatabaseUrl?.port ?? DEFAULT_POSTGRES_PORT),
        database: env('DATABASE_NAME', parsedDatabaseUrl?.database ?? 'connecttroca'),
        user: env('DATABASE_USERNAME', parsedDatabaseUrl?.user ?? 'strapi'),
        password: env('DATABASE_PASSWORD', parsedDatabaseUrl?.password ?? 'strapi'),
        schema: env('DATABASE_SCHEMA', 'public'),
        ssl: useSsl
          ? {
              rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
            }
          : false,
      },
      pool: {
        min: env.int('DATABASE_POOL_MIN', 2),
        max: env.int('DATABASE_POOL_MAX', 10),
      },
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};

export default databaseConfig;
