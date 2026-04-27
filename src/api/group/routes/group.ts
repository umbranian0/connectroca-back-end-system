/**
 * group router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::group.group', {
  config: {
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
  },
});
