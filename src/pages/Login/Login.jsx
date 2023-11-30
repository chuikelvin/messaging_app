import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuth } = useContext(AuthContext);
  useEffect(() => {
    if (isAuth) {
      navigate("/home"); // Replace '/home' with your actual home page route
    }
  }, [isAuth]);

  const handleLogin = async () => {
    if (email.trim().length > 0 && password.trim().length > 0) {
      login(email, password);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-blue-500 flex items-center justify-center">
      <div className="w-6/12 bg-white h-5/6 rounded-md flex flex-col items-center justify-center gap-6">
        <img src="/branch.svg" alt="branch_logo" width={150} />
        <h1 className="text-3xl">Login</h1>
        <input
          className="p-3 w-7/12 border border-slate-950 rounded-md"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
        />
        <input
          className="p-3 w-7/12 border border-slate-950 rounded-md"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
        <button
          onClick={handleLogin}
          className="p-3 w-7/12 border border-slate-950 rounded-md bg-slate-700 text-blue-500"
        >
          SIGN IN
        </button>
      </div>
    </div>
  );
};

export default Login;
