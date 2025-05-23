# **Live_Poll_Battle Assignment (LLUMO AI)**

🔗 **Project Link**: [https://github.com/Manvender-code/Live_Poll_Battle]

---

## **Features**

- **User Authentication**: Unique username stored in `localStorage` for session persistence.  
- **Poll Creation**: Create a poll with a question and two options. A unique 5-character room code is generated.  
- **Poll Joining**: Join a poll using a room code.  
- **Real-Time Voting**: Votes update instantly for all participants.  
- **60-Second Timer**: 
  - For creators: countdown from 60s.  
  - For joiners: adjusted based on join time (e.g., 31s).  
- **Expiration Popup**: Alert when voting ends.  
- **Vote Validation**: Prevents duplicate or late votes, with feedback messages.  
- **Responsive UI**: Clean interface for voting and navigation.  
- **Error Handling**: Client-side alerts and server-side validations.

---

## **Technologies**

### **Backend**
- **Node.js** (v14+ recommended)  
- **Express** – Web framework  
- **Socket.IO** – Real-time communication  
- **ES Modules** – Modern `import/export` usage  

### **Frontend**
- **React** (v18+)  
- **Socket.IO-Client** – Connects to backend  
- **ReactDOM** – Renders app  
- **localStorage** – Stores user/vote data  
- **ESLint** – Code quality (`react-hooks/exhaustive-deps`)

### **Development Tools**
- **npm** – Dependency management  
- **ES Modules** – Unified syntax across backend & frontend

---

## **Backend Overview**

- **Express Server**: Runs on `http://localhost:4000`  
- **Socket.IO**: Manages room creation, user joins, and vote handling  
- **In-Memory Store**: `rooms` object stores questions, options, votes, and expiration data

### **Key Features**
- 60-second expiration per poll  
- Vote validation (time-bound and unique)  
- Broadcast updates in real-time  
- **ES Module support** via `"type": "module"`

---

## **Frontend Overview**

- Built as a **Single Page App (SPA)**  
- Conditional rendering based on user and room states

### **Key Components**
- `App.jsx`: Manages navigation  
- `NameInput.jsx`: Username input and persistence  
- `RoomSelection.jsx`: Create or join polls  
- `PollRoom.jsx`: Displays poll UI, vote count, and timer  
- `index.jsx`: Entry point  

### **Features**
- Real-time timer (60s for creator, adjusted for joiners)  
- Live socket integration  
- ESLint-compliant hooks  
- Alerts for user feedback

---

## ** Working Flow**

### **➡️ User Flow**
1. **Enter Username** → Saved in `localStorage`
2. **Create or Join Poll**  
   - Create: Generates random room code (e.g., `X7B2P`)  
   - Join: Enter existing code  
3. **Vote in Poll**  
   - Timer counts down  
   - One vote per room  
4. **Voting Expiration**  
   - Popup shown  
   - Buttons disabled  
5. **Feedback**  
   - Alerts for duplicate or expired votes

---

### **➡️ Technical Flow**

#### **Backend**
- `createRoom`: Stores room with expirationTime  
- `joinRoom`: Sends room data  
- `castVote`: Validates and updates vote  
- Invalid votes trigger `votingClosed` event

#### **Frontend**
- `App.jsx`: Handles route logic  
- `NameInput.jsx`: Saves username  
- `RoomSelection.jsx`: Emits room events  
- `PollRoom.jsx`:  
  - Joins via `joinRoom`  
  - Listens for: `roomData`, `voteUpdate`, `votingClosed`  
  - Timer updates every second  
  - Voting disabled on expiration  
  - Alerts for errors or repeat votes

---

## **📡 API & Socket Events**

### **Backend Socket Events**
- `createRoom`  
  - Input: `{ roomCode, username, question, option1, option2 }`  
  - Action: Creates poll, emits `roomData`  

- `joinRoom`  
  - Input: `{ roomCode, username }`  
  - Action: Joins room, sends `roomData`  

- `castVote`  
  - Input: `{ roomCode, option, username }`  
  - Action: Validates and emits `voteUpdate`  

#### **Emitted Events**
- `roomData`: Poll info  
- `voteUpdate`: Updated vote counts  
- `votingClosed`: Notifies when time expires

---

### **Frontend Socket Usage**
- Connects to `http://localhost:4000`  
- Emits: `joinRoom`, `createRoom`, `castVote`  
- Listens to: `roomData`, `voteUpdate`, `votingClosed`

---

## **Contact**

- 📧 **Email**: [manvender.meena.mat21@itbhu.ac.in]
- 💻 **GitHub**: [https://github.com/Manvender-code]
- 🔗 **LinkedIn**: [https://www.linkedin.com/in/manvender-meena-24548b277]
