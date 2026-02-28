const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const PROBLEMS_DIR = path.resolve(__dirname, "../../problems");
const OUTPUT_DIR = path.resolve(__dirname, "../public/data");
const TOP_COMPANIES_CSV = path.resolve(__dirname, "../data/top-companies.csv");

function getCompanyDirs() {
  const entries = fs.readdirSync(PROBLEMS_DIR, { withFileTypes: true });
  const skip = new Set(["src", "node_modules", "target"]);
  return entries
    .filter((e) => e.isDirectory() && !skip.has(e.name) && !e.name.startsWith("."))
    .map((e) => e.name);
}

function formatCompanyName(dirName) {
  return dirName
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function loadTopCompanies() {
  if (!fs.existsSync(TOP_COMPANIES_CSV)) return new Set();
  const raw = fs.readFileSync(TOP_COMPANIES_CSV, "utf-8");
  const names = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return new Set(names.map((n) => n.toLowerCase()));
}

function parseCsvFile(csvPath) {
  if (!fs.existsSync(csvPath)) return null;
  const raw = fs.readFileSync(csvPath, "utf-8");
  try {
    return parse(raw, { columns: true, skip_empty_lines: true });
  } catch {
    return null;
  }
}

function run() {
  const companies = getCompanyDirs();
  const questionsMap = new Map();
  const companySet = new Set();
  const topCompaniesLower = loadTopCompanies();
  const topCompanyNames = new Set();

  // Trending: questions from top companies' thirty-days.csv
  // Map<questionId, { ...question, trendingCompanies: [{name, frequency}] }>
  const trendingMap = new Map();

  for (const company of companies) {
    const displayName = formatCompanyName(company);
    const isTop = topCompaniesLower.has(displayName.toLowerCase());
    if (isTop) topCompanyNames.add(displayName);

    // Parse all.csv for main data
    const allRecords = parseCsvFile(path.join(PROBLEMS_DIR, company, "all.csv"));
    if (allRecords) {
      companySet.add(displayName);

      for (const row of allRecords) {
        const id = parseInt(row["ID"], 10);
        if (isNaN(id)) continue;
        const frequency = parseFloat(row["Frequency %"]) || 0;

        if (questionsMap.has(id)) {
          const existing = questionsMap.get(id);
          if (!existing.companies.some((c) => c.name === displayName)) {
            existing.companies.push({ name: displayName, frequency, isTop });
          }
        } else {
          questionsMap.set(id, {
            id,
            title: row["Title"] || "",
            url: row["URL"] || "",
            difficulty: row["Difficulty"] || "",
            acceptance: row["Acceptance %"] || "",
            companies: [{ name: displayName, frequency, isTop }],
          });
        }
      }
    }

    // Parse thirty-days.csv for trending (top companies only)
    if (isTop) {
      const thirtyRecords = parseCsvFile(path.join(PROBLEMS_DIR, company, "thirty-days.csv"));
      if (thirtyRecords) {
        for (const row of thirtyRecords) {
          const id = parseInt(row["ID"], 10);
          if (isNaN(id)) continue;
          const frequency = parseFloat(row["Frequency %"]) || 0;

          if (trendingMap.has(id)) {
            const existing = trendingMap.get(id);
            if (!existing.trendingCompanies.some((c) => c.name === displayName)) {
              existing.trendingCompanies.push({ name: displayName, frequency });
            }
          } else {
            trendingMap.set(id, {
              id,
              title: row["Title"] || "",
              url: row["URL"] || "",
              difficulty: row["Difficulty"] || "",
              acceptance: row["Acceptance %"] || "",
              trendingCompanies: [{ name: displayName, frequency }],
            });
          }
        }
      }
    }
  }

  const questions = Array.from(questionsMap.values()).sort((a, b) => a.id - b.id);
  const companyList = Array.from(companySet).sort();
  const topCompanyList = Array.from(topCompanyNames).sort();

  // Sort trending by number of companies asking, then by max frequency
  const trending = Array.from(trendingMap.values()).sort((a, b) => {
    if (b.trendingCompanies.length !== a.trendingCompanies.length) {
      return b.trendingCompanies.length - a.trendingCompanies.length;
    }
    const maxA = Math.max(...a.trendingCompanies.map((c) => c.frequency));
    const maxB = Math.max(...b.trendingCompanies.map((c) => c.frequency));
    return maxB - maxA;
  });

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, "questions.json"), JSON.stringify(questions));
  fs.writeFileSync(path.join(OUTPUT_DIR, "companies.json"), JSON.stringify(companyList));
  fs.writeFileSync(path.join(OUTPUT_DIR, "top-companies.json"), JSON.stringify(topCompanyList));
  fs.writeFileSync(path.join(OUTPUT_DIR, "trending.json"), JSON.stringify(trending));

  console.log(
    `Parsed ${questions.length} questions from ${companyList.length} companies (${topCompanyList.length} top, ${trending.length} trending)`
  );
}

run();
