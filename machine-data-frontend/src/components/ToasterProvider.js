"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      gutter={12}
      containerStyle={{
        top: 20,
        right: 20,
      }}
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "16px",
          background: "rgba(15, 23, 42, 0.85)",
          color: "#fff",
          backdropFilter: "blur(12px)",
          padding: "16px 18px",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow:
            "0 10px 25px rgba(0,0,0,0.2), 0 4px 10px rgba(0,0,0,0.1)",
        },

        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "#ffffff",
          },
        },

        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}