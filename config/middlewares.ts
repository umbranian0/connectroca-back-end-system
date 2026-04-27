import type { Core } from '@strapi/strapi';

const DEFAULT_CORS_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

const VERCEL_ORIGIN_REGEX = /^https:\/\/([a-z0-9-]+\.)*vercel\.app$/i;

function normalizeOrigins(origins: string[]) {
  return origins.map((origin) => origin.trim()).filter(Boolean);
}

const middlewaresConfig = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => {
  const configuredOrigins = normalizeOrigins(env.array('CORS_ORIGIN', DEFAULT_CORS_ORIGINS));
  const allowVercelPreviewOrigins = env.bool('CORS_ALLOW_VERCEL_PREVIEWS', false);

  return [
    'strapi::logger',
    'strapi::errors',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'connect-src': ["'self'", 'https:', 'http:'],
            'img-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io'],
            'media-src': ["'self'", 'data:', 'blob:'],
            upgradeInsecureRequests: null,
          },
        },
      },
    },
    {
      name: 'strapi::cors',
      config: {
        origin: (ctx: any) => {
          const requestOrigin = ctx?.request?.header?.origin as string | undefined;

          if (
            allowVercelPreviewOrigins &&
            requestOrigin &&
            VERCEL_ORIGIN_REGEX.test(requestOrigin)
          ) {
            return [requestOrigin, ...configuredOrigins];
          }

          return configuredOrigins;
        },
        headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
        credentials: true,
      },
    },
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};

export default middlewaresConfig;
