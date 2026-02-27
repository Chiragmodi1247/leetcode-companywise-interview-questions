export interface CompanyFrequency {
  name: string;
  frequency: number;
}

export interface Question {
  id: number;
  title: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
  acceptance: string;
  companies: CompanyFrequency[];
}
