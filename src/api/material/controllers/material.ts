/**
 * material controller
 */

import { factories } from '@strapi/strapi';
import { assignAuthenticatedUserRelation, getAuthenticatedUserId } from '../../../utils/authenticatedRelation';

export default factories.createCoreController('api::material.material', ({ strapi }) => ({
  async create(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to create materials.');
    }

    assignAuthenticatedUserRelation(ctx, 'author', userId);
    return super.create(ctx);
  },

  async update(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to update materials.');
    }

    const targetMaterialId = ctx?.params?.id;
    const targetMaterial = await strapi.db.query('api::material.material').findOne({
      where: { id: targetMaterialId },
      populate: ['author'],
    });

    if (!targetMaterial) {
      return ctx.notFound('Material not found.');
    }

    if ((targetMaterial?.author?.id ?? null) !== userId) {
      return ctx.forbidden('You can only update materials you authored.');
    }

    assignAuthenticatedUserRelation(ctx, 'author', userId);
    return super.update(ctx);
  },

  async delete(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to delete materials.');
    }

    const targetMaterialId = ctx?.params?.id;
    const targetMaterial = await strapi.db.query('api::material.material').findOne({
      where: { id: targetMaterialId },
      populate: ['author'],
    });

    if (!targetMaterial) {
      return ctx.notFound('Material not found.');
    }

    if ((targetMaterial?.author?.id ?? null) !== userId) {
      return ctx.forbidden('You can only delete materials you authored.');
    }

    return super.delete(ctx);
  },
}));
