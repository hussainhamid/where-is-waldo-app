import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { shopContext } from "../App";
import axios from "axios";

export default function SetCoord() {
  const { token, addUser, addAdmin } = useContext(shopContext);
  const { imgUrl } = useParams();
  const [image, setImage] = useState("");

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

  return (
    <>
      <div>
        <h4>please click on waldo and review coords</h4>

        <div>
          <img
            src={image}
            alt="image"
            style={{
              width: "100%",
              height: "auto",
              cursor: "crosshair",
              objectFit: "contain",
            }}
          />
        </div>
      </div>
    </>
  );
}
