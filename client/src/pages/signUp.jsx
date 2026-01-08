import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { shopContext } from "../App";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

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
      <h2 className="heading">Where Is Waldo?</h2>
      <div className="logInDiv">
        <form className="logInForm">
          <div className="divGroup">
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

          <div className="divGroup">
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

          <div className="btnDiv">
            <button onClick={handleSubmit} className="btn">
              Sign Up
            </button>
          </div>
        </form>
      </div>

      <p>
        Already have an account?{" "}
        <a onClick={() => navigate("/")} className="navigate-link">
          Log In{" "}
        </a>
      </p>
      <p>
        Continue as{" "}
        <a onClick={handleGuest} className="navigate-link">
          Guest
        </a>
      </p>

      <p>{message}</p>
    </>
  );
}
