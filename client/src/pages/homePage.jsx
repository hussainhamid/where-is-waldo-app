import { useContext, useEffect, useRef, useState } from "react";
import { shopContext } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/homepage.css";

export default function Homepage() {
  const { token, addToken, addUser, addAdmin, admin } = useContext(shopContext);
  const [coords, setCoords] = useState();
  const [charCoords, setCharCoords] = useState([]);
  const [score, setScore] = useState(0);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const imgRef = useRef(null);

  const userHighScore = localStorage.getItem("highScore") || 0;

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
          const flatChars = res.data.imgData.flat();
          setCharCoords(flatChars);
        }
      } catch (err) {
        console.error("error fetching image: ", err);
      }
    };

    fetchMe();
    fetchImage();
  }, [addUser, navigate, token]);

  const handleClick = async (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tolerance = 0.05;

    const relativeX = x / rect.width;
    const relativeY = y / rect.height;
    setCoords({ x: relativeX, y: relativeY });

    const found = charCoords.find(
      (char) =>
        Math.abs(relativeX - char.x) < tolerance &&
        Math.abs(relativeY - char.y) < tolerance
    );

    if (found) {
      alert(`You found ${found.name}!`);
      setScore(score + 1);
      localStorage.setItem("highScore", Math.max(score + 1, userHighScore));
      setCurrentIndex((currentIndex + 1) % images.length);
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
        <div>
          <h3>high score: {userHighScore}</h3>
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
          onClick={(e) => {
            handleClick(e);
          }}
          ref={imgRef}
          style={{
            width: "80%",
            height: "auto",
            objectFit: "cover",
            cursor: "crosshair",
          }}
        />
      </div>
    </>
  );
}
