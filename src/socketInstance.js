import sio from 'socket.io';

let io = null;

export const getIO = () => io;

export const initializeSocket = (server) => {
  io = sio(server, {
    cors: {
      origin: '*',
    },
  });
  return io;
};
