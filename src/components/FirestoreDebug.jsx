import { useEffect } from "react";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../auth";

export default function FirestoreDebug() {
  useEffect(() => {
    (async () => {
      const uid = auth.currentUser?.uid;
      console.log("Current UID:", uid);

      // 1. Write to a guaranteed top-level collection
      try {
        await setDoc(doc(db, "test", "hello"), {
          text: "it works",
          ts: Date.now(),
          uid
        });
        console.log("Write to test/hello succeeded");
      } catch (err) {
        console.error("Write FAILED:", err);
      }

      // 2. Read it back
      try {
        const snap = await getDoc(doc(db, "test", "hello"));
        console.log("Read test/hello:", snap.exists() ? snap.data() : "NOT FOUND");
      } catch (err) {
        console.error("Read FAILED:", err);
      }

      // 3. List everything in the test collection
      try {
        const q = collection(db, "test");
        const snap = await getDocs(q);
        console.log("All docs in test:", snap.docs.map(d => ({ id: d.id, data: d.data() })));
      } catch (err) {
        console.error("List FAILED:", err);
      }
    })();
  }, []);

  return <div>Firestore Debug Running… check console</div>;
}
