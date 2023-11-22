import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteStorage } from "../lib/storage";

function SignOut() {
  const navigate = useNavigate();

  useEffect(() => {
    deleteStorage("capstone-token");

    navigate("/login");
  }, [navigate]);

  return null;
}

export default SignOut;
