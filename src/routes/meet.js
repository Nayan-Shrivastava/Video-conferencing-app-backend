import { Router } from 'express';
import { createNewMeet, getMeetingByCode } from '../controllers/meet';
import { MeetingTypes } from '../models/meet';
import { Organization } from '../models/organization';
import { getIO } from '../socketInstance';
import { getTimeStamp } from '../utils/utils';

const meetRouter = new Router();
const io = getIO();
meetRouter.get('/create', createNewMeet);

io.on('connection', (socket) => {
  console.log('socket established');
  socket.on('join-room', async (userData) => {
    const { roomID, userID } = userData;
    const meet = await getMeetingByCode(roomID);
    if (meet.type === MeetingTypes.ORGANIZATION) {
      const org = await Organization.findById(meet.orgId);
      if (org.members.includes(userID)) {
        console.log('new user joined', userData);
        socket.join(roomID);
        socket.to(roomID).emit('new-user-connect', userData);
      } else {
        // user will send req to join the meet
      }
    } else if (meet.type === MeetingTypes.OPEN_TO_ALL) {
      console.log('new user joined', userData);
      socket.join(roomID);
      socket.to(roomID).emit('new-user-connect', userData);
    } else if (meet.type === MeetingTypes.RESTRICTED) {
      // user will send req to join the meet
    }
    socket.on('disconnect', () => {
      socket.to(roomID).emit('user-disconnected', userID);
    });
    socket.on('broadcast-message', (message) => {
      socket.to(roomID).emit('new-broadcast-messsage', {
        ...message,
        timeStamp: getTimeStamp(),
        userData,
      });
    });
    /*
     * socket.on('broadcast-message', (message) => {
     *   socket
     *     .to(roomID)
     *     .emit('new-broadcast-messsage', { ...message, userData });
     * });
     */

    /*
     * socket.on('display-media', (value) => {
     *   socket.to(roomID).broadcast.emit('display-media', { userID, value });
     * });
     */
    socket.on('video-off', (id) => {
      socket.to(roomID).emit('toggle-video', { id, status: { video: false } });
    });
    socket.on('video-on', (id) => {
      socket.to(roomID).emit('toggle-video', { id, status: { video: true } });
    });
  });
});
export { meetRouter };
