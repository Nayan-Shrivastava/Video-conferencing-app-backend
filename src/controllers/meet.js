import { nanoid } from 'nanoid';
import { Meet, MeetingTypes } from '../models/meet';
import { responseHandler } from '../utils/responseHandler';

export const createNewMeet = async (req, res) => {
  const { type, title } = req.body;
  let { orgId } = req.body;
  try {
    const meetingCode = nanoid(9);
    if (type !== MeetingTypes.ORGANIZATION) orgId = null;
    let meet = new Meet({
      host: req.user._id,
      meetingCode,
      orgId,
      title,
      type,
    });
    meet = await meet.save();
    console.log(meet);
    responseHandler(req, res, 200, null, meet);
  } catch (error) {
    console.log(error);
    responseHandler(req, res, 400, error);
  }
};

export const getMeetingByCode = async (meetingCode) => {
  const meet = await Meet.findOne({ meetingCode });
  if (!meet) throw Error(`Meeting by ${meetingCode} is not found`);
  return meet;
};
