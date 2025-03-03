import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  return localStorage.getItem("isLoggedIn") === "true"; // Check if the user is logged in
};

const PrivateRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
