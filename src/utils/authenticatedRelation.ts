export function getAuthenticatedUserId(ctx: any): number | null {
  const rawUserId = ctx?.state?.user?.id;

  if (typeof rawUserId === 'number' && Number.isInteger(rawUserId) && rawUserId > 0) {
    return rawUserId;
  }

  const parsedUserId = Number.parseInt(String(rawUserId ?? ''), 10);
  return Number.isInteger(parsedUserId) && parsedUserId > 0 ? parsedUserId : null;
}

export function assignAuthenticatedUserRelation(ctx: any, relationField: string, userId: number) {
  const currentBody = ctx?.request?.body ?? {};
  const currentData = currentBody?.data && typeof currentBody.data === 'object' ? currentBody.data : {};

  ctx.request.body = {
    ...currentBody,
    data: {
      ...currentData,
      [relationField]: userId,
    },
  };
}
