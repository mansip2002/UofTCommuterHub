import { Link } from "react-router-dom";

export const MenuLink = ({ children, to, primary }) => {
  return (
    <Link to={to} className={`menu-link ${primary ? "primary" : ""}`}>
      {children}
    </Link>
  );
};
