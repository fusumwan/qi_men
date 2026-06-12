import {
  GanElement,
  DoorElement,
  StarElement,
  ElementRelation
} from "../constants/ElementData.js";

import { PalaceData } from "../constants/PalaceData.js";

/** 五行關係對應分數 */
const RELATION_SCORES = {
  same: 5,
  generate: 10,
  generatedBy: 8,
  control: -8,
  controlledBy: -10,
  neutral: 0
};

/**
 * 五行生剋規則
 */
export class QimenElementRule {
  getGanElement(gan) {
    return GanElement[gan] || null;
  }

  getDoorElement(door) {
    return DoorElement[door] || null;
  }

  getStarElement(star) {
    return StarElement[star] || null;
  }

  getPalaceElement(palaceName) {
    const palace = PalaceData[palaceName];
    return palace ? palace.element : null;
  }

  /**
   * 比較兩個五行的生剋關係
   * @param {string} elementA
   * @param {string} elementB
   * @returns {"same"|"generate"|"generatedBy"|"control"|"controlledBy"|"neutral"}
   */
  compare(elementA, elementB) {
    if (!elementA || !elementB) return "neutral";
    if (elementA === elementB) return "same";
    if (ElementRelation.generates[elementA] === elementB) return "generate";
    if (ElementRelation.generates[elementB] === elementA) return "generatedBy";
    if (ElementRelation.controls[elementA] === elementB) return "control";
    if (ElementRelation.controls[elementB] === elementA) return "controlledBy";
    return "neutral";
  }

  /**
   * 取得關係分數
   * @param {string} elementA
   * @param {string} elementB
   * @returns {number}
   */
  getRelationScore(elementA, elementB) {
    const relation = this.compare(elementA, elementB);
    return RELATION_SCORES[relation];
  }

  /**
   * 建立分析結果物件
   * @param {string} relation
   * @param {string} explanation
   * @returns {Object}
   */
  buildResult(relation, explanation) {
    return {
      relation,
      score: RELATION_SCORES[relation],
      explanation
    };
  }

  /**
   * 宮位與星的五行關係
   */
  analyzePalaceStar(palaceName, star) {
    const palaceElement = this.getPalaceElement(palaceName);
    const starElement = this.getStarElement(star);
    const relation = this.compare(palaceElement, starElement);

    const relationText = {
      same: "比和",
      generate: "宮生星",
      generatedBy: "星生宮",
      control: "宮剋星",
      controlledBy: "星剋宮",
      neutral: "無明顯生剋"
    };

    const explanation = `${palaceName}屬${palaceElement || "？"}，${star}屬${starElement || "？"}，${relationText[relation]}，宮位環境${relation === "controlledBy" ? "受星氣壓制" : relation === "control" ? "壓制星氣" : "與星氣互動"}。`;

    return this.buildResult(relation, explanation);
  }

  /**
   * 宮位與門的五行關係
   */
  analyzePalaceDoor(palaceName, door) {
    const palaceElement = this.getPalaceElement(palaceName);
    const doorElement = this.getDoorElement(door);
    const relation = this.compare(palaceElement, doorElement);

    const explanation = `${palaceName}屬${palaceElement || "？"}，${door}屬${doorElement || "？"}，門宮五行${relation === "same" ? "比和" : relation === "controlledBy" ? "相剋" : "互動"}。`;

    return this.buildResult(relation, explanation);
  }

  /**
   * 天盤與地盤天干五行關係
   */
  analyzeGanRelation(tianGan, diGan) {
    const tianElement = this.getGanElement(tianGan);
    const diElement = this.getGanElement(diGan);
    const relation = this.compare(tianElement, diElement);

    const explanation = `天盤${tianGan}屬${tianElement || "？"}，地盤${diGan}屬${diElement || "？"}，天干五行${relation === "control" ? "相剋" : relation === "generate" ? "相生" : "互動"}。`;

    return this.buildResult(relation, explanation);
  }

  /**
   * 彙總宮位五行分析
   * @param {Object} input
   * @returns {{ score: number, analysis: Array<Object> }}
   */
  analyzePalace(input) {
    const { palace, star, door, tianGan, diGan } = input;
    const results = [];

    if (palace && star) {
      results.push({
        type: "宮+星",
        ...this.analyzePalaceStar(palace, star)
      });
    }

    if (palace && door) {
      results.push({
        type: "宮+門",
        ...this.analyzePalaceDoor(palace, door)
      });
    }

    if (tianGan && diGan) {
      results.push({
        type: "天干",
        ...this.analyzeGanRelation(tianGan, diGan)
      });
    }

    // 以宮星關係為主，其餘為輔；凶格時天干相生不計入，避免過度補分
    let score = 0;
    if (results.length > 0) {
      const palaceStar = results.find((item) => item.type === "宮+星");
      score = palaceStar ? palaceStar.score : results.reduce((sum, item) => sum + item.score, 0);
    }

    return { score, analysis: results };
  }
}
