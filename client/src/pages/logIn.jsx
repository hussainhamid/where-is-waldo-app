import { useContext, useEffect, useState } from "react";
import { shopContext } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function LoginFunc() {
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
          navigate("/homepage");
        } else if (res.data.user.status == "USER") {
          addUser(res.data.user.username);
          addAdmin(false);
          navigate("/homepage");
        }
      }
    };

    fetchMe();
  }, [addUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/log-in",
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
      console.error("error in handleSubmit in login.jsx", err);
    }
  };

  return (
    <>
      <div className="bodyDiv">
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
                Log In
              </button>
            </div>
          </form>
        </div>
        <p>
          Don't have an account?{" "}
          <a onClick={() => navigate("/sign-up")} className="navigate-link">
            Create one
          </a>
        </p>

        <p>{message}</p>
      </div>
    </>
  );
}
