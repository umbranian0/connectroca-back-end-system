/**
 * post controller
 */

import { factories } from '@strapi/strapi';
import { assignAuthenticatedUserRelation, getAuthenticatedUserId } from '../../../utils/authenticatedRelation';

export default factories.createCoreController('api::post.post', ({ strapi }) => ({
  async create(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to create posts.');
    }

    assignAuthenticatedUserRelation(ctx, 'author', userId);
    return super.create(ctx);
  },

  async update(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to update posts.');
    }

    const targetPostId = ctx?.params?.id;
    const targetPost = await strapi.db.query('api::post.post').findOne({
      where: { id: targetPostId },
      populate: ['author'],
    });

    if (!targetPost) {
      return ctx.notFound('Post not found.');
    }

    if ((targetPost?.author?.id ?? null) !== userId) {
      return ctx.forbidden('You can only update posts you authored.');
    }

    assignAuthenticatedUserRelation(ctx, 'author', userId);
    return super.update(ctx);
  },

  async delete(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to delete posts.');
    }

    const targetPostId = ctx?.params?.id;
    const targetPost = await strapi.db.query('api::post.post').findOne({
      where: { id: targetPostId },
      populate: ['author'],
    });

    if (!targetPost) {
      return ctx.notFound('Post not found.');
    }

    if ((targetPost?.author?.id ?? null) !== userId) {
      return ctx.forbidden('You can only delete posts you authored.');
    }

    return super.delete(ctx);
  },
}));
