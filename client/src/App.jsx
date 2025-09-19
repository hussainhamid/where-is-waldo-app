import React, { createContext, useState } from "react";
import "./App.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import SignUp from "./pages/signUp.jsx";
import LoginFunc from "./pages/logIn.jsx";
import Homepage from "./pages/homePage.jsx";
import AdminPage from "./pages/adminPage.jsx";

export const shopContext = createContext({
  user: "",
  addUser: () => {},
  token: "",
  addToken: () => {},
  admin: false,
  addAdmin: () => {},
});

function Layout() {
  return (
    <main>
      <Outlet />
    </main>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <LoginFunc /> },
      { path: "/sign-up", element: <SignUp /> },
      { path: "/homepage", element: <Homepage /> },
      { path: "/admin", element: <AdminPage /> },
    ],
  },
]);

function App() {
  const [user, setUser] = useState("");
  const [token, setToken] = useState(
    () => localStorage.getItem("jwtToken") || ""
  );
  const [admin, setAdmin] = useState(false);

  const addUser = (username) => {
    setUser(username);
  };

  const addToken = (bearerToken) => {
    setToken(bearerToken);
  };

  const addAdmin = (isAdmin) => {
    setAdmin(isAdmin);
  };

  return (
    <shopContext.Provider
      value={{ user, addUser, token, addToken, admin, addAdmin }}
    >
      <RouterProvider router={router} />
    </shopContext.Provider>
  );
}

export default App;
