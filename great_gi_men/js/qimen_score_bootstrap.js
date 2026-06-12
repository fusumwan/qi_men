/**
 * 瀏覽器用 bootstrap：將 ES module 匯出掛到 window，供奇門4.html 等傳統 script 使用
 */
import { QimenScoreEngine } from "./QimenScoreEngine.js";

window.QimenScoreEngine = QimenScoreEngine;

/**
 * 格式化單宮吉利指數報告
 * @param {Object} result QimenScoreEngine.evaluate() 回傳值
 * @returns {string}
 */
window.formatQimenScoreReport = function formatQimenScoreReport(result) {
  if (!result) return "吉利指數：無法計算\n";

  let text = `吉利指數：${result.finalScore}（${result.level}）\n`;
  text += `格局：${result.pattern.name}（${result.pattern.level}）\n`;
  text += `基礎分：${result.baseScore}｜組合加權：${result.combinationScore}｜五行加權：${result.elementScore}\n`;

  if (result.analysis && result.analysis.length > 0) {
    text += "組合分析：\n";
    result.analysis.forEach((item) => {
      text += `  · ${item.name}（${item.score >= 0 ? "+" : ""}${item.score}）：${item.explanation}\n`;
    });
  }

  if (result.summary) {
    text += `綜合評語：${result.summary}\n`;
  }

  return text;
};
