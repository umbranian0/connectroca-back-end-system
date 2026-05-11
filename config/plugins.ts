import type { Core } from '@strapi/strapi';

const pluginsConfig = ({ env }: Core.Config.Shared.ConfigParams) => ({
  documentation: {
    enabled: true,
    config: {
      info: {
        version: env('npm_package_version', '0.1.0'),
        title: 'ConnectTroca API',
        description: 'REST API documentation for the ConnectTroca backend.',
      },
      'x-strapi-config': {
        path: '/documentation',
      },
    },
  },
});

export default pluginsConfig;
