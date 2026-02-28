const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const REPO_ROOT = path.resolve(__dirname, "../..");
const OUTPUT_DIR = path.resolve(__dirname, "../public/data");

function getCompanyDirs() {
  const entries = fs.readdirSync(REPO_ROOT, { withFileTypes: true });
  const skip = new Set([
    "leetcode-tracker",
    ".git",
    ".github",
    ".vscode",
    "src",
    "node_modules",
    "mcps",
  ]);
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

function run() {
  const companies = getCompanyDirs();
  const questionsMap = new Map();
  const companySet = new Set();

  for (const company of companies) {
    const csvPath = path.join(REPO_ROOT, company, "all.csv");
    if (!fs.existsSync(csvPath)) continue;

    const raw = fs.readFileSync(csvPath, "utf-8");
    let records;
    try {
      records = parse(raw, { columns: true, skip_empty_lines: true });
    } catch {
      console.warn(`Skipping ${company}/all.csv (parse error)`);
      continue;
    }

    const displayName = formatCompanyName(company);
    companySet.add(displayName);

    for (const row of records) {
      const id = parseInt(row["ID"], 10);
      if (isNaN(id)) continue;

      const frequency = parseFloat(row["Frequency %"]) || 0;

      if (questionsMap.has(id)) {
        const existing = questionsMap.get(id);
        const alreadyHasCompany = existing.companies.some(
          (c) => c.name === displayName
        );
        if (!alreadyHasCompany) {
          existing.companies.push({ name: displayName, frequency });
        }
      } else {
        questionsMap.set(id, {
          id,
          title: row["Title"] || "",
          url: row["URL"] || "",
          difficulty: row["Difficulty"] || "",
          acceptance: row["Acceptance %"] || "",
          companies: [{ name: displayName, frequency }],
        });
      }
    }
  }

  const questions = Array.from(questionsMap.values()).sort((a, b) => a.id - b.id);
  const companyList = Array.from(companySet).sort();

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "questions.json"),
    JSON.stringify(questions)
  );
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "companies.json"),
    JSON.stringify(companyList)
  );

  console.log(
    `Parsed ${questions.length} questions from ${companyList.length} companies`
  );
}

run();
