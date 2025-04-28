// src/Register.jsx
import React, { useState } from "react";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });
      if (res.ok) {
        alert("🎉 Registered Successfully!");
        setEmail("");
        setPassword("");
        setUsername("");
      } else {
        alert("❌ Registration Failed!");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error during registration");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-blue-500">
          Create Account ✨
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-3 rounded-lg"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg"
        >
          Register 🚀
        </button>
      </form>
    </div>
  );
}

export default Register;
