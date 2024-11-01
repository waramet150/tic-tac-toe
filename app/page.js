"use client";

import XOGame from "@/components/XOGame";
import LogoutButton from "../components/logoutButton";
import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/utils/firebase";

export default function Home() {
  const [data, setData] = useState();

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to XO Game</h1>

      <h2 className="flex mb-5">
        {data
          ? `Welcome ${data.displayName}`
          : "Please Log in before play the game"}
      </h2>
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

      <XOGame data={data} />
    </div>
  );
}
