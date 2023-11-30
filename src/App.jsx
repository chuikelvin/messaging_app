import { useContext, useEffect, useState } from "react";
import "./App.css";
import {
  Outlet,
  useRouteError,
  createBrowserRouter,
  Link,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import AuthProvider from "./context/AuthContext";

const Layout = () => {
  return (
    <>
      <Outlet />;
    </>
  );
};

const ErrorBoundary = () => {
  const error = useRouteError();
  return (
    <div className="routeerror">
      <h1>{error.status}</h1>
      {error.statusText}

      <Link to="/">Return to home</Link>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <Login />,
      },

      {
        path: "/home",
        element: <Home />,
      },
    ],
  },
]);

function App({ children }) {
  return (
    <AuthProvider>
      <RouterProvider router={router} />;
    </AuthProvider>
  );
}

export default App;
