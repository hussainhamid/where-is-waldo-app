import { useEffect } from "react";
import { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { shopContext } from "../App";
import { useState } from "react";

export default function UploadImage() {
  const { token, addUser, addAdmin } = useContext(shopContext);

  const navigate = useNavigate();

  const [file, setFile] = useState(null);

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

    fetchMe();
  }, [token, addUser, addAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("uploadedImage", file);

    try {
      const res = await axios.post("http://localhost:3000/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        alert("Image uploaded successfully");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  return (
    <>
      <div>
        <form encType="multipart/form-data" onSubmit={handleSubmit}>
          <input
            type="file"
            name="uploadedImage"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button type="submit">Upload</button>
        </form>
      </div>
    </>
  );
}
