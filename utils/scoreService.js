import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { getAuth } from "firebase/auth";

export const updateScore = async (scoreChange) => {
  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  if (!userId) {
    console.log("User is not logged in.");
    return { score: 0, streak: 0 };
  }

  const scoreDocRef = doc(db, "scores", userId);
  const scoreDoc = await getDoc(scoreDocRef);

  let currentScore = 0;
  let currentStreak = 0;

  if (scoreDoc.exists()) {
    const data = scoreDoc.data();
    currentScore = data.score || 0;
    currentStreak = data.streak || 0;
  }

  let newScore = currentScore + scoreChange;
  let newStreak = scoreChange > 0 ? currentStreak + 1 : 0;

  if (newStreak >= 3) {
    newScore += 1;
    newStreak = 0;
  }

  await setDoc(scoreDocRef, {
    score: newScore,
    streak: newStreak,
  });

  return { score: newScore, streak: newStreak };
};
