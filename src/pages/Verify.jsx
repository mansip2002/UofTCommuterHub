import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { BACKEND_URL } from "../lib/globals";

const Verify = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const code = params.get("code");
      const email = params.get("email");

      if (!code || !email) {
        return navigate("/login");
      }

      const response = await fetch(`${BACKEND_URL}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      if (response.status === 200) {
        return navigate("/login?emailVerified=true");
      }
    };

    verify();
  }, [params, navigate]);

  return <div>Verifying...</div>;
};

export default Verify;
