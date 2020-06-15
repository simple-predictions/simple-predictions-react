const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/football',
    createProxyMiddleware({
      target: 'https://footballapi.pulselive.com',
      changeOrigin: true,
      headers: {
          Origin: 'https://www.premierleague.com'
      }
    })
  );
  app.use(
    '/game/football',
    createProxyMiddleware({
      target: 'https://footballapi.pulselive.com',
      pathRewrite: {
        '^/game/football':'/football' //remove /service/api
      },
      changeOrigin: true,
      headers: {
        Origin: 'https://www.premierleague.com'
      }
    })
  )
};