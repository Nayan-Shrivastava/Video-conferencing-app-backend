import { Router } from 'express';
import { organizationRouter } from './organization';
import { userRouter } from './user';
import { meetRouter } from './meet';

export const rootRouter = new Router();
rootRouter.use('/user', userRouter);
rootRouter.use('/org', organizationRouter);
rootRouter.use('/meet', meetRouter);
rootRouter.get('/', (_, res) => res.send('api v1'));
