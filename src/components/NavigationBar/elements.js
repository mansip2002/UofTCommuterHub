// code template from: https://www.geeksforgeeks.org/how-to-create-a-multi-page-website-using-react-js/

import {FaBars} from "react-icons/fa";
import {NavLink} from "react-router-dom";
import styled from "styled-components";

export const Nav = styled.nav`
  background: #000000;
  height: 85px;
  display: flex;
  justify-content: space-between;
  padding: 0.2rem calc((100vw - 1000px) / 2);
  z-index: 12;
`;
 
export const Navlink = styled(NavLink)`
  color: #808080;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
  &.active {
    color: #4d4dff;
  }
`;
 
export const Bars = styled(FaBars)`
  display: none;
  color: #808080;
  @media screen and (max-width: 768px) {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 75%);
    font-size: 1.8rem;
    cursor: pointer;
  }
`;
 
export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  margin-right: -24px;
 
  @media screen and (max-width: 768px) {
    display: none;
  }
`;