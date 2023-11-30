import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { AuthContext } from "../../context/AuthContext";

function Home() {
  const navigate = useNavigate();
  const {user, logout, token, isAuth } = useContext(AuthContext);
  const [userIds, setUserIds] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [customerId, setCustomerId] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/"); // Replace '/home' with your actual home page route
    }
    getUserIds();
  }, [isAuth]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const getUserIds = async () => {
    const res = await fetch("http://localhost:8000/api/customerIds", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (data) {
    }

    const userIds = data.message;
    setUserIds(userIds);
    fetchMessage(userIds[0]);
  };

  const fetchMessage = async (customer_id) => {
    setMessages([]);
    setCustomerId(customer_id);

    const response = await fetch(
      `http://localhost:8000/api/messages/${customer_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    ); // Update the API endpoint

    if (response.ok) {
      const jsonResponse = await response.json();

      const mergedArray = jsonResponse.message.concat(jsonResponse.responses);

      mergedArray.sort(
        (a, b) => new Date(a.timestamp_utc) - new Date(b.timestamp_utc)
      );

      setMessages(mergedArray);
    } else {
      console.error("Failed to fetch message");
    }
  };

  const handleSendMessage = async () => {
    if (message.trim().length > 0) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/message`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              customer_id: customerId,
              message: message,
              responder_id:user.id,
            }),
          }
        );

        if (response.ok) {
          fetchMessage(customerId);
          console.log("Message sent successfully");
          // Clear the input after sending the message
          setMessage("");
        } else {
          // Handle error cases
          console.error("Failed to send message");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full">
        <div
          id="sidebar"
          className="absolute top-0 left-0 h-full w-64 bg-white py-0 z-10"
        >
          <h1 className="text-xl font-bold text-center py-3 ">Welcome, {user.name}</h1>
          <h1 className="text-xl text-center flex justify-between items-center px-3 py-2 h-12">
            Messages
            <i
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              className="bx bx-dots-vertical-rounded"
            ></i>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </h1>
          <div className="flex flex-col h-full pb-24 gap- overflow-auto">
            {userIds.map((customer_id, index) => (
              <button
                className={`py-3 px-2 bo border-slate-300 flex items-center gap-2 ${
                  customerId == customer_id ? "bg-slate-300" : ""
                } hover:bg-slate-200`}
                key={index}
                onClick={() => fetchMessage(customer_id)}
              >
                <i className=" rounded-full p-3 border bx bx-user bg-blue-400 text-white"></i>
                <span>User {customer_id}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="relative top-0 left-0 ml-64 pr-64 w-full bg-slate-200 h-full flex flex-col gap-2">
          <div id="heading" className=" bg-blue-600 w-full h-12 p-2 px-6">
            <h1 className="text-white text-xl shadow-sm">
              User {customerId ?? ""}{" "}
            </h1>
          </div>
          <div className="messages overflow-y-auto w-full h-full pb-16">
            {messages.map((message, index) => {
              if (message.message) {
                return (
                  <div
                    id="received"
                    className="flex flex-col items-end w-full px-2 relative"
                    key={index}
                  >
                    <div className="flex flex-col">
                      <span
                        key={index}
                        className="border rounded-full p-3 pb-2 bg-white relative"
                      >
                        {message.message}
                      </span>
                      <span className="self-end right-4 bottom-0 text-xs pt-1 pr-2 text-slate-400">
                        {message.timestamp_utc}
                      </span>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    id="received"
                    className="flex flex-col items-start w-full px-2 relative"
                    key={index}
                  >
                    <div className="flex flex-col">
                      <span
                        key={index}
                        className="border rounded-full p-3 pb-2 bg-white relative"
                      >
                        {message.message_body}
                      </span>
                      <span className="self-end right-4 bottom-0 text-xs pt-1 pr-2 text-slate-400">
                        {message.timestamp_utc}
                      </span>
                    </div>
                  </div>
                );
              }
            })}
          </div>
          <div className="absolute px-2 py-2 pr-64 w-full h-16 bottom-0 left-0 flex gap-3 bg-slate-200">
            <input
              className="rounded-full w-full px-2 shadow-2xl"
              type="text"
              placeholder="Chat message"
              value={message}
              onChange={handleInputChange}
            />
            <button
              className="rounded-full px-8 border bg-blue-300 mr-3"
              onClick={handleSendMessage}
            >
              send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
