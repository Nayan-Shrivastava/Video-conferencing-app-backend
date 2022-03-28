import express from 'express';
import {
  addMember,
  createOrganization,
  removeMember,
} from '../controllers/organization';
import { authenticate } from '../middlewares/auth';

const organizationRouter = new express.Router();

organizationRouter.post('/create', authenticate, createOrganization);
organizationRouter.post('/add-member', authenticate, addMember);
organizationRouter.put('/remove-member', authenticate, removeMember);

export { organizationRouter };
