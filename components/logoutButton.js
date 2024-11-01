// LogoutButton.js
import { auth } from "@/utils/firebase";
import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (error) {
      console.error("Logout Failed:", error.message);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white p-2 rounded"
    >
      Log out
    </button>
  );
};

export default LogoutButton;
