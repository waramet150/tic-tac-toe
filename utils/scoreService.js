import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { getAuth } from "firebase/auth";

export const saveScore = async (scoreChange) => {
  const auth = getAuth();
  const userId = auth.currentUser.uid;

  const scoreDocRef = doc(db, "scores", userId);
  const scoreDoc = await getDoc(scoreDocRef);

  let newScore = 0;
  let newStreak = 0;

  // กำหนดค่าพื้นฐานให้กับ score และ streak
  let currentScore = 0;
  let currentStreak = 0;

  if (scoreDoc.exists()) {
    const data = scoreDoc.data();
    currentScore = data.score || 0; // ถ้า score เป็น undefined ให้ใช้ 0
    currentStreak = data.streak || 0; // ถ้า streak เป็น undefined ให้ใช้ 0
  }

  newScore = currentScore + scoreChange;
  newStreak = scoreChange > 0 ? currentStreak + 1 : 0; // ถ้าเป็นการชนะให้เพิ่มสแตค ถ้าแพ้ให้รีเซ็ตเป็น 0

  if (newStreak >= 3) {
    newScore += 1; // เพิ่มคะแนนพิเศษ
    newStreak = 0; // รีเซ็ตสแตค
  }

  // บันทึกข้อมูลใหม่
  await setDoc(scoreDocRef, {
    score: newScore,
    streak: newStreak,
  });
};
