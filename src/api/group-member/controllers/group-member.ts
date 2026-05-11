/**
 * group-member controller
 */

import { factories } from '@strapi/strapi';
import { assignAuthenticatedUserRelation, getAuthenticatedUserId } from '../../../utils/authenticatedRelation';
import {
  extractRelationId,
  getRequestData,
  hasOwnField,
} from '../../../utils/relationPayload';

async function getAccessibleGroupIds(strapi: any, userId: number): Promise<number[]> {
  const [createdGroups, memberships] = await Promise.all([
    strapi.db.query('api::group.group').findMany({
      where: { creator: userId },
      select: ['id'],
    }),
    strapi.db.query('api::group-member.group-member').findMany({
      where: { user: userId },
      populate: ['group'],
    }),
  ]);

  const ids = new Set<number>();

  for (const group of createdGroups) {
    if (group?.id) {
      ids.add(group.id);
    }
  }

  for (const membership of memberships) {
    if (membership?.group?.id) {
      ids.add(membership.group.id);
    }
  }

  return [...ids];
}

export default factories.createCoreController('api::group-member.group-member', ({ strapi }) => ({
  async find(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to read group memberships.');
    }

    const accessibleGroupIds = await getAccessibleGroupIds(strapi, userId);
    const currentFilters = (ctx?.query?.filters as Record<string, unknown>) ?? {};
    const scopeFilter = {
      group: {
        id: {
          $in: accessibleGroupIds.length > 0 ? accessibleGroupIds : [-1],
        },
      },
    };

    ctx.query = {
      ...ctx.query,
      filters:
        Object.keys(currentFilters).length > 0
          ? {
              $and: [currentFilters, scopeFilter],
            }
          : scopeFilter,
    };

    return super.find(ctx);
  },

  async findOne(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to read group memberships.');
    }

    const targetMembershipId = ctx?.params?.id;
    const targetMembership = await strapi.db.query('api::group-member.group-member').findOne({
      where: { id: targetMembershipId },
      populate: ['group', 'group.creator', 'user'],
    });

    if (!targetMembership) {
      return ctx.notFound('Membership not found.');
    }

    const accessibleGroupIds = await getAccessibleGroupIds(strapi, userId);

    if (!accessibleGroupIds.includes(targetMembership?.group?.id)) {
      return ctx.forbidden('You do not have access to this membership.');
    }

    return super.findOne(ctx);
  },

  async create(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to join groups.');
    }

    assignAuthenticatedUserRelation(ctx, 'user', userId);

    const data = getRequestData(ctx);
    const groupId = extractRelationId(data.group);

    if (!groupId) {
      return ctx.badRequest('The group relation is required.');
    }

    const duplicate = await strapi.db.query('api::group-member.group-member').findOne({
      where: {
        user: userId,
        group: groupId,
      },
    });

    if (duplicate?.id) {
      return ctx.conflict('You are already a member of this group.');
    }

    return super.create(ctx);
  },

  async update(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to update group memberships.');
    }

    const targetMembershipId = ctx?.params?.id;
    const targetMembership = await strapi.db.query('api::group-member.group-member').findOne({
      where: { id: targetMembershipId },
      populate: ['group', 'group.creator', 'user'],
    });

    if (!targetMembership) {
      return ctx.notFound('Membership not found.');
    }

    const groupCreatorId = targetMembership?.group?.creator?.id ?? null;

    if (groupCreatorId !== userId) {
      return ctx.forbidden('Only the group creator can update membership records.');
    }

    const data = getRequestData(ctx);

    if (hasOwnField(data, 'user')) {
      const nextUserId = extractRelationId(data.user);
      if (nextUserId !== targetMembership?.user?.id) {
        return ctx.badRequest('Changing membership user is not allowed.');
      }
    }

    if (hasOwnField(data, 'group')) {
      const nextGroupId = extractRelationId(data.group);
      if (nextGroupId !== targetMembership?.group?.id) {
        return ctx.badRequest('Changing membership group is not allowed.');
      }
    }

    const duplicate = await strapi.db.query('api::group-member.group-member').findOne({
      where: {
        id: {
          $ne: targetMembership.id,
        },
        user: targetMembership?.user?.id,
        group: targetMembership?.group?.id,
      },
    });

    if (duplicate?.id) {
      return ctx.conflict('A duplicate membership relationship exists for this user and group.');
    }

    return super.update(ctx);
  },

  async delete(ctx) {
    const userId = getAuthenticatedUserId(ctx);

    if (!userId) {
      return ctx.unauthorized('Authentication is required to leave or manage group memberships.');
    }

    const targetMembershipId = ctx?.params?.id;
    const targetMembership = await strapi.db.query('api::group-member.group-member').findOne({
      where: { id: targetMembershipId },
      populate: ['group', 'group.creator', 'user'],
    });

    if (!targetMembership) {
      return ctx.notFound('Membership not found.');
    }

    const membershipUserId = targetMembership?.user?.id ?? null;
    const groupCreatorId = targetMembership?.group?.creator?.id ?? null;

    if (membershipUserId !== userId && groupCreatorId !== userId) {
      return ctx.forbidden('You are not allowed to delete this membership.');
    }

    return super.delete(ctx);
  },
}));
