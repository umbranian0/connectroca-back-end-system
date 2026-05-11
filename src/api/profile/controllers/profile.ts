/**
 * profile controller
 */

import { factories } from '@strapi/strapi';
import { assignAuthenticatedUserRelation, getAuthenticatedUserId } from '../../../utils/authenticatedRelation';

export default factories.createCoreController('api::profile.profile', ({ strapi }) => ({
  async find(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to read profile data.');
    }

    const currentFilters = (ctx?.query?.filters as Record<string, unknown>) ?? {};
    ctx.query = {
      ...ctx.query,
      filters: {
        ...currentFilters,
        user: {
          id: {
            $eq: userId,
          },
        },
      },
    };

    return super.find(ctx);
  },

  async findOne(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to read profile data.');
    }

    const targetProfileId = ctx?.params?.id;
    const targetProfile = await strapi.db.query('api::profile.profile').findOne({
      where: { id: targetProfileId },
      populate: ['user'],
    });

    if (!targetProfile) {
      return ctx.notFound('Profile not found.');
    }

    if ((targetProfile?.user?.id ?? null) !== userId) {
      return ctx.forbidden('You can only read your own profile.');
    }

    return super.findOne(ctx);
  },

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

  async delete(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to delete a profile.');
    }

    const targetProfileId = ctx?.params?.id;
    const targetProfile = await strapi.db.query('api::profile.profile').findOne({
      where: { id: targetProfileId },
      populate: ['user'],
    });

    if (!targetProfile) {
      return ctx.notFound('Profile not found.');
    }

    if ((targetProfile?.user?.id ?? null) !== userId) {
      return ctx.forbidden('You can only delete your own profile.');
    }

    return super.delete(ctx);
  },
}));
