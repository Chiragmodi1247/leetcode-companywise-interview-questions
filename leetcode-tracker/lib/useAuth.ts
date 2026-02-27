"use client";

import { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import { getFirebaseAuth } from "./firebase";

const provider = new GoogleAuthProvider();

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const signIn = async () => {
    const auth = getFirebaseAuth();
    if (!auth) {
      console.warn("Firebase not configured — sign-in unavailable");
      return;
    }
    return signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    return firebaseSignOut(auth);
  };

  return { user, loading, signIn, signOut };
}
