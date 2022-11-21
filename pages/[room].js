import io from "socket.io-client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

let socket;

export default function Room() {
  const router = useRouter();
  const room = router.query.room;
  const user = router.query.user;

  const [roomData, setRoomData] = useState({});

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");

    socket = io();

    socket.emit("join-room", { room, user }, () => {
      console.log(`${user} joined room #${room}`);
    });

    socket.on("room-data", (roomData) => {
      console.log(roomData);
      setRoomData(roomData);
    });
  };

  function handleCardClick(colour) {
    socket.emit("select-belt-colour", { room, colour });
  }

  return (
    <div className="max-w-2xl mx-auto p-10">
      <h1 className="text-2xl text-blue-800 mb-10">
        Socket Poker Room #{room}
      </h1>
      <div className="flex justify-between">
        <button
          onClick={() => handleCardClick("white")}
          className="w-24 h-24 border-2 rounded shadow-lg hover:scale-105 duration-200"
        >
          White
        </button>
        <button
          onClick={() => handleCardClick("yellow")}
          className="w-24 h-24 border-2 rounded shadow-lg hover:scale-105 duration-200"
        >
          Yellow
        </button>
        <button
          onClick={() => handleCardClick("green")}
          className="w-24 h-24 border-2 rounded shadow-lg hover:scale-105 duration-200"
        >
          Green
        </button>
        <button
          onClick={() => handleCardClick("black")}
          className="w-24 h-24 border-2 rounded shadow-lg hover:scale-105 duration-200"
        >
          Black
        </button>
      </div>
      <div className="mt-5 space-y-3">
        {Object.entries(roomData).map(([k, v]) => (
          <div className="flex justify-between">
            <div key={k} className={`${socket.id === k ? "bg-red-100" : ""}`}>
              {v.user}
            </div>
            <div>{v.belt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
