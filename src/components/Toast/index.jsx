import { useToast } from "../../lib/toast";
import { ToastContainer, ToastOutput } from "./elements";

const Toast = () => {
  const {
    toast: { message, type },
  } = useToast();

  return (
    <ToastContainer id="toast" className={message ? "show" : ""}>
      <ToastOutput role="status" type={type}>
        {message}
      </ToastOutput>
    </ToastContainer>
  );
};

export default Toast;
