import express from 'express';
import mongoose from 'mongoose';
import config from './configs';
import { rootRouter } from './routes';
import { logger } from './utils/logger';

const app = express();
app.use(express.json());

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
