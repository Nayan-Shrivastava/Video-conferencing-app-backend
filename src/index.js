import express from 'express';
import mongoose from 'mongoose';
import config from './configs';
import { rootRouter } from './routes';
import { logger } from './utils/logger';

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  const { origin } = req.headers;
  /*
   * res.setHeader('Access-Control-Allow-Origin', origin);
   * res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
   * res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
   * res.header('Access-Control-Allow-Credentials', true);
   */
  next();
});

mongoose.connect(config.mongoDBUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(config.port, () => {
  logger.log('info', `Server is Listening on port ${config.port}`);
});

app.get('/', (_, res) =>
  res.send('Video Conference Web App backend.\nhealth check : passing'),
);

app.use('/api/v1', rootRouter);

logger.log('info', '**** server started ****');

function split(thing) {
  if (typeof thing === 'string') {
    return thing.split('/');
  }
  if (thing.fast_slash) {
    return '';
  }
  const match = thing
    .toString()
    .replace('\\/?', '')
    .replace('(?=\\/|$)', '$')
    .match(/^\/\^((?:\\[.*+?^${}()|[\]\\/]|[^.*+?^${}()|[\]\\/])*)\$\//u);
  return match
    ? match[1].replace(/\\(.)/gu, '$1').split('/')
    : `<complex:${thing.toString()}>`;
}

function printRoutes(path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(
      printRoutes.bind(null, path.concat(split(layer.route.path))),
    );
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(
      printRoutes.bind(null, path.concat(split(layer.regexp))),
    );
  } else if (layer.method) {
    // eslint-disable-next-line no-console
    console.log(
      '%s /%s',
      layer.method.toUpperCase().padEnd(10),
      path.concat(split(layer.regexp)).filter(Boolean).join('/'),
    );
  }
}
app._router.stack.forEach(printRoutes.bind(null, []));
