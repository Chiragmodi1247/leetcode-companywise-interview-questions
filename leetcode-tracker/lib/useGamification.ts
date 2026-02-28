"use client";

import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb } from "./firebase";
import type { User } from "firebase/auth";

export interface GamificationStats {
  totalXP: number;
  level: number;
  dailyChallengeId: number | null;
  dailyChallengeDate: string;
  dailyStreak: number;
}

const DEFAULT_STATS: GamificationStats = {
  totalXP: 0,
  level: 0,
  dailyChallengeId: null,
  dailyChallengeDate: "",
  dailyStreak: 0,
};

export const XP_VALUES: Record<string, number> = {
  Easy: 10,
  Medium: 25,
  Hard: 50,
};

export const DAILY_BONUS = 20;

export function computeLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 50));
}

export function xpForLevel(level: number): number {
  return level * level * 50;
}

function getTodayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useGamification(user: User | null) {
  const [stats, setStats] = useState<GamificationStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setStats(DEFAULT_STATS);
      return;
    }
    const db = getFirebaseDb();
    if (!db) return;

    setLoading(true);
    const ref = doc(db, "users", user.uid, "gamification", "stats");
    getDoc(ref)
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data() as GamificationStats;
          setStats({ ...DEFAULT_STATS, ...data });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const saveStats = useCallback(
    async (updated: GamificationStats) => {
      if (!user) return;
      const db = getFirebaseDb();
      if (!db) return;
      const ref = doc(db, "users", user.uid, "gamification", "stats");
      await setDoc(ref, { ...updated, updatedAt: serverTimestamp() });
    },
    [user]
  );

  const awardXP = useCallback(
    async (difficulty: string, isDone: boolean) => {
      const xpDelta = XP_VALUES[difficulty] || 0;
      if (xpDelta === 0) return;

      setStats((prev) => {
        const newXP = isDone
          ? prev.totalXP + xpDelta
          : Math.max(0, prev.totalXP - xpDelta);
        const updated = { ...prev, totalXP: newXP, level: computeLevel(newXP) };
        saveStats(updated);
        return updated;
      });
    },
    [saveStats]
  );

  const completeDaily = useCallback(
    async (questionId: number, difficulty: string) => {
      const today = getTodayUTC();
      const baseXP = XP_VALUES[difficulty] || 0;

      setStats((prev) => {
        if (prev.dailyChallengeDate === today && prev.dailyChallengeId === questionId) {
          return prev;
        }

        const yesterday = new Date();
        yesterday.setUTCDate(yesterday.getUTCDate() - 1);
        const yesterdayStr = yesterday.toISOString().slice(0, 10);
        const newStreak =
          prev.dailyChallengeDate === yesterdayStr ? prev.dailyStreak + 1 : 1;

        const newXP = prev.totalXP + baseXP + DAILY_BONUS;
        const updated: GamificationStats = {
          totalXP: newXP,
          level: computeLevel(newXP),
          dailyChallengeId: questionId,
          dailyChallengeDate: today,
          dailyStreak: newStreak,
        };
        saveStats(updated);
        return updated;
      });
    },
    [saveStats]
  );

  const isDailyCompleted = stats.dailyChallengeDate === getTodayUTC();

  return { stats, loading, awardXP, completeDaily, isDailyCompleted };
}
