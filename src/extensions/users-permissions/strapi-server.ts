type ControllerFactory = (context: { strapi: any }) => Record<string, any>;

const ALLOWED_SELF_UPDATE_FIELDS = new Set(['username', 'email', 'password']);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function buildSelfUpdatePayload(rawBody: unknown): Record<string, unknown> {
  const normalizedBody =
    typeof rawBody === 'string'
      ? (() => {
          try {
            return JSON.parse(rawBody);
          } catch {
            return {};
          }
        })()
      : rawBody;
  const source =
    normalizedBody && typeof normalizedBody === 'object'
      ? (normalizedBody as Record<string, unknown>)
      : {};
  const payload: Record<string, unknown> = {};

  for (const fieldName of ALLOWED_SELF_UPDATE_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(source, fieldName)) {
      continue;
    }

    const nextValue = source[fieldName];

    if (fieldName === 'username') {
      payload.username = typeof nextValue === 'string' ? nextValue.trim() : nextValue;
      continue;
    }

    if (fieldName === 'email') {
      payload.email = typeof nextValue === 'string' ? nextValue.trim().toLowerCase() : nextValue;
      continue;
    }

    payload[fieldName] = nextValue;
  }

  return payload;
}

function addUpdateMeRoute(plugin: any) {
  const contentApiFactory = plugin?.routes?.['content-api'];
  const routes = contentApiFactory?.routes;

  if (!Array.isArray(routes)) {
    return;
  }

  const hasRoute = routes.some(
    (route: any) => route?.method === 'PUT' && route?.path === '/users/me' && route?.handler === 'user.updateMe',
  );

  if (hasRoute) {
    return;
  }

  const updateMeRoute = {
    method: 'PUT',
    path: '/users/me',
    handler: 'user.updateMe',
    config: {
      prefix: '',
    },
  };

  const updateByIdRouteIndex = routes.findIndex(
    (route: any) => route?.method === 'PUT' && route?.path === '/users/:id',
  );

  if (updateByIdRouteIndex >= 0) {
    routes.splice(updateByIdRouteIndex, 0, updateMeRoute);
    return;
  }

  routes.push(updateMeRoute);
}

function addUpdateMeActionToController(userController: Record<string, any>) {
  const originalUpdate = userController?.update?.bind(userController);

  return {
    ...userController,
    async updateMe(ctx: any) {
      const authenticatedUserId = ctx?.state?.user?.id;

      if (!authenticatedUserId) {
        return ctx.unauthorized('Authentication is required to update account data.');
      }

      if (typeof originalUpdate !== 'function') {
        return ctx.internalServerError('User update controller is not available.');
      }

      const payload = buildSelfUpdatePayload(ctx?.request?.body);

      if (Object.keys(payload).length === 0) {
        return ctx.badRequest('At least one field is required: username, email or password.');
      }

      if (
        Object.prototype.hasOwnProperty.call(payload, 'username') &&
        !isNonEmptyString(payload.username)
      ) {
        return ctx.badRequest('Username is required.');
      }

      if (Object.prototype.hasOwnProperty.call(payload, 'email') && !isNonEmptyString(payload.email)) {
        return ctx.badRequest('Email is required.');
      }

      ctx.params = {
        ...(ctx.params ?? {}),
        id: authenticatedUserId,
      };

      ctx.request.body = payload;
      return originalUpdate(ctx);
    },
  };
}

function extendUserController(plugin: any) {
  const userController = plugin?.controllers?.user;

  if (typeof userController === 'function') {
    plugin.controllers.user = (context: { strapi: any }) =>
      addUpdateMeActionToController((userController as ControllerFactory)(context));
    return;
  }

  if (userController && typeof userController === 'object') {
    plugin.controllers.user = addUpdateMeActionToController(userController);
  }
}

function extendAuthController(plugin: any) {
  const authControllerFactory = plugin?.controllers?.auth;

  if (typeof authControllerFactory !== 'function') {
    return;
  }

  plugin.controllers.auth = (context: { strapi: any }) => {
    const authController = (authControllerFactory as ControllerFactory)(context);
    const originalForgotPassword = authController?.forgotPassword?.bind(authController);

    return {
      ...authController,
      async forgotPassword(ctx: any) {
        if (typeof originalForgotPassword !== 'function') {
          return ctx.internalServerError('Forgot-password controller is not available.');
        }

        try {
          return await originalForgotPassword(ctx);
        } catch (error: any) {
          const errorName = String(error?.name ?? '');
          const statusCode = Number.parseInt(String(error?.status ?? error?.statusCode ?? ''), 10);
          const isValidationError = errorName === 'ValidationError' || statusCode === 400;

          if (isValidationError) {
            throw error;
          }

          context?.strapi?.log?.warn?.(
            `[users-permissions extension] forgot-password email fallback used: ${
              error?.message ?? 'unknown error'
            }`,
          );

          return ctx.send({ ok: true });
        }
      },
    };
  };
}

export default (plugin: any) => {
  extendUserController(plugin);
  extendAuthController(plugin);
  addUpdateMeRoute(plugin);

  return plugin;
};
