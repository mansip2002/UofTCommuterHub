// code template from: https://www.geeksforgeeks.org/how-to-create-a-multi-page-website-using-react-js/

import { useState, useEffect } from "react";
import { Nav, Navlink, NavMenu } from "./elements";
import { getStorage } from "../../lib/storage";

const NavigationBar = () => {
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
    <Nav className="Navigation">
      <NavMenu>
        <Navlink to="/user-profile">Profile</Navlink>
        <Navlink to="/matching">Find a Match</Navlink>
        <Navlink to="/resources">Resources</Navlink>
        <Navlink to="/faq">FAQ</Navlink>
        {isLoggedIn ? (
          <Navlink to="/sign-out">Sign out</Navlink>
        ) : (
          <>
            <Navlink to="/login">Login</Navlink>
            <Navlink to="/signup">Sign Up</Navlink>
          </>
        )}
      </NavMenu>
    </Nav>
  );
};

export default NavigationBar;
