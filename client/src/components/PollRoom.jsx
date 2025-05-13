import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

const PollRoom = ({ username, roomCode }) => {
  
  // State for poll data (question, options, etc.)
  // State for vote counts for each option
  // State to track if the user has voted, initialized from localStorage
  // State for the remaining time in seconds
  // State to track if the voting period has expired

  const [questionData, setQuestionData] = useState(null); 
  const [votes, setVotes] = useState({ option1: 0, option2: 0 });
  const [voted, setVoted] = useState(localStorage.getItem(`voted-${roomCode}`));
  const [timer, setTimer] = useState(60);
  const [expired, setExpired] = useState(false);

  // Effect to handle socket events (joining room, receiving data, updates)
  useEffect(() => {
    socket.emit("joinRoom", { roomCode, username });

    socket.on("roomData", (data) => {
      setQuestionData(data);
      setVotes(data.votes);
      const now = Date.now();
      const expiration = data.expirationTime;
      if (now >= expiration) {
        setExpired(true);
        setTimer(0);
      } else {
        const remaining = Math.ceil((expiration - now) / 1000);
        setTimer(remaining);
      }
    });

    socket.on("voteUpdate", (data) => {
      setVotes(data);
    });

    socket.on("votingClosed", () => {
      setExpired(true);
      setTimer(0);
    });

    return () => {
      socket.off("roomData");
      socket.off("voteUpdate");
      socket.off("votingClosed");
    };
  }, [roomCode, username]);

  // Effect to manage the countdown timer based on questionData
  useEffect(() => {
    if (!questionData || !questionData.expirationTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const expiration = questionData.expirationTime;
      if (now >= expiration) {
        setExpired(true);
        setTimer(0);
        clearInterval(interval);
      } else {
        const remaining = Math.ceil((expiration - now) / 1000);
        setTimer(remaining);
      }
    }, 1000);

   
    return () => {
      clearInterval(interval);
    };
  }, [questionData]);

  // Effect to show a popup when the voting period expires
  useEffect(() => {
    if (expired) {
      alert("Time is expired....");
    }
  }, [expired]);

  const vote = (option) => {
    if (voted) {
      alert("You already voted for this room...");
      return;
    }
    if (expired) {
      alert("Time has expired for this room...");
      return;
    }
    socket.emit("castVote", { roomCode, option, username });
    localStorage.setItem(`voted-${roomCode}`, "true");
    setVoted(true);
  };

  return (
    <div>
      <h2>Room: {roomCode}</h2>
      <p>Time Left: {timer}s</p>
      {questionData ? (
        <>
          <h3>{questionData.question}</h3>
          
          <button onClick={() => vote("option1")} disabled={expired}>
            {questionData.option1} ({votes.option1})
          </button>
          
          <button onClick={() => vote("option2")} disabled={expired}>
            {questionData.option2} ({votes.option2})
          </button>
        </>
      ) : (
        <p>Loading poll...</p> 
      )}
    
      {expired && <p>Time has expired for this room !!!</p>}
    </div>
  );
};


export default PollRoom;