import { useContext, useEffect, useRef, useState } from "react";
import { shopContext } from "../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/homepage.css";

export default function Homepage() {
  const { token, addToken, addUser, addAdmin, admin, user } =
    useContext(shopContext);

  const [charCoords, setCharCoords] = useState([]);
  const [charNames, setCharNames] = useState([]);
  const [score, setScore] = useState(0);
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
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
          const flatChars = res.data.imgData;
          setCharCoords(flatChars);
          setCharNames(flatChars.map((char) => char.name));
        }
      } catch (err) {
        console.error("error fetching image: ", err);
      }
    };

    fetchMe();
    fetchImage();
  }, [addUser, navigate, token]);

  useEffect(() => {
    if (!Array.isArray(charCoords) || charCoords.length === 0) return;

    const anyLeft = charCoords.some(
      (arr) => Array.isArray(arr) && arr.length > 0
    );
    if (!anyLeft) setGameOver(true);
  }, [charCoords]);

  const handleClick = async (e) => {
    if (!imgRef.current) return;

    const rect = imgRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;
    const relativeY = (e.clientY - rect.top) / rect.height;
    const tolerance = 0.05;

    const currentChars = Array.isArray(charCoords[currentIndex])
      ? charCoords[currentIndex]
      : [];

    const found = currentChars.find(
      (char) =>
        Math.abs(relativeX - Number(char.x)) < tolerance &&
        Math.abs(relativeY - Number(char.y)) < tolerance
    );

    if (!found) {
      alert("Try again!");
      return;
    }

    alert(`You found ${found.name}!`);
    setScore((s) => s + 1);

    setCharCoords((prev) => {
      const copy = prev.map((arr) => (Array.isArray(arr) ? [...arr] : []));

      copy[currentIndex] = copy[currentIndex].filter(
        (c) => c.name !== found.name
      );

      if (copy[currentIndex].length > 0) {
        return copy;
      }

      const len = images.length;
      let nextid = -1;

      for (let k = 1; k <= len; k++) {
        const cand = (currentIndex + k) % len;
        if (Array.isArray(copy[cand]) && copy[cand].length > 0) {
          nextid = cand;
          break;
        }
      }

      if (nextid === -1) {
        alert(
          `Congratulations! You found all characters! Your final score is ${
            score + 1
          }`
        );
        setCurrentIndex(0);
        return copy;
      } else {
        setCurrentIndex(() => nextid);
      }

      return copy;
    });
  };

  const logOutFunc = async (e) => {
    e.preventDefault();

    localStorage.removeItem("jwtToken");
    addUser("");
    addAdmin(false);
    addToken("");
    navigate("/");
  };

  let currentChars = Array.isArray(charCoords[currentIndex])
    ? charCoords[currentIndex]
    : [];

  let nextTargetName = currentChars.length ? currentChars[0].name : "None";

  const restartFunc = async () => {
    setScore(0);
    setCurrentIndex(0);
    setGameOver(false);

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
        setCharCoords(res.data.imgData);
        setCharNames(res.data.imgData.map((char) => char.name));
      }
    } catch (err) {
      console.error("error fetching image: ", err);
    }
  };

  return (
    <>
      <div className="rootDiv">
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

        {user === "guest" ? (
          <div>
            <p>you are playing as guest</p>
          </div>
        ) : null}

        <div className="imgDiv">
          {gameOver ? (
            <button onClick={restartFunc}>Restart</button>
          ) : (
            <div className="imageContainer">
              <h2>find: {nextTargetName}</h2>
              <img
                src={images[currentIndex]}
                alt={`Waldo ${currentIndex}`}
                onClick={(e) => {
                  handleClick(e);
                }}
                ref={imgRef}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  cursor: "crosshair",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
