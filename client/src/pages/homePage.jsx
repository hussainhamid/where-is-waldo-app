import { useContext, useEffect, useRef, useState } from "react";
import { shopContext } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const { token, addToken, user, addUser, addAdmin, admin } =
    useContext(shopContext);
  const [coords, setCoords] = useState({ x: null, y: null });
  const imgRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        const res = await axios.get("http://localhost:3000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success && res.data.user.status == "ADMIN") {
          addUser(res.data.user.username);
          addAdmin(true);
        } else if (res.data.user.status == "USER") {
          addUser(res.data.user.username);
          addAdmin(false);
        }
      } else {
        navigate("/");
      }
    };

    fetchMe();
  }, [addUser, navigate, token]);

  const handleClick = async (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tolerance = 0.05;

    const waldoX = 0.35;
    const waldoY = 0.49;

    const relativeX = x / rect.width;
    const relativeY = y / rect.height;
    setCoords({ x: relativeX, y: relativeY });

    if (
      Math.abs(relativeX - waldoX) < tolerance &&
      Math.abs(relativeY - waldoY) < tolerance
    ) {
      alert("You found Waldo!");
    } else {
      alert("Try again!");
    }
  };

  const logOutFunc = async (e) => {
    e.preventDefault();

    localStorage.removeItem("jwtToken");
    addUser("");
    addAdmin(false);
    addToken("");
    navigate("/");
  };

  return (
    <>
      <h1>{user}</h1>

      {admin ? (
        <button onClick={() => navigate("/admin")}>Admin Page</button>
      ) : null}
      <button onClick={logOutFunc}>Logout</button>
      <img
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        onClick={handleClick}
        ref={imgRef}
        src="img/where_is_waldo_img.jpeg"
        alt="where is waldo img"
      ></img>

      <p>
        Last click coordinates: X: {coords.x?.toFixed(2)}, Y:
        {coords.y?.toFixed(2)}
      </p>
    </>
  );
}
