"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from "react";
import { Container, LinearProgress } from "@mui/material";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import QuestionTable from "@/components/QuestionTable";
import { useAuth } from "@/lib/useAuth";
import { useProgress } from "@/lib/useProgress";
import type { Question } from "@/lib/types";

export default function Home() {
  const { user, loading: authLoading, signIn, signOut } = useAuth();
  const { progress, loading: progressLoading, updateStatus } = useProgress(user);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [company, setCompany] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/data/questions.json").then((r) => r.json()),
      fetch("/data/companies.json").then((r) => r.json()),
    ]).then(([q, c]) => {
      setQuestions(q);
      setCompanies(c);
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
    <>
      <Header user={user} loading={authLoading} onSignIn={signIn} onSignOut={signOut} />
      {(isLoading || progressLoading) && <LinearProgress />}
      <Container maxWidth="xl" disableGutters>
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
      </Container>
    </>
  );
}
