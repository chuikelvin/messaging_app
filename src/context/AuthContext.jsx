import React, { useEffect, useState } from "react";

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");

  const login = async (email, password) => {
    try {
      const response = await fetch(`http://localhost:8000/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        setToken(jsonResponse.token);
        setUser(jsonResponse.user);
        setIsAuth(true);
      }
    } catch (error) {}
  };

  const logout = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.ok);

      if (response.ok) {
        setToken("");
        setUser("");
        setIsAuth(false);
      } else {
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  return (
    <AuthContext.Provider value={{ user, token, isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
