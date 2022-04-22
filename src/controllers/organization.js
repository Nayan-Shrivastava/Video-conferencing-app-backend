/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
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
    members.forEach(async (memberEmail) => {
      const user = await User.findOne({ memberEmail });
      await user.organizations.push(organization.id);
      await user.save();
    });
    responseHandler(req, res, 200, null, organization);
  } catch (e) {
    responseHandler(req, res, 400, e);
  }
};

export const fetchUserOrganization = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      model: 'Organization',
      path: 'organizations',
      populate: {
        model: 'User',
        path: 'members',
      },
    });
    const result = user.organizations;

    responseHandler(req, res, 200, null, result);
  } catch (e) {
    responseHandler(req, res, 400, e);
  }
};

export const fetchOrganizationWithUsers = async (req, res) => {
  try {
    const { orgId } = req.body;
    const org = await Organization.findById(orgId).populate('members');
    responseHandler(req, res, 200, null, org);
  } catch (e) {
    responseHandler(req, res, 400, e);
  }
};

export const deleteOrganization = async (req, res) => {
  try {
    const { orgId } = req.body;
    const org = await Organization.findById(orgId);
    if (org.admin.toString() !== req.user._id.toString()) {
      responseHandler(req, res, 403, null);
    } else {
      org.members.forEach(async (userId) => {
        const user = await User.findById(userId);
        user.organizations = user.organizations.filter((org) => org !== orgId);
        await user.save();
      });
      await Organization.findByIdAndDelete(org._id);
      responseHandler(req, res, 200, null);
    }
  } catch (e) {
    responseHandler(req, res, 400, e);
  }
};

export const addMember = async (req, res) => {
  try {
    const { email, orgId } = req.body;
    const org = await Organization.findById(orgId);
    const memberToBe = await User.findOne({ email });
    if (!memberToBe) {
      return await responseHandler(req, res, 200, 'user not found');
    }
    if (org.admin.toString() !== req.user._id.toString()) {
      return await responseHandler(req, res, 403, null);
    }
    if (org.members.includes(memberToBe._id)) {
      return await responseHandler(req, res, 400, null, 'Already a member');
    }
    const user = await User.findById(memberToBe._id);
    org.members.push(memberToBe._id);
    user.organizations.push(org._id);
    await user.save();
    await org.save();
    return await responseHandler(req, res, 200, null, { success: true, user });
  } catch (e) {
    responseHandler(req, res, 400, e);
  }
};

export const removeMember = async (req, res) => {
  try {
    const { userId, orgId } = req.body;
    const org = await Organization.findById(orgId);
    if (org.admin.toString() !== req.user._id.toString()) {
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
