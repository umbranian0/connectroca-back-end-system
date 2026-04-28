/**
 * comment controller
 */

import { factories } from '@strapi/strapi';
import { assignAuthenticatedUserRelation, getAuthenticatedUserId } from '../../../utils/authenticatedRelation';

export default factories.createCoreController('api::comment.comment', () => ({
  async create(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to create comments.');
    }

    assignAuthenticatedUserRelation(ctx, 'author', userId);
    return super.create(ctx);
  },
}));
