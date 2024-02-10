import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Faq from "./pages/Faq";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import SignUp from "./pages/SignUp";
import SignOut from "./pages/SignOut";
import MatchingSystem from "./pages/Matching";
import Resources from "./pages/Resources";
import { ToastProvider } from "./lib/toast";
import Toast from "./components/Toast";
import "bootstrap/dist/css/bootstrap.css";
import { Menu } from "./components/Menu";
import ManageCommutes from "./pages/ManageCommutes";

function App() {
  return (
    <ToastProvider>
      <Toast />
      <BrowserRouter>
        <Menu />
        <main>
          <Routes>
            <Route index element={<ManageCommutes />} />
            <Route path="/manage-commutes" element={<ManageCommutes />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/matching" element={<MatchingSystem />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/sign-out" element={<SignOut />} />
            <Route path="/verify" element={<Verify />} />
          </Routes>
        </main>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
