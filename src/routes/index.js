import { Router } from 'express';
import { userRouter } from './user';

export const rootRouter = new Router();
rootRouter.use('/user', userRouter);
rootRouter.get('/', (_, res) => res.send('api v1'));
