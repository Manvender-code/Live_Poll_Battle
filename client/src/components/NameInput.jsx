import React, { useState } from "react";


// NameInput component collects the user's username
const NameInput = ({ setUsername }) => {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name.trim()) {
      localStorage.setItem("username", name);
      setUsername(name);
    }
  };

  return (
    <div>
      <h2>Please Enter Your Name</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default NameInput;
