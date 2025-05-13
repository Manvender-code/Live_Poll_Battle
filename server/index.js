import express from "express";
import http from "http";
import { Server } from "socket.io";

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Set up Socket.IO with CORS to allow connections from the client
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

// In-memory store for room data
const rooms = {};

// Handle new socket connections
io.on("connection", (socket) => {
  // When a user creates a room
  socket.on("createRoom", ({ roomCode, username, question, option1, option2 }) => {
    // Only create the room if it doesn't already exist
    if (!rooms[roomCode]) {
      rooms[roomCode] = {
        expirationTime: Date.now() + 60000, // Set voting to expire in 60 seconds
        users: new Set([username]), // Track users, starting with the creator
        votes: { option1: 0, option2: 0 }, // Initialize vote counts
        votedUsers: new Set(), // Track who has voted
        question,
        option1,
        option2,
      };
    }
    // Add the socket to the room
    socket.join(roomCode);
    // Send room data to all users in the room
    io.to(roomCode).emit("roomData", {
      question,
      option1,
      option2,
      votes: rooms[roomCode].votes,
      expirationTime: rooms[roomCode].expirationTime,
    });
  });

  // When a user joins an existing room
  socket.on("joinRoom", ({ roomCode, username }) => {
    const room = rooms[roomCode];
    // Check if the room exists
    if (room) {
      // Add the user to the room's user set
      room.users.add(username);
      // Add the socket to the room
      socket.join(roomCode);
      // Send room data only to the joining user
      io.to(socket.id).emit("roomData", {
        question: room.question,
        option1: room.option1,
        option2: room.option2,
        votes: room.votes,
        expirationTime: room.expirationTime,
      });
    }
  });

  // When a user casts a vote
  socket.on("castVote", ({ roomCode, option, username }) => {
    const room = rooms[roomCode];
    // Allow vote if room exists, time hasn't expired, and user hasn't voted
    if (room && Date.now() < room.expirationTime && !room.votedUsers.has(username)) {
      room.votes[option]++; // Increment the vote count for the chosen option
      room.votedUsers.add(username); // Mark user as having voted
      // Update all users in the room with new vote counts
      io.to(roomCode).emit("voteUpdate", room.votes);
    } else {
      // Notify the user if voting is closed (expired or already voted)
      socket.emit("votingClosed");
    }
  });
});

// Start the server on port 4000
server.listen(4000, () => console.log("Server is running on http://localhost:4000"));