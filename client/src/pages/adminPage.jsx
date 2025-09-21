import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const navigate = useNavigate();

  return (
    <h1>
      <button onClick={() => navigate("/uploads")}>Upload Image</button>
    </h1>
  );
}
