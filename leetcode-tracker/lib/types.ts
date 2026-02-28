export interface CompanyFrequency {
  name: string;
  frequency: number;
  isTop?: boolean;
}

export interface Question {
  id: number;
  title: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
  acceptance: string;
  companies: CompanyFrequency[];
}

export interface TrendingQuestion {
  id: number;
  title: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
  acceptance: string;
  trendingCompanies: { name: string; frequency: number }[];
}
