/**
 * like controller
 */

import { factories } from '@strapi/strapi';
import { assignAuthenticatedUserRelation, getAuthenticatedUserId } from '../../../utils/authenticatedRelation';
import {
  countSelectedRelations,
  extractRelationId,
  getRequestData,
  hasOwnField,
} from '../../../utils/relationPayload';

function getLikeTargetWhereClause(
  userId: number,
  materialId: string | number | null,
  postId: string | number | null,
  commentId: string | number | null,
) {
  if (materialId !== null && materialId !== undefined) {
    return { user: userId, material: materialId };
  }

  if (postId !== null && postId !== undefined) {
    return { user: userId, post: postId };
  }

  if (commentId !== null && commentId !== undefined) {
    return { user: userId, comment: commentId };
  }

  return null;
}

export default factories.createCoreController('api::like.like', ({ strapi }) => ({
  async create(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to create likes.');
    }

    const data = getRequestData(ctx);
    const materialId = extractRelationId(data.material);
    const postId = extractRelationId(data.post);
    const commentId = extractRelationId(data.comment);

    if (countSelectedRelations([materialId, postId, commentId]) !== 1) {
      return ctx.badRequest('A like must reference exactly one target: material, post, or comment.');
    }

    const duplicateWhere = getLikeTargetWhereClause(userId, materialId, postId, commentId);
    const duplicateLike = duplicateWhere
      ? await strapi.db.query('api::like.like').findOne({ where: duplicateWhere })
      : null;

    if (duplicateLike?.id) {
      return ctx.conflict('A like already exists for this user and target.');
    }

    assignAuthenticatedUserRelation(ctx, 'user', userId);
    return super.create(ctx);
  },

  async update(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to update likes.');
    }

    const targetLikeId = ctx?.params?.id;
    const targetLike = await strapi.db.query('api::like.like').findOne({
      where: { id: targetLikeId },
      populate: ['user', 'material', 'post', 'comment'],
    });

    if (!targetLike) {
      return ctx.notFound('Like not found.');
    }

    if ((targetLike?.user?.id ?? null) !== userId) {
      return ctx.forbidden('You can only update your own likes.');
    }

    const data = getRequestData(ctx);
    const nextMaterialId = hasOwnField(data, 'material')
      ? extractRelationId(data.material)
      : (targetLike?.material?.id ?? null);
    const nextPostId = hasOwnField(data, 'post')
      ? extractRelationId(data.post)
      : (targetLike?.post?.id ?? null);
    const nextCommentId = hasOwnField(data, 'comment')
      ? extractRelationId(data.comment)
      : (targetLike?.comment?.id ?? null);

    if (countSelectedRelations([nextMaterialId, nextPostId, nextCommentId]) !== 1) {
      return ctx.badRequest('A like must reference exactly one target: material, post, or comment.');
    }

    const duplicateWhere = getLikeTargetWhereClause(userId, nextMaterialId, nextPostId, nextCommentId);
    const duplicateLike = duplicateWhere
      ? await strapi.db.query('api::like.like').findOne({
          where: {
            ...duplicateWhere,
            id: {
              $ne: targetLike.id,
            },
          },
        })
      : null;

    if (duplicateLike?.id) {
      return ctx.conflict('A like already exists for this user and target.');
    }

    assignAuthenticatedUserRelation(ctx, 'user', userId);
    return super.update(ctx);
  },

  async delete(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to delete likes.');
    }

    const targetLikeId = ctx?.params?.id;
    const targetLike = await strapi.db.query('api::like.like').findOne({
      where: { id: targetLikeId },
      populate: ['user'],
    });

    if (!targetLike) {
      return ctx.notFound('Like not found.');
    }

    if ((targetLike?.user?.id ?? null) !== userId) {
      return ctx.forbidden('You can only delete your own likes.');
    }

    return super.delete(ctx);
  },
}));
