"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import DailyChallenge from "@/components/DailyChallenge";
import FilterBar from "@/components/FilterBar";
import QuestionTable from "@/components/QuestionTable";
import { useAuth } from "@/lib/useAuth";
import { useProgress, type Status } from "@/lib/useProgress";
import { useGamification } from "@/lib/useGamification";
import type { Question, TrendingQuestion } from "@/lib/types";

export default function App() {
  const { user, loading: authLoading, signIn, signOut } = useAuth();
  const { stats: gamification, awardXP, completeDaily, isDailyCompleted } = useGamification(user);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [topCompanies, setTopCompanies] = useState<string[]>([]);
  const [trending, setTrending] = useState<TrendingQuestion[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [view, setView] = useState<"dashboard" | "problems">("dashboard");

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [company, setCompany] = useState("");

  const questionsRef = useMemo(() => questions, [questions]);

  const onStatusChange = useCallback(
    (questionId: number, oldStatus: Status, newStatus: Status) => {
      const q = questionsRef.find((q) => q.id === questionId);
      if (!q) return;

      if (newStatus === "done" && oldStatus !== "done") {
        awardXP(q.difficulty, true);
      } else if (oldStatus === "done" && newStatus !== "done") {
        awardXP(q.difficulty, false);
      }
    },
    [questionsRef, awardXP]
  );

  const { progress, loading: progressLoading, updateStatus } = useProgress(user, onStatusChange);

  useEffect(() => {
    Promise.all([
      fetch("/data/questions.json").then((r) => r.json()),
      fetch("/data/companies.json").then((r) => r.json()),
      fetch("/data/top-companies.json").then((r) => r.json()),
      fetch("/data/trending.json").then((r) => r.json()),
    ]).then(([q, c, tc, tr]) => {
      setQuestions(q);
      setCompanies(c);
      setTopCompanies(tc);
      setTrending(tr);
      setDataLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const searchLower = search.toLowerCase();
    return questions.filter((q) => {
      if (searchLower && !q.title.toLowerCase().includes(searchLower)) return false;
      if (difficulty && q.difficulty !== difficulty) return false;
      if (company && !q.companies.some((c) => c.name === company)) return false;
      return true;
    });
  }, [questions, search, difficulty, company]);

  const isLoading = dataLoading || authLoading;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0d1117" }}>
      <Header
        user={user}
        loading={authLoading}
        onSignIn={signIn}
        onSignOut={signOut}
        view={view}
        onViewChange={setView}
        gamification={user ? gamification : undefined}
      />

      {(isLoading || progressLoading) && (
        <LinearProgress sx={{ bgcolor: "#21262d", "& .MuiLinearProgress-bar": { bgcolor: "#58a6ff" } }} />
      )}

      {user && !dataLoading && (
        <DailyChallenge
          trending={trending}
          isDailyCompleted={isDailyCompleted}
          streak={gamification.dailyStreak}
          onComplete={completeDaily}
        />
      )}

      {view === "dashboard" ? (
        <Dashboard
          questions={questions}
          progress={progress}
          topCompanies={topCompanies}
          trending={trending}
          isLoggedIn={!!user}
          onSignIn={signIn}
          onViewProblems={() => setView("problems")}
          gamification={gamification}
          onStatusChange={updateStatus}
        />
      ) : (
        <>
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            company={company}
            onCompanyChange={setCompany}
            companies={companies}
            resultCount={filtered.length}
          />
          <QuestionTable
            questions={filtered}
            progress={progress}
            onStatusChange={updateStatus}
            isLoggedIn={!!user}
          />
        </>
      )}

      <Box
        component="footer"
        sx={{ borderTop: "1px solid #21262d", py: 3, textAlign: "center" }}
      >
        <Typography variant="caption" sx={{ color: "#30363d" }}>
          Data sourced from LeetCode Premium
        </Typography>
      </Box>
    </Box>
  );
}
