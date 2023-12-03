// code template from: https://www.geeksforgeeks.org/how-to-create-a-multi-page-website-using-react-js/

import React from "react";
import {Nav, Navlink, NavMenu} from "./elements";


const NavigationBar = () => {
    return (
        <Nav className="Navigation">
            <NavMenu>
                <Navlink to="/Login" activeStyle>
                    Profile
                </Navlink>
                <Navlink to="/Matching" activeStyle>
                    Find a Match
                </Navlink>
                <Navlink to="/Resources" activeStyle>
                    Resources
                </Navlink>
                <Navlink to="/Faq" activeStyle>
                    FAQ
                </Navlink>
                <Navlink to="/Login" activeStyle>
                    Login
                </Navlink>
                <Navlink to="/UserProfile" activeStyle>
                    Sign Up
                </Navlink>
                
            </NavMenu>
        </Nav>
    )
}

export default NavigationBar;