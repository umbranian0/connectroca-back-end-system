/**
 * topic controller
 */

import { factories } from '@strapi/strapi';
import { assignAuthenticatedUserRelation, getAuthenticatedUserId } from '../../../utils/authenticatedRelation';

export default factories.createCoreController('api::topic.topic', () => ({
  async create(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to create topics.');
    }

    assignAuthenticatedUserRelation(ctx, 'creator', userId);
    return super.create(ctx);
  },
}));
