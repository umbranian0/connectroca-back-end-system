/**
 * user-area controller
 */

import { factories } from '@strapi/strapi';
import { assignAuthenticatedUserRelation, getAuthenticatedUserId } from '../../../utils/authenticatedRelation';

export default factories.createCoreController('api::user-area.user-area', () => ({
  async create(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to create user-area relationships.');
    }

    assignAuthenticatedUserRelation(ctx, 'user', userId);
    return super.create(ctx);
  },
}));
