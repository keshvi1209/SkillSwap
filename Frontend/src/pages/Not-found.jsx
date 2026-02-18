import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#111",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: "80px", margin: 0 }}>404</h1>
      <p style={{ fontSize: "20px", marginBottom: "20px" }}>
        Page Not Found
      </p>
      <Link
        to="/"
        style={{
          padding: "10px 20px",
          background: "#6366f1",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none",
        }}
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
