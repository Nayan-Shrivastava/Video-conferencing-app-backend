import { Router } from 'express';
import { createNewMeet } from '../controllers/meet';
import { getIO } from '../socketInstance';

const meetRouter = new Router();
const io = getIO();
meetRouter.get('/create', createNewMeet);

io.on('connection', (socket) => {
  console.log('socket established');
  socket.on('join-room', (userData) => {
    const { roomID, userID } = userData;
    socket.join(roomID);
    socket.to(roomID).broadcast?.emit('new-user-connect', userData);
    socket.on('disconnect', () => {
      socket.to(roomID).broadcast?.emit('user-disconnected', userID);
    });
    socket.on('broadcast-message', (message) => {
      socket
        .to(roomID)
        .broadcast.emit('new-broadcast-messsage', { ...message, userData });
    });
    /*
     * socket.on('reconnect-user', () => {
     *     socket.to(roomID).broadcast.emit('new-user-connect', userData);
     * });
     */
    socket.on('display-media', (value) => {
      socket.to(roomID).broadcast.emit('display-media', { userID, value });
    });
    socket.on('user-video-off', (value) => {
      socket.to(roomID).broadcast.emit('user-video-off', value);
    });
  });
});
export { meetRouter };
