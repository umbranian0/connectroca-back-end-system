export function getAuthenticatedUserId(ctx: any): number | null {
  const rawUserId = ctx?.state?.user?.id;

  if (typeof rawUserId === 'number' && Number.isInteger(rawUserId) && rawUserId > 0) {
    return rawUserId;
  }

  const parsedUserId = Number.parseInt(String(rawUserId ?? ''), 10);
  return Number.isInteger(parsedUserId) && parsedUserId > 0 ? parsedUserId : null;
}

export function assignAuthenticatedUserRelation(ctx: any, relationField: string, userId: number) {
  const rawBody = ctx?.request?.body;
  const parsedBody =
    typeof rawBody === 'string'
      ? (() => {
          try {
            return JSON.parse(rawBody);
          } catch {
            return {};
          }
        })()
      : rawBody;
  const currentBody = parsedBody && typeof parsedBody === 'object' ? parsedBody : {};
  const bodyData =
    currentBody?.data && typeof currentBody.data === 'object'
      ? currentBody.data
      : null;
  const flattenedBodyData =
    !bodyData && currentBody && typeof currentBody === 'object'
      ? Object.fromEntries(
          Object.entries(currentBody).filter(([key, value]) => key !== 'data' && value !== undefined),
        )
      : {};
  const currentData = bodyData ?? flattenedBodyData;

  ctx.request.body = {
    ...currentBody,
    data: {
      ...currentData,
      [relationField]: userId,
    },
  };
}
