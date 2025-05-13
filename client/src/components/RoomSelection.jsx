import React, { useState } from "react";
import { io } from "socket.io-client";


// Initialize Socket.IO client to connect to the backend server
const socket = io("http://localhost:4000");

const RoomSelection = ({ username, setRoomCode }) => {
  const [inputCode, setInputCode] = useState("");
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");

  const createRoom = () => {
    // Generate a random 5-character room code (uppercase letters/numbers)
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();

    if (!question || !option1 || !option2) {
      alert("Please enter a Poll and two Poll options.");
      return;
    }
    socket.emit("createRoom", {
      roomCode: code,
      username,
      question,
      option1,
      option2,
    });
    setRoomCode(code);
  };

  
  // Function to join an existing poll room
  const joinRoom = () => {
    socket.emit("joinRoom", { roomCode: inputCode, username });
    setRoomCode(inputCode);
  };

  return (
    <div>
      <h2>Welcome, {username}</h2>
      <h3>Create New Poll</h3>
      <input
        placeholder="Enter Poll Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <input
        placeholder="Option 1"
        value={option1}
        onChange={(e) => setOption1(e.target.value)}
      />
      <input
        placeholder="Option 2"
        value={option2}
        onChange={(e) => setOption2(e.target.value)}
      />
      <button onClick={createRoom}>Create Room</button>

      <hr />
      <h3>Join Existing Poll</h3>
      <input
        value={inputCode}
        onChange={(e) => setInputCode(e.target.value)}
        placeholder="Room Code"
      />
      <button onClick={joinRoom}>Join Room</button>
    </div>
  );
};

export default RoomSelection;
