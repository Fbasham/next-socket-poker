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
    socket.on("join-room", ({ room, user }) => {
      if (!(room in rooms)) {
        rooms[room] = {
          [socket.id]: { admin: true, user, belt: "" },
        };
      } else {
        rooms[room][socket.id] = { user, belt: "" };
      }
      socket.join(room);
      io.to(room).emit("room-data", rooms[room]);
    });

    socket.on("select-belt-colour", ({ room, colour }) => {
      rooms[room][socket.id].belt = colour;
      io.to(room).emit("room-data", rooms[room]);
    });

    socket.on("hide-cards", ({ room, hide }) => {
      io.to(room).emit("hide-from-server", hide);
    });

    socket.on("update-timer", ({ room, timer }) => {
      io.to(room).emit("update-timer-from-server", timer - 1);
    });
  });

  res.end();
}
