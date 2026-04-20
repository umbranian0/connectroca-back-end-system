const healthController = {
  async index(ctx) {
    ctx.body = {
      data: {
        status: 'ok',
        service: 'connecttroca-api',
        timestamp: new Date().toISOString(),
      },
      meta: {},
    };
  },
};

export default healthController;