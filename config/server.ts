import type { Core } from '@strapi/strapi';

const serverConfig = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => {
  const herokuAppName = env('HEROKU_APP_NAME', '');
  const fallbackPublicUrl = herokuAppName
    ? `https://${herokuAppName}.herokuapp.com`
    : 'http://localhost:1337';

  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    url: env('PUBLIC_URL', fallbackPublicUrl),
    proxy: env.bool('IS_PROXIED', true),
    app: {
      keys: env.array('APP_KEYS', [
        'connecttrocaKeyOne',
        'connecttrocaKeyTwo',
        'connecttrocaKeyThree',
        'connecttrocaKeyFour',
      ]),
    },
  };
};

export default serverConfig;
