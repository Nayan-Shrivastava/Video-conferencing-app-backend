import express from 'express';
import config from './configs';

const app = express();
app.listen(config.port, () => {
  console.log(`app listening at ${config.port}`);
});

app.get('/', (_, res) =>
  res.send('Video Conference Web App backend.\nhealth check : passing'),
);
