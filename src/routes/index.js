import { Router } from 'express';
import { organizationRouter } from './organization';
import { userRouter } from './user';

export const rootRouter = new Router();
rootRouter.use('/user', userRouter);
rootRouter.use('/org', organizationRouter);
rootRouter.get('/', (_, res) => res.send('api v1'));
