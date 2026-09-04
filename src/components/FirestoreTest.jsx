import { useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // your existing firebase.js

export default function FirestoreTest() {
  useEffect(() => {
    async function run() {
      try {
        await setDoc(doc(db, "test", "hello"), { text: "it works", ts: Date.now() });
        const snap = await getDoc(doc(db, "test", "hello"));
        console.log("Firestore test doc:", snap.data());
      } catch (err) {
        console.error("Firestore test failed:", err);
      }
    }
    run();
  }, []);

  return null;
}
