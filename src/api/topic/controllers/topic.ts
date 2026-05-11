/**
 * topic controller
 */

import { factories } from '@strapi/strapi';
import { assignAuthenticatedUserRelation, getAuthenticatedUserId } from '../../../utils/authenticatedRelation';

export default factories.createCoreController('api::topic.topic', ({ strapi }) => ({
  async create(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to create topics.');
    }

    assignAuthenticatedUserRelation(ctx, 'creator', userId);
    return super.create(ctx);
  },

  async update(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to update topics.');
    }

    const targetTopicId = ctx?.params?.id;
    const targetTopic = await strapi.db.query('api::topic.topic').findOne({
      where: { id: targetTopicId },
      populate: ['creator'],
    });

    if (!targetTopic) {
      return ctx.notFound('Topic not found.');
    }

    if ((targetTopic?.creator?.id ?? null) !== userId) {
      return ctx.forbidden('You can only update topics you created.');
    }

    assignAuthenticatedUserRelation(ctx, 'creator', userId);
    return super.update(ctx);
  },

  async delete(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to delete topics.');
    }

    const targetTopicId = ctx?.params?.id;
    const targetTopic = await strapi.db.query('api::topic.topic').findOne({
      where: { id: targetTopicId },
      populate: ['creator'],
    });

    if (!targetTopic) {
      return ctx.notFound('Topic not found.');
    }

    if ((targetTopic?.creator?.id ?? null) !== userId) {
      return ctx.forbidden('You can only delete topics you created.');
    }

    return super.delete(ctx);
  },
}));
