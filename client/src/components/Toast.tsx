import toast from "react-hot-toast";

export const successToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: "top-right",
    style: {
      background: "#4ade80",
      color: "#fff",
      fontWeight: "600",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#16a34a",
    },
  });
};

export const errorToast = (message: string) => {
  toast.error(message, {
    duration: 3000,
    position: "top-right",
    style: {
      background: "#ef4444",
      color: "#fff",
      fontWeight: "600",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#b91c1c",
    },
  });
};
