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
        rooms[room] = {
          [socket.id]: { admin: true, user, belt: "" },
        };
      } else {
        rooms[room][socket.id] = { user, belt: "" };
      }
      socket.join(room);
      cb();
    });

    socket.on("select-belt-colour", ({ room, colour }) => {
      console.log(socket.id, room, colour);
      rooms[room][socket.id].belt = colour;
      io.to(room).emit("room-data", rooms[room]);
    });
  });

  res.end();
}
