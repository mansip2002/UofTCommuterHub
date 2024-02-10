import { useState, useEffect } from "react";
import { getStorage } from "../lib/storage";
import { Logo } from "./Logo";
import { MenuLink } from "./MenuLink";

export const Menu = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getStorage("capstone-token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!getStorage("capstone-token"));
    };

    window.addEventListener("mutateStorage", handleStorageChange);

    return () => {
      window.removeEventListener("mutateStorage", handleStorageChange);
    };
  }, []);

  return (
    <div className="menu-sticky">
      <Logo />

      <div>
        <MenuLink to="/manage-commutes">My Commutes</MenuLink>
        <MenuLink to="/matching">Find Matches</MenuLink>
        <MenuLink to="/faq">Learn</MenuLink>
      </div>

      <div>
        {isLoggedIn ? (
          <MenuLink to="/sign-out" primary>
            Sign out
          </MenuLink>
        ) : (
          <>
            <MenuLink to="/login">Login</MenuLink>
            <MenuLink to="/signup" primary>
              Try for free
            </MenuLink>
          </>
        )}
      </div>
    </div>
  );
};
