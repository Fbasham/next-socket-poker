import { Server } from "socket.io";

let rooms = {};

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    socket.on("join-room", ({ room, user }, cb) => {
      if (!(room in rooms)) {
        rooms[room] = { admin: socket.id, users: { [socket.id]: user } };
      } else {
        rooms[room].users[socket.id] = user;
      }
      console.log(rooms);
      socket.join(room);
      cb();
    });

    socket.on("select-belt-colour", (colour) => {
      console.log(socket.id, colour);
    });
  });

  res.end();
}
