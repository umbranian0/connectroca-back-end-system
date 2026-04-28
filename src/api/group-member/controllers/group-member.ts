/**
 * group-member controller
 */

import { factories } from '@strapi/strapi';
import { assignAuthenticatedUserRelation, getAuthenticatedUserId } from '../../../utils/authenticatedRelation';

export default factories.createCoreController('api::group-member.group-member', () => ({
  async create(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to join groups.');
    }

    assignAuthenticatedUserRelation(ctx, 'user', userId);
    return super.create(ctx);
  },
}));
