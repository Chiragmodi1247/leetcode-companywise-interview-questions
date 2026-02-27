"use client";

import { useState, useEffect, useCallback } from "react";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase";
import type { User } from "firebase/auth";

export type Status = "todo" | "in_progress" | "done" | "revisit" | "";

export interface ProgressMap {
  [questionId: number]: Status;
}

export function useProgress(user: User | null) {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setProgress({});
      return;
    }

    const db = getFirebaseDb();
    if (!db) return;

    setLoading(true);
    const progressCol = collection(db, "users", user.uid, "progress");
    getDocs(progressCol)
      .then((snap) => {
        const map: ProgressMap = {};
        snap.forEach((d) => {
          map[parseInt(d.id, 10)] = d.data().status as Status;
        });
        setProgress(map);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const updateStatus = useCallback(
    async (questionId: number, status: Status) => {
      if (!user) return;
      const db = getFirebaseDb();
      if (!db) return;

      setProgress((prev) => ({ ...prev, [questionId]: status }));
      const ref = doc(db, "users", user.uid, "progress", String(questionId));
      await setDoc(ref, { status, updatedAt: serverTimestamp() });
    },
    [user]
  );

  return { progress, loading, updateStatus };
}
