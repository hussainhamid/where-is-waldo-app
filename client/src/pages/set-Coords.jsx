import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { shopContext } from "../App";
import axios from "axios";

export default function SetCoord() {
  const { token, addUser, addAdmin } = useContext(shopContext);
  const { imgUrl } = useParams();
  const [image, setImage] = useState("");
  const imgRef = useRef();
  const [coords, setCoords] = useState({ x: null, y: null, charName: "" });

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
          navigate("/homepage");
        }
      } else {
        navigate("/");
      }
    };

    const storeImg = async () => {
      if (imgUrl) {
        setImage(decodeURIComponent(imgUrl));
      }
    };
    fetchMe();
    storeImg();
  }, [token, addUser, addAdmin, navigate, setImage, imgUrl]);

  const handleClick = async (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const relativeX = x / rect.width;
    const relativeY = y / rect.height;

    setCoords({ x: relativeX, y: relativeY });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      coords.x === undefined ||
      coords.y === undefined ||
      coords.charName === undefined
    ) {
      alert("please click on image and enter character name");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/set-coords", {
        imgUrl: image,
        x: coords.x?.toFixed(2),
        y: coords.y?.toFixed(2),
        charName: coords.charName,
      });

      if (res.data.success) {
        alert("coords set successfully");
      } else {
        alert("failed to set coords, try again");
      }
    } catch (err) {
      console.error("error in setCoords handleSubmit", err);
      alert("error setting coords, try again");
    }
  };

  return (
    <>
      <div>
        <h4>please click on waldo and review coords</h4>

        <div>
          <img
            onClick={(e) => handleClick(e)}
            src={image}
            ref={imgRef}
            alt="image"
            style={{
              width: "100%",
              height: "auto",
              cursor: "crosshair",
              objectFit: "contain",
            }}
          />
        </div>
        <label htmlFor="char-name">Character Name:</label>
        <input
          className="char-name"
          type="text"
          value={coords.charName}
          onChange={(e) => setCoords({ ...coords, charName: e.target.value })}
        />
        <div>
          <button
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Submit
          </button>
          <button onClick={() => navigate(-1)}>Go back</button>
        </div>

        <h2>
          coords: {coords.x?.toFixed(2)}, Y:
          {coords.y?.toFixed(2)}
        </h2>
      </div>
    </>
  );
}
