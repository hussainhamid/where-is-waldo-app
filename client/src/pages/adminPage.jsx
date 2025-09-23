import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { shopContext } from "../App";
import { useContext } from "react";
import axios from "axios";
import { useState } from "react";

export default function AdminPage() {
  const navigate = useNavigate();

  const { token, addUser, addAdmin } = useContext(shopContext);

  const [image, setImage] = useState("");

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

    const getAllImages = async () => {
      try {
        const res = await axios.get("http://localhost:3000/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setImage(res.data.imageUrl);
        }
      } catch (err) {
        console.error("error fetching images: ", err);
      }
    };

    fetchMe();
    getAllImages();
  }, [token, addUser, addAdmin, navigate]);

  async function deleteImage(imageUrl) {
    try {
      const res = await axios.delete(`http://localhost:3000/delete-image`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { imageUrl },
      });

      if (res.data.success) {
        alert("Image deleted successfully");
        setImage(image.filter((img) => img !== imageUrl));
      }
    } catch (err) {
      console.error("error deleting image: ", err);
    }
  }

  return (
    <>
      <button onClick={() => navigate("/uploads")}>Upload Image</button>

      <div>
        <h3>Uploaded Images</h3>

        {image && image.length > 0 ? (
          image.map((imgUrl, index) => (
            <div key={index}>
              <img
                src={imgUrl}
                style={{
                  width: "500px",
                  height: "500px",
                  objectFit: "contain",
                }}
              />
              <button onClick={() => deleteImage(imgUrl)}>Delete</button>
              <button
                onClick={() =>
                  navigate(`/set-coords/${encodeURIComponent(imgUrl)}`)
                }
              >
                set coords
              </button>
            </div>
          ))
        ) : (
          <p>no images uploaded</p>
        )}
      </div>
    </>
  );
}
