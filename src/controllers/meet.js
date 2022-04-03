import { responseHandler } from '../utils/responseHandler';

export const createNewMeet = (req, res) => {
  try {
    const message = { meetCode: Date.now().toString(36) };
    responseHandler(req, res, 200, null, message);
  } catch (error) {
    responseHandler(req, res, 400);
  }
};
