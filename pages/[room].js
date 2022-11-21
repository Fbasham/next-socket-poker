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

  function handleCardClick(colour) {
    socket.emit("select-belt-colour", colour);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl text-blue-800 mb-5">Socket Poker Room #{room}</h1>
      <div className="flex justify-between">
        <button
          onClick={() => handleCardClick("white")}
          className="w-24 h-24 border-2 rounded shadow-lg"
        >
          White
        </button>
        <button
          onClick={() => handleCardClick("yellow")}
          className="w-24 h-24 border-2 rounded shadow-lg"
        >
          Yellow
        </button>
        <button
          onClick={() => handleCardClick("green")}
          className="w-24 h-24 border-2 rounded shadow-lg"
        >
          Green
        </button>
        <button
          onClick={() => handleCardClick("black")}
          className="w-24 h-24 border-2 rounded shadow-lg"
        >
          Black
        </button>
      </div>
      <div></div>
    </div>
  );
}
