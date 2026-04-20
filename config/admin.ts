import type { Core } from '@strapi/strapi';

const adminConfig = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  url: env('ADMIN_URL', '/admin'),
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'connecttroca-admin-secret'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'connecttroca-api-token-salt'),
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY', 'connecttroca-encryption-key'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'connecttroca-transfer-token-salt'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', false),
    promoteEE: env.bool('FLAG_PROMOTE_EE', false),
  },
});

export default adminConfig;