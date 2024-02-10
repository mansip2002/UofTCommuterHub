import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/manage-commutes" className="logo">
      <img src="/logo.png" alt="Logo" />
      UofT Commuter Hub
    </Link>
  );
};
