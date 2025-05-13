const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

const rooms = {}; // In-memory store

io.on("connection", (socket) => {
  socket.on("createRoom", ({ roomCode, username, question, option1, option2 }) => {
    if (!rooms[roomCode]) {
      rooms[roomCode] = {
        users: new Set(),
        votes: { option1: 0, option2: 0 },
        votedUsers: new Set(),
        question,
        option1,
        option2,
      };
    }
    rooms[roomCode].users.add(username);
    socket.join(roomCode);
    io.to(roomCode).emit("roomData", {
      question,
      option1,
      option2,
      votes: rooms[roomCode].votes,
    });
  });

  socket.on("joinRoom", ({ roomCode, username }) => {
    const room = rooms[roomCode];
    if (room) {
      room.users.add(username);
      socket.join(roomCode);
      io.to(socket.id).emit("roomData", {
        question: room.question,
        option1: room.option1,
        option2: room.option2,
        votes: room.votes,
      });
    }
  });

  socket.on("startTimer", ({ roomCode }) => {
    const room = rooms[roomCode];
    if (room && !room.timerStarted) {
      room.timerStarted = true;
      io.to(roomCode).emit("startTimer");
      setTimeout(() => {
        // Voting timeout handled on client
      }, 60000);
    }
  });

  socket.on("castVote", ({ roomCode, option, username }) => {
    const room = rooms[roomCode];
    if (room && !room.votedUsers.has(username)) {
      room.votes[option]++;
      room.votedUsers.add(username);
      io.to(roomCode).emit("voteUpdate", room.votes);
    }
  });
});

server.listen(4000, () => console.log("Server running on http://localhost:4000"));
