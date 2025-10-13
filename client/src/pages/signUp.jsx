import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { shopContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const { addUser, token, addToken, addAdmin } = useContext(shopContext);

  const [userData, setUserData] = useState({
    userName: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        const res = await axios.get("http://localhost:3000/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        if (res.data.success && res.data.user.status == "ADMIN") {
          addUser(res.data.user.username);
          addAdmin(true);
        } else if (res.data.user.status == "USER") {
          addUser(res.data.user.username);
          addAdmin(false);
        }
      }
    };

    fetchMe();
  }, [addUser]);

  const handleSubmit = async function (e) {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/sign-up",
        {
          userName: userData.userName,
          password: userData.password,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        localStorage.setItem("jwtToken", res.data.token);
        addUser(res.data.user.username);
        addAdmin(res.data.user.admin);
        addToken(res.data.token);
        setMessage(res.data.message);
        navigate("/homepage");
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      if (err) {
        console.log("error in signUp.jsx handleSubmit", err);
      }
    }
  };

  const handleGuest = async function (e) {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/guest", {
        withCredentials: true,
      });

      if (res.data.success) {
        localStorage.setItem("jwtToken", res.data.token);
        addUser(res.data.user.username);
        addAdmin(res.data.user.admin);
        addToken(res.data.token);
        setMessage(res.data.message);
        navigate("/homepage");
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      if (err) {
        console.log("error in signUp.jsx handleGuest", err);
      }
    }
  };

  return (
    <>
      <div>
        <form>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              className="username"
              id="username"
              value={userData.userName}
              onChange={(e) =>
                setUserData({ ...userData, userName: e.target.value })
              }
            ></input>
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <input
              className="password"
              id="password"
              type="password"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
            ></input>
          </div>

          <div>
            <button onClick={handleSubmit}>Sign Up</button>
            <button onClick={() => navigate("/")}>Log In</button>
            <button onClick={handleGuest}>Continue as Guest</button>
          </div>
        </form>
        <h2>{message}</h2>
      </div>
    </>
  );
}
