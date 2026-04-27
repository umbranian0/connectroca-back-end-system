/**
 * material router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::material.material', {
  config: {
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
  },
});
