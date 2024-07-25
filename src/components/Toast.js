// src/components/Toast.js
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Configure default toast options
// toast("Custom Style Notification with css class!", {
//   position: "top-right",
//   autoClose: 5000,
// });

// toast.configure({
//   autoClose: 5000,
//   position: "top-right",
// });

export const notifySuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 5000,
  });
};

export const notifyError = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
  });
};

export const notifyInfo = (message) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 5000,
  });
};

export const notifyWarning = (message) => {
  toast.warn(message, {
    position: "top-right",
    autoClose: 5000,
  });
};
