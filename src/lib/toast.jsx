import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => setToast({ message: "" }), 4000);
  };

  const contextValue = { toast, showToast };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
};
