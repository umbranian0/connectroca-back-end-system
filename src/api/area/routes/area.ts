/**
 * area router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::area.area', {
  config: {
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
  },
});
