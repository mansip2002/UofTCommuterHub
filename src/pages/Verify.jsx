import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const Verify = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const verify = async () => {
    const code = params.get("code");
    const email = params.get("email");

    if (!code || !email) {
      return navigate("/login");
    }

    const response = await fetch("http://127.0.0.1:5000/verify", {
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

  useEffect(() => {
    verify();
  }, [params]);

  return <div>Verifying...</div>;
};

export default Verify;
