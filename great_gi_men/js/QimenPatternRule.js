import { PatternData } from "../constants/PatternData.js";

/** 合法三奇六儀天干 */
const VALID_GANS = ["乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

/**
 * 三奇六儀格局規則
 */
export class QimenPatternRule {
  /**
   * 正規化天干
   * @param {string} gan
   * @returns {string|null}
   */
  normalizeGan(gan) {
    const value = String(gan || "").trim();
    return VALID_GANS.includes(value) ? value : null;
  }

  /**
   * 組合 key，如 "辛+己"
   * @param {string} tianGan
   * @param {string} diGan
   * @returns {string|null}
   */
  makeKey(tianGan, diGan) {
    const tian = this.normalizeGan(tianGan);
    const di = this.normalizeGan(diGan);
    if (!tian || !di) return null;
    return `${tian}+${di}`;
  }

  /**
   * 查詢格局
   * @param {string} tianGan 天盤天干
   * @param {string} diGan 地盤天干
   * @returns {Object|null}
   */
  getPattern(tianGan, diGan) {
    const key = this.makeKey(tianGan, diGan);
    if (!key) return null;

    const pattern = PatternData[key];
    if (!pattern) return null;

    return {
      key,
      name: pattern.name,
      level: pattern.level,
      score: pattern.score,
      explanation: pattern.explanation
    };
  }

  /**
   * 以 key 查詢格局
   * @param {string} key 如 "辛+己"
   * @returns {Object|null}
   */
  getPatternByKey(key) {
    const pattern = PatternData[key];
    if (!pattern) return null;

    return {
      key,
      name: pattern.name,
      level: pattern.level,
      score: pattern.score,
      explanation: pattern.explanation
    };
  }

  /**
   * 是否命中格局
   * @param {string} tianGan
   * @param {string} diGan
   * @returns {boolean}
   */
  hasPattern(tianGan, diGan) {
    return this.getPattern(tianGan, diGan) !== null;
  }

  /**
   * 回傳全部格局
   * @returns {Array<Object>}
   */
  getAllPatterns() {
    return Object.keys(PatternData).map((key) => this.getPatternByKey(key));
  }
}
