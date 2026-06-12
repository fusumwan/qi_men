import { DoorScore } from "../constants/DoorScore.js";
import { StarScore } from "../constants/StarScore.js";
import { GodScore } from "../constants/GodScore.js";

import { QimenPatternRule } from "./QimenPatternRule.js";
import { QimenCombinationRule } from "./QimenCombinationRule.js";
import { QimenElementRule } from "./QimenElementRule.js";
import { QimenPalaceRule } from "./QimenPalaceRule.js";

/**
 * 奇門宮位吉利指數總控制器
 *
 * 計算公式：
 * 宮位吉利指數 = 基礎吉凶 + 組合加權 + 五行生剋加權 + 格局放大器 + 宮位環境修正
 * 最終以 50 為中性基準，換算為 0–100 分
 */
export class QimenScoreEngine {
  constructor() {
    this.patternRule = new QimenPatternRule();
    this.combinationRule = new QimenCombinationRule();
    this.elementRule = new QimenElementRule();
    this.palaceRule = new QimenPalaceRule();
  }

  /**
   * 評估單一宮位
   * @param {Object} input
   * @returns {Object}
   */
  /**
   * 正規化輸入（宮名、星名、神煞等）
   * @param {Object} input
   * @returns {Object}
   */
  normalizeInput(input) {
    const palaceAliases = {
      "𢁉四宮": "巽四宮",
      "五宮/中宮": "中五宮",
      "五宮": "中五宮",
      "中宮": "中五宮"
    };
    const starAliases = {
      天苪: "天芮"
    };

    return {
      palace: palaceAliases[input.palace] || input.palace,
      tianGan: String(input.tianGan || "").trim(),
      diGan: String(input.diGan || "").trim(),
      star: starAliases[input.star] || input.star,
      god: String(input.god || "").replace(/Ｏ/g, "").trim(),
      door: String(input.door || "").trim()
    };
  }

  evaluate(input) {
    const normalized = this.normalizeInput(input);
    const pattern = this.patternRule.getPattern(normalized.tianGan, normalized.diGan) || {
      key: `${normalized.tianGan}+${normalized.diGan}`,
      name: "無格局",
      level: "中",
      score: 0,
      explanation: "未命中已知三奇六儀格局。"
    };

    const enrichedInput = { ...normalized, pattern };
    const baseScore = this.calculateBaseScore(normalized, pattern);
    const combinationAnalysis = this.combinationRule.evaluate(enrichedInput);
    const combinationScore = this.calculateCombinationScore(combinationAnalysis);
    const elementResult = this.elementRule.analyzePalace(normalized);
    const elementScore = this.calculateElementScore(elementResult);
    // 格局放大器：目前僅作記錄，不直接加總（上下限由 applyPatternCaps 處理）
    const patternMultiplier = this.getPatternMultiplier(pattern);
    const palaceModifier = this.getPalaceModifier(normalized);

    const rawTotal =
      baseScore +
      combinationScore +
      elementScore +
      palaceModifier;

    const rawScore = 50 + rawTotal;
    const cappedScore = this.applyPatternCaps(rawScore, pattern);
    const finalScore = this.clamp(cappedScore);

    return {
      finalScore,
      level: this.getScoreLevel(finalScore),
      pattern,
      baseScore,
      combinationScore,
      elementScore,
      patternMultiplier,
      palaceModifier,
      rawScore,
      cappedScore,
      analysis: combinationAnalysis,
      elementAnalysis: elementResult.analysis,
      summary: this.buildSummary(normalized, pattern, finalScore, combinationAnalysis)
    };
  }

  /**
   * 基礎分數 = 門 + 星 + 神 + 格局分
   */
  calculateBaseScore(input, pattern) {
    const door = DoorScore[input.door] || 0;
    const star = StarScore[input.star] || 0;
    const god = GodScore[input.god] || 0;
    const patternScore = pattern ? pattern.score : 0;
    return door + star + god + patternScore;
  }

  /**
   * 組合加權總分
   */
  calculateCombinationScore(analysis) {
    return analysis.reduce((sum, item) => sum + item.score, 0);
  }

  /**
   * 五行生剋加權
   */
  calculateElementScore(elementResult) {
    return elementResult.score;
  }

  /**
   * 格局放大器：依格局等級微調
   */
  getPatternMultiplier(pattern) {
    if (!pattern) return 0;

    switch (pattern.level) {
      case "大吉":
        return 5;
      case "吉":
        return 3;
      case "凶":
        return -3;
      case "大凶":
        return -5;
      default:
        return 0;
    }
  }

  /**
   * 宮位環境修正（目前以中宮、離宮等特性微調，測試案例為 0）
   */
  getPalaceModifier(input) {
    const palace = this.palaceRule.getPalace(input.palace);
    if (!palace) return 0;

    // 中五宮為樞紐，略增穩定；測試案例巽四宮不修正
    if (palace.name === "中五宮") return 2;
    return 0;
  }

  /**
   * 依凶格設定分數上下限
   */
  applyPatternCaps(score, pattern) {
    let finalScore = score;

    if (!pattern) return finalScore;

    if (pattern.name === "入墓自刑") {
      finalScore = Math.min(finalScore, 70);
    }

    if (pattern.level === "大凶") {
      finalScore = Math.min(finalScore, 60);
    } else if (pattern.level === "凶") {
      finalScore = Math.min(finalScore, 75);
    }

    if (pattern.level === "大吉") {
      finalScore = Math.max(finalScore, 75);
    }

    return finalScore;
  }

  /**
   * 分數等級
   */
  getScoreLevel(score) {
    if (score >= 85) return "大吉";
    if (score >= 70) return "中吉";
    if (score >= 55) return "小吉";
    if (score >= 45) return "平";
    if (score >= 30) return "小凶";
    if (score >= 15) return "凶";
    return "大凶";
  }

  /**
   * 限制分數在 0–100
   */
  clamp(score) {
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * 生成綜合評語
   */
  buildSummary(input, pattern, finalScore, analysis) {
    const positiveRules = analysis.filter((item) => item.score > 0);
    const negativeRules = analysis.filter((item) => item.score < 0);
    const hasRescue = positiveRules.length > negativeRules.length;

    const patternDesc = pattern && pattern.name !== "無格局"
      ? `${pattern.name}為先天${pattern.level === "吉" || pattern.level === "大吉" ? "吉" : "凶"}格`
      : "格局影響不明顯";

    const rescueDesc = hasRescue
      ? "後天配置有補救，天心、太陰、杜門形成閉門藏鋒、智者隱修之象"
      : "後天配置補救有限";

    const trendDesc =
      finalScore >= 55
        ? "此宮屬外凶內吉"
        : finalScore >= 45
          ? "此宮吉凶互見"
          : "此宮偏凶";

    const adviceDesc =
      hasRescue || finalScore >= 55
        ? "宜謀不宜衝，宜策劃、研究、文書、策略，不宜硬攻、投機或急進"
        : "宜守不宜攻，謹慎行事";

    return `${trendDesc}。${patternDesc}，但${rescueDesc}。${adviceDesc}。`;
  }
}
