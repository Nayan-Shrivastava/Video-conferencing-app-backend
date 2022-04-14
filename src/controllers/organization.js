import { Organization } from '../models/organization';
import { responseHandler } from '../utils/responseHandler';

/**
 * POST `/api/v1/user/login`
 * @example
 * body: {
 *    email: 'abc@xyz.com',
 *    password: 'pqrs'
 * }
 */

export const createOrganization = async (req, res) => {
  try {
    const { name, members } = req.body;
    const admin = req.user.id;
    const organization = new Organization({ admin, members, name });
    await organization.save();
    responseHandler(req, res, 200, null, null);
  } catch (e) {
    responseHandler(req, res, 400, e);
  }
};

export const deleteOrganization = async (req, res) => {
  try {
    const { orgId } = req.body;
    const org = await Organization.findById(orgId);
    if (org.admin !== req.user.id) {
      responseHandler(req, res, 403, null);
    } else {
      org.remove();
      responseHandler(req, res, 200, null);
    }
  } catch (e) {
    responseHandler(req, res, 400, e);
  }
};

export const addMember = async (req, res) => {
  try {
    const { userId, orgId } = req.body;
    const org = await Organization.findById(orgId);
    if (org.admin !== req.user.id) {
      responseHandler(req, res, 403, null);
    } else if (org.members.includes(userId)) {
      responseHandler(req, res, 400, null, 'Already a member');
    } else {
      org.members.push(userId);
      await org.save();
      responseHandler(req, res, 200, null, null);
    }
  } catch (e) {
    responseHandler(req, res, 400, e);
  }
};

export const removeMember = async (req, res) => {
  try {
    const { userId, orgId } = req.body;
    const org = await Organization.findById(orgId);
    if (org.admin !== req.user.id) {
      responseHandler(req, res, 403, null);
    } else if (!org.members.includes(userId)) {
      responseHandler(req, res, 404, null, 'Not a member');
    } else {
      org.members = org.members.filter((member) => member !== userId);
      await org.save();
      responseHandler(req, res, 200, null, null);
    }
  } catch (e) {
    responseHandler(req, res, 400, e);
  }
};
