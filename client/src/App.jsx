import React, { useState } from "react";
import NameInput from "./components/NameInput";
import RoomSelection from "./components/RoomSelection";
import PollRoom from "./components/PollRoom";

const App = () => {
  // State to store the user's username, initialized from localStorage
  const [username, setUsername] = useState(localStorage.getItem("username"));
  
  // State to store the current room code for poll participation
  const [roomCode, setRoomCode] = useState("");

  if (!username) return <NameInput setUsername={setUsername} />;
  if (!roomCode) return <RoomSelection setRoomCode={setRoomCode} username={username} />;
  return <PollRoom username={username} roomCode={roomCode} />;
};

export default App;
