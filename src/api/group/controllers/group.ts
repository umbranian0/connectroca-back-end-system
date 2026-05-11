/**
 * group controller
 */

import { factories } from '@strapi/strapi';
import { assignAuthenticatedUserRelation, getAuthenticatedUserId } from '../../../utils/authenticatedRelation';

export default factories.createCoreController('api::group.group', ({ strapi }) => ({
  async create(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to create groups.');
    }

    assignAuthenticatedUserRelation(ctx, 'creator', userId);
    return super.create(ctx);
  },

  async update(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to update groups.');
    }

    const targetGroupId = ctx?.params?.id;
    const targetGroup = await strapi.db.query('api::group.group').findOne({
      where: { id: targetGroupId },
      populate: ['creator'],
    });

    if (!targetGroup) {
      return ctx.notFound('Group not found.');
    }

    if ((targetGroup?.creator?.id ?? null) !== userId) {
      return ctx.forbidden('You can only update groups you created.');
    }

    assignAuthenticatedUserRelation(ctx, 'creator', userId);
    return super.update(ctx);
  },

  async delete(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to delete groups.');
    }

    const targetGroupId = ctx?.params?.id;
    const targetGroup = await strapi.db.query('api::group.group').findOne({
      where: { id: targetGroupId },
      populate: ['creator'],
    });

    if (!targetGroup) {
      return ctx.notFound('Group not found.');
    }

    if ((targetGroup?.creator?.id ?? null) !== userId) {
      return ctx.forbidden('You can only delete groups you created.');
    }

    return super.delete(ctx);
  },
}));
