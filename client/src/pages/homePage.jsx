import { useContext, useEffect, useRef, useState } from "react";
import { shopContext } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/homepage.css";

export default function Homepage() {
  const { token, addToken, addUser, addAdmin, admin } = useContext(shopContext);
  const [coords, setCoords] = useState({ x: null, y: null });
  const [charCoords, setCharCoords] = useState([{ name: "", x: "", y: "" }]);
  const [score, setScore] = useState(0);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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

    const fetchImage = async () => {
      try {
        const res = await axios.get("http://localhost:3000/get-image", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setImages(res.data.imageUrl);
          setCurrentIndex(0);
         
        }
      } catch (err) {
        console.error("error fetching image: ", err);
      }
    };

    fetchMe();
    fetchImage();

    console.log(charCoords);
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
      <nav className="navBar">
        <div className="scoreDiv">
          <h3>score: {score}</h3>
        </div>

        {admin ? (
          <button onClick={() => navigate("/admin")} className="btns">
            Admin Page
          </button>
        ) : null}
        <button onClick={logOutFunc} className="btns">
          Logout
        </button>
      </nav>

      <div className="imgDiv">
        <img
          src={images[currentIndex]}
          alt={`Waldo ${currentIndex}`}
          style={{
            width: "80%",
            height: "auto",
            objectFit: "cover",
            cursor: "crosshair",
          }}
        />

        {charCoords.map((char, index) => (
          <div key={index}>
            <p>
              {char.name}: ({char.x}, {char.y})
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
