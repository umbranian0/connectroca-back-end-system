/**
 * topic controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::topic.topic', ({ strapi }) => ({
  async find(ctx) {
    const topics = await strapi.entityService.findMany('api::topic.topic', {
      populate: {
        area: true,
        group: true,
        creator: true,
        posts: true,
      },
    });

    const total = await strapi.entityService.count('api::topic.topic');

    return {
      data: topics,
      meta: {
        pagination: {
          page: 1,
          pageSize: Array.isArray(topics) ? topics.length : 0,
          pageCount: 1,
          total,
        },
      },
    };
  },

  async create(ctx) {
    const userId = ctx.state?.user?.id;

    if (!userId) {
      return ctx.unauthorized('Authentication is required to create topics.');
    }

    ctx.request.body = ctx.request.body || {};
    ctx.request.body.data = ctx.request.body.data || {};
    ctx.request.body.data.creator = userId;

    return super.create(ctx);
  },

  async update(ctx) {
    const userId = ctx.state?.user?.id;

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

    ctx.request.body = ctx.request.body || {};
    ctx.request.body.data = ctx.request.body.data || {};
    ctx.request.body.data.creator = userId;

    return super.update(ctx);
  },

  async delete(ctx) {
    const userId = ctx.state?.user?.id;

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