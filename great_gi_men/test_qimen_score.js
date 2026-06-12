/**
 * 奇門宮位吉利指數測試
 * 執行：node test_qimen_score.js
 */
import { QimenScoreEngine } from "./js/QimenScoreEngine.js";

const engine = new QimenScoreEngine();

const result = engine.evaluate({
  palace: "巽四宮",
  tianGan: "辛",
  diGan: "己",
  star: "天心",
  god: "太陰",
  door: "杜門"
});

console.log(JSON.stringify(result, null, 2));

// 簡易驗證
const checks = [
  ["pattern.name", result.pattern.name, "入墓自刑"],
  ["baseScore", result.baseScore, -5],
  ["combinationScore", result.combinationScore, 40],
  ["elementScore", result.elementScore, -10],
  ["finalScore", result.finalScore, 70],
  ["level", result.level, "中吉"]
];

let passed = 0;
checks.forEach(([label, actual, expected]) => {
  const ok = actual === expected;
  console.log(`${ok ? "✓" : "✗"} ${label}: ${actual} ${ok ? "" : `(預期 ${expected})`}`);
  if (ok) passed++;
});

const summaryKeywords = ["先天凶格", "後天配置有補救", "外凶內吉", "宜謀", "策劃", "研究", "文書", "策略", "不宜硬攻", "投機", "急進"];
const summaryOk = summaryKeywords.every((kw) => result.summary.includes(kw));
console.log(`${summaryOk ? "✓" : "✗"} summary 關鍵字完整`);

console.log(`\n通過 ${passed}/${checks.length} 項數值檢查`);
