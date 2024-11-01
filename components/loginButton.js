// GoogleLoginButton.js
import { auth, provider } from "@/utils/firebase";
import { signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import LogoutButton from "../components/logoutButton";

const GoogleLoginButton = () => {
  const [data, setData] = useState();

  console.log("data", data);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setData(result.user);
      //   console.log("User Info:", result.user);
      // จัดการการเข้าสู่ระบบสำเร็จ เช่น เก็บข้อมูลผู้ใช้ หรือนำทางไปหน้าถัดไป
    } catch (error) {
      console.error("Login Failed:", error.message);
    }
  };

  return (
    <>
      {!data ? (
        <button
          onClick={handleGoogleLogin}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Log in with Google
        </button>
      ) : (
        <LogoutButton />
      )}
      {/* <h2>{data ? `Welcome ${data.displayName}` : ""}</h2> */}
    </>
  );
};

export default GoogleLoginButton;
