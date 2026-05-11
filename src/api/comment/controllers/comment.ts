/**
 * comment controller
 */

import { factories } from '@strapi/strapi';
import { assignAuthenticatedUserRelation, getAuthenticatedUserId } from '../../../utils/authenticatedRelation';
import {
  countSelectedRelations,
  extractRelationId,
  getRequestData,
  hasOwnField,
} from '../../../utils/relationPayload';

export default factories.createCoreController('api::comment.comment', ({ strapi }) => ({
  async create(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to create comments.');
    }

    const data = getRequestData(ctx);
    const materialId = extractRelationId(data.material);
    const postId = extractRelationId(data.post);

    if (countSelectedRelations([materialId, postId]) !== 1) {
      return ctx.badRequest('A comment must reference exactly one target: material or post.');
    }

    assignAuthenticatedUserRelation(ctx, 'author', userId);
    return super.create(ctx);
  },

  async update(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to update comments.');
    }

    const targetCommentId = ctx?.params?.id;
    const targetComment = await strapi.db.query('api::comment.comment').findOne({
      where: { id: targetCommentId },
      populate: ['author', 'material', 'post'],
    });

    if (!targetComment) {
      return ctx.notFound('Comment not found.');
    }

    if ((targetComment?.author?.id ?? null) !== userId) {
      return ctx.forbidden('You can only update comments you authored.');
    }

    const data = getRequestData(ctx);
    const nextMaterialId = hasOwnField(data, 'material')
      ? extractRelationId(data.material)
      : (targetComment?.material?.id ?? null);
    const nextPostId = hasOwnField(data, 'post')
      ? extractRelationId(data.post)
      : (targetComment?.post?.id ?? null);

    if (countSelectedRelations([nextMaterialId, nextPostId]) !== 1) {
      return ctx.badRequest('A comment must reference exactly one target: material or post.');
    }

    assignAuthenticatedUserRelation(ctx, 'author', userId);
    return super.update(ctx);
  },

  async delete(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to delete comments.');
    }

    const targetCommentId = ctx?.params?.id;
    const targetComment = await strapi.db.query('api::comment.comment').findOne({
      where: { id: targetCommentId },
      populate: ['author'],
    });

    if (!targetComment) {
      return ctx.notFound('Comment not found.');
    }

    if ((targetComment?.author?.id ?? null) !== userId) {
      return ctx.forbidden('You can only delete comments you authored.');
    }

    return super.delete(ctx);
  },
}));
