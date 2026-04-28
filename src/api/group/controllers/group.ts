/**
 * group controller
 */

import { factories } from '@strapi/strapi';
import { assignAuthenticatedUserRelation, getAuthenticatedUserId } from '../../../utils/authenticatedRelation';

export default factories.createCoreController('api::group.group', () => ({
  async create(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to create groups.');
    }

    assignAuthenticatedUserRelation(ctx, 'creator', userId);
    return super.create(ctx);
  },
}));
