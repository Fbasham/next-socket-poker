import io from "socket.io-client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

let socket;

export default function Room() {
  const router = useRouter();
  const room = router.query.room;
  const user = router.query.user;

  const [roomData, setRoomData] = useState({});
  const [hide, setHide] = useState(true);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");

    socket = io();

    socket.emit("join-room", { room, user });

    socket.on("room-data", (roomData) => {
      setRoomData(roomData);
    });

    socket.on("hide-from-server", (hide) => {
      setHide(hide);
    });

    socket.on("timer-update-from-server", (timer) => {
      setTimer(timer);
    });
  };

  function handleCardClick(colour) {
    socket.emit("select-belt-colour", { room, colour });
  }

  function handleHideClick() {
    socket.emit("hide-cards", { room, hide: !hide });
  }

  function handleTimerClick() {
    socket.emit("timer-started", { room, timer: 30 });
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
      <div className="my-5 flex justify-between">
        {roomData[socket?.id]?.admin && (
          <button
            onClick={handleHideClick}
            className="px-2 rounded bg-blue-800 text-white hover:bg-blue-900"
          >
            Hide
          </button>
        )}
        <div className="flex gap-2 ml-auto">
          {roomData[socket?.id]?.admin && (
            <button
              onClick={handleTimerClick}
              className="px-2 rounded bg-blue-800 text-white hover:bg-blue-900"
            >
              Timer
            </button>
          )}
          <div className={`${timer < 10 ? "text-red-500" : "text-green-500"}`}>
            :{("0" + timer).slice(-2)}
          </div>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {Object.entries(roomData).map(([k, v]) => (
          <div key={k} className="flex justify-between shadow-lg h-12 rounded">
            <div
              className={`${
                socket?.id === k ? "bg-red-100" : ""
              } flex items-center px-2 rounded-tl rounded-bl`}
            >
              {v.user}
            </div>
            <div className="flex items-center px-2">
              {socket?.id !== k && hide ? "???" : v.belt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
