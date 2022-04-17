import { Organization } from '../models/organization';
import { responseHandler } from '../utils/responseHandler';
import { User } from '../models/user';

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
    req.user.organizations.push(organization.id);
    await req.user.save();
    for (let i = 0; i < members.length; i += 1) {
      const userId = members[i];
      const user = await User.findById(userId);
      user.organizations.push(organization.id);
      user.save();
    }
    responseHandler(req, res, 200, null, organization);
  } catch (e) {
    responseHandler(req, res, 400, e);
  }
};

export const fetchUserOrganization = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('organizations');
    const result = user.organizations;
    responseHandler(req, res, 200, null, result);
  } catch (e) {
    responseHandler(req, res, 400, e);
  }
};

export const deleteOrganization = async (req, res) => {
  try {
    const { orgId } = req.body;
    const org = await Organization.findById(orgId);
    if (org.admin != req.user.id) {
      responseHandler(req, res, 403, null);
    } else {
      for (let i = 0; i < org.members.length; i += 1) {
        const userId = org.members[i];
        const user = await User.findById(userId);
        user.organizations = user.organizations.filter((org) => org != orgId);
        await user.save();
      }
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
    if (org.admin != req.user.id) {
      responseHandler(req, res, 403, null);
    } else if (org.members.includes(userId)) {
      responseHandler(req, res, 400, null, 'Already a member');
    } else {
      const user = await User.findById(userId);
      org.members.push(userId);
      user.organizations.push(org.id);
      await user.save();
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
    if (org.admin != req.user.id) {
      responseHandler(req, res, 403, null);
    } else if (!org.members.includes(userId)) {
      responseHandler(req, res, 404, null, 'Not a member');
    } else {
      const user = await User.findById(userId);
      user.organizations = user.organizations.filter((org) => org != orgId);
      org.members = org.members.filter((member) => member != userId);
      await user.save();
      await org.save();
      responseHandler(req, res, 200, null, null);
    }
  } catch (e) {
    responseHandler(req, res, 400, e);
  }
};
