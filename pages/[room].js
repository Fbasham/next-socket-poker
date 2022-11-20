import io from "socket.io-client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

let socket;

export default function Room() {
  const router = useRouter();
  const room = router.query.room;
  const user = router.query.user;
  console.log(room, user);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");

    socket = io();

    socket.emit("join-room", { room, user }, () => {
      console.log(`${user} joined room #${room}`);
    });
  };

  return (
    <div>
      <h1>socket poker</h1>
    </div>
  );
}
