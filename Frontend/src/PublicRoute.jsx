import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = localStorage.getItem("token");

  // If logged in → redirect to home
  if (token) {
    return <Navigate to="/" replace />;
  }

  // If not logged in → allow access
  return <Outlet />;
};

export default PublicRoute;
