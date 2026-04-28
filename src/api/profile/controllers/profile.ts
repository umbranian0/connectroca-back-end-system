/**
 * profile controller
 */

import { factories } from '@strapi/strapi';
import { assignAuthenticatedUserRelation, getAuthenticatedUserId } from '../../../utils/authenticatedRelation';

export default factories.createCoreController('api::profile.profile', ({ strapi }) => ({
  async create(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to create a profile.');
    }

    assignAuthenticatedUserRelation(ctx, 'user', userId);

    const existingProfile = await strapi.db.query('api::profile.profile').findOne({
      where: { user: userId },
    });

    if (existingProfile?.id) {
      ctx.params = {
        ...ctx.params,
        id: existingProfile.id,
      };

      return super.update(ctx);
    }

    return super.create(ctx);
  },

  async update(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to update a profile.');
    }

    const targetProfileId = ctx?.params?.id;
    const targetProfile = await strapi.db.query('api::profile.profile').findOne({
      where: { id: targetProfileId },
      populate: ['user'],
    });

    if (!targetProfile) {
      return ctx.notFound('Profile not found.');
    }

    const ownerId = targetProfile?.user?.id ?? null;

    if (ownerId !== userId) {
      return ctx.forbidden('You can only update your own profile.');
    }

    assignAuthenticatedUserRelation(ctx, 'user', userId);
    return super.update(ctx);
  },
}));
