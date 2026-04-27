/**
 * profile router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::profile.profile', {
  config: {
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
  },
});
