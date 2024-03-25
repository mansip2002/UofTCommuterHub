import { useState, useEffect } from "react";
import { getStorage } from "../lib/storage";
import { Logo } from "./Logo";
import { MenuLink } from "./MenuLink";

export const Menu = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getStorage("capstone-token"));
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!getStorage("capstone-token"));
    };

    window.addEventListener("mutateStorage", handleStorageChange);

    return () => {
      window.removeEventListener("mutateStorage", handleStorageChange);
    };
  }, []);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <div className="menu-sticky">
      <Logo />

      <button className="mobile-menu-button" onClick={toggleMobileMenu}>
      ☰
      </button>

      <div className={`menu-links ${showMobileMenu ? "show" : ""}`}>
        <MenuLink to="/manage-commutes">My Commutes</MenuLink>
        <MenuLink to="/matching">Find Matches</MenuLink>
        <MenuLink to="/faq">Learn</MenuLink>

        {isLoggedIn ? (
          <MenuLink to="/sign-out" primary>
            Sign out
          </MenuLink>
        ) : (
          <>
            <MenuLink to="/login">Login</MenuLink>
            <MenuLink to="/signup" primary>
              Sign Up
            </MenuLink>
          </>
        )}
      </div>
    </div>
  );
};
