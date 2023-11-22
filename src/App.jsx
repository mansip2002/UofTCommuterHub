import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Faq from "./pages/Faq";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import SignUp from "./pages/SignUp";
import SignOut from "./pages/SignOut";
import MatchingSystem from "./pages/Matching";
import Resources from "./pages/Resources";
import UserProfile from "./pages/UserProfile";
import React from "react";
import { ToastProvider } from "./lib/toast";
import Toast from "./components/Toast";
import "bootstrap/dist/css/bootstrap.css";

// note React requires that the first letter of components are capitalized - otherwise WILL cause errors

function App() {
  return (
    <ToastProvider>
      <Toast />
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/matching" element={<MatchingSystem />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/sign-out" element={<SignOut />} />
          <Route path="/verify" element={<Verify />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
