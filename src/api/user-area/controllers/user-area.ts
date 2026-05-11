/**
 * user-area controller
 */

import { factories } from '@strapi/strapi';
import { assignAuthenticatedUserRelation, getAuthenticatedUserId } from '../../../utils/authenticatedRelation';
import {
  extractRelationId,
  getRequestData,
  hasOwnField,
} from '../../../utils/relationPayload';

export default factories.createCoreController('api::user-area.user-area', ({ strapi }) => ({
  async find(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to read user-area relationships.');
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
      return ctx.unauthorized('Authentication is required to read user-area relationships.');
    }

    const targetUserAreaId = ctx?.params?.id;
    const targetUserArea = await strapi.db.query('api::user-area.user-area').findOne({
      where: { id: targetUserAreaId },
      populate: ['user'],
    });

    if (!targetUserArea) {
      return ctx.notFound('User-area relationship not found.');
    }

    if ((targetUserArea?.user?.id ?? null) !== userId) {
      return ctx.forbidden('You can only read your own user-area relationships.');
    }

    return super.findOne(ctx);
  },

  async create(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to create user-area relationships.');
    }

    assignAuthenticatedUserRelation(ctx, 'user', userId);

    const data = getRequestData(ctx);
    const areaId = extractRelationId(data.area);

    if (!areaId) {
      return ctx.badRequest('The area relation is required.');
    }

    const duplicate = await strapi.db.query('api::user-area.user-area').findOne({
      where: {
        user: userId,
        area: areaId,
      },
    });

    if (duplicate?.id) {
      return ctx.conflict('This user-area relationship already exists.');
    }

    return super.create(ctx);
  },

  async update(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to update user-area relationships.');
    }

    const targetUserAreaId = ctx?.params?.id;
    const targetUserArea = await strapi.db.query('api::user-area.user-area').findOne({
      where: { id: targetUserAreaId },
      populate: ['user', 'area'],
    });

    if (!targetUserArea) {
      return ctx.notFound('User-area relationship not found.');
    }

    if ((targetUserArea?.user?.id ?? null) !== userId) {
      return ctx.forbidden('You can only update your own user-area relationships.');
    }

    assignAuthenticatedUserRelation(ctx, 'user', userId);

    const data = getRequestData(ctx);
    const nextAreaId = hasOwnField(data, 'area')
      ? extractRelationId(data.area)
      : (targetUserArea?.area?.id ?? null);

    if (!nextAreaId) {
      return ctx.badRequest('The area relation is required.');
    }

    const duplicate = await strapi.db.query('api::user-area.user-area').findOne({
      where: {
        id: {
          $ne: targetUserArea.id,
        },
        user: userId,
        area: nextAreaId,
      },
    });

    if (duplicate?.id) {
      return ctx.conflict('This user-area relationship already exists.');
    }

    return super.update(ctx);
  },

  async delete(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to delete user-area relationships.');
    }

    const targetUserAreaId = ctx?.params?.id;
    const targetUserArea = await strapi.db.query('api::user-area.user-area').findOne({
      where: { id: targetUserAreaId },
      populate: ['user'],
    });

    if (!targetUserArea) {
      return ctx.notFound('User-area relationship not found.');
    }

    if ((targetUserArea?.user?.id ?? null) !== userId) {
      return ctx.forbidden('You can only delete your own user-area relationships.');
    }

    return super.delete(ctx);
  },
}));
