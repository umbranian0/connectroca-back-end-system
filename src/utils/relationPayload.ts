type GenericData = Record<string, any>;

export function getRequestData(ctx: any): GenericData {
  const rawBody = ctx?.request?.body;
  const requestBody =
    typeof rawBody === 'string'
      ? (() => {
          try {
            return JSON.parse(rawBody);
          } catch {
            return null;
          }
        })()
      : rawBody;
  const bodyData = requestBody?.data;

  if (bodyData && typeof bodyData === 'object') {
    const nestedAttributes = (bodyData as GenericData)?.attributes;
    return nestedAttributes && typeof nestedAttributes === 'object'
      ? (nestedAttributes as GenericData)
      : (bodyData as GenericData);
  }

  if (requestBody && typeof requestBody === 'object') {
    const directAttributes = (requestBody as GenericData)?.attributes;
    if (directAttributes && typeof directAttributes === 'object') {
      return directAttributes as GenericData;
    }

    return requestBody as GenericData;
  }

  return {};
}

export function hasOwnField(data: GenericData, field: string): boolean {
  return Object.prototype.hasOwnProperty.call(data, field);
}

export function extractRelationId(value: any): string | number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? extractRelationId(value[0]) : null;
  }

  if (typeof value !== 'object') {
    return null;
  }

  if (hasOwnField(value, 'id')) {
    return extractRelationId(value.id);
  }

  if (hasOwnField(value, 'documentId')) {
    return extractRelationId(value.documentId);
  }

  if (hasOwnField(value, 'connect')) {
    return extractRelationId(value.connect);
  }

  if (hasOwnField(value, 'set')) {
    return extractRelationId(value.set);
  }

  if (hasOwnField(value, 'disconnect')) {
    return null;
  }

  return null;
}

export function countSelectedRelations(relationIds: Array<string | number | null>): number {
  return relationIds.filter((relationId) => relationId !== null && relationId !== undefined).length;
}
