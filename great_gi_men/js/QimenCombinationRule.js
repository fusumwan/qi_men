/**
 * 門、星、神、宮、格局組合規則
 */
export class QimenCombinationRule {
  /**
   * 入墓自刑格局的完整組合規則表
   * 依規格預先定義 12 條案例
   */
  static RUMU_ZIXING_RULES = [
    {
      method: "evaluateDoorStarPattern",
      match: { door: "杜門", star: "天心" },
      type: "門+星+格局",
      name: "智慧被困格",
      score: -10,
      explanation: "天心主智慧判斷，杜門主封閉，遇入墓自刑，代表有能力但暫時不能發揮。"
    },
    {
      method: "evaluateDoorGodPattern",
      match: { door: "杜門", god: "太陰" },
      type: "門+神+格局",
      name: "暗助受阻格",
      score: 5,
      explanation: "太陰主暗助，杜門主閉藏，入墓自刑主自困，代表有人暗中幫助，但幫助力量受阻。"
    },
    {
      method: "evaluateDoorPalacePattern",
      match: { door: "杜門", palace: "巽四宮" },
      type: "門+宮+格局",
      name: "木宮困金",
      score: -5,
      explanation: "巽四宮與杜門皆屬木，遇辛金入己墓，形成木宮困金之象。"
    },
    {
      method: "evaluateStarDoorPattern",
      match: { star: "天心", door: "杜門" },
      type: "星+門+格局",
      name: "閉門思考格",
      score: 10,
      explanation: "天心主思考判斷，杜門主封閉研究，雖遇入墓自刑，但適合閉門策劃。"
    },
    {
      method: "evaluateStarGodPattern",
      match: { star: "天心", god: "太陰" },
      type: "星+神+格局",
      name: "智者隱修格",
      score: 15,
      explanation: "天心主智慧，太陰主隱藏與暗助，遇入墓自刑，形成外失其勢、內藏其智之象。"
    },
    {
      method: "evaluateStarPalacePattern",
      match: { star: "天心", palace: "巽四宮" },
      type: "星+宮+格局",
      name: "能力受環境壓制",
      score: -10,
      explanation: "天心屬金，巽宮屬木，木金交戰，加上入墓自刑，代表能力受環境限制。"
    },
    {
      method: "evaluatePalaceDoorPattern",
      match: { palace: "巽四宮", door: "杜門" },
      type: "宮+門+格局",
      name: "閉塞不通",
      score: -10,
      explanation: "巽宮與杜門同屬木，杜門主閉塞，入墓自刑主自困，故事情不易通達。"
    },
    {
      method: "evaluatePalaceGodPattern",
      match: { palace: "巽四宮", god: "太陰" },
      type: "宮+神+格局",
      name: "女性暗助",
      score: 10,
      explanation: "太陰主女性、文書、暗助，落巽宮有消息、文書、滲透之象，能暗中補救凶格。"
    },
    {
      method: "evaluatePalaceStarPattern",
      match: { palace: "巽四宮", star: "天心" },
      type: "宮+星+格局",
      name: "木金交戰",
      score: -10,
      explanation: "巽宮屬木，天心屬金，木金相戰，加上入墓自刑，主環境與能力互相牽制。"
    },
    {
      method: "evaluateGodDoorPattern",
      match: { god: "太陰", door: "杜門" },
      type: "神+門+格局",
      name: "暗中保護",
      score: 15,
      explanation: "太陰主隱藏保護，杜門主閉藏，雖有入墓自刑，但可避免外部衝擊。"
    },
    {
      method: "evaluateGodPalacePattern",
      match: { god: "太陰", palace: "巽四宮" },
      type: "神+宮+格局",
      name: "女性或文書貴人",
      score: 10,
      explanation: "太陰主女性與暗助，巽宮主文書消息，代表可由女性、文件、消息渠道得到補救。"
    },
    {
      method: "evaluateGodStarPattern",
      match: { god: "太陰", star: "天心" },
      type: "神+星+格局",
      name: "智囊格",
      score: 20,
      explanation: "太陰主隱密，天心主智慧，雖逢凶格，仍有智囊、暗中策略、內部判斷力。"
    }
  ];

  /**
   * 檢查輸入是否符合規則條件
   * @param {Object} input
   * @param {Object} match
   * @returns {boolean}
   */
  matches(input, match) {
    return Object.keys(match).every((key) => input[key] === match[key]);
  }

  /**
   * 檢查格局是否為入墓自刑
   * @param {Object} input
   * @returns {boolean}
   */
  isRumuZixing(input) {
    return input.pattern && input.pattern.name === "入墓自刑";
  }

  /**
   * 套用單一規則
   * @param {Object} input
   * @param {Object} rule
   * @returns {Object|null}
   */
  applyRule(input, rule) {
    if (!this.isRumuZixing(input)) return null;
    if (!this.matches(input, rule.match)) return null;

    return {
      type: rule.type,
      name: rule.name,
      score: rule.score,
      explanation: rule.explanation
    };
  }

  evaluateDoorStarPattern(input) {
    const rule = QimenCombinationRule.RUMU_ZIXING_RULES.find((r) => r.method === "evaluateDoorStarPattern");
    return this.applyRule(input, rule);
  }

  evaluateDoorGodPattern(input) {
    const rule = QimenCombinationRule.RUMU_ZIXING_RULES.find((r) => r.method === "evaluateDoorGodPattern");
    return this.applyRule(input, rule);
  }

  evaluateDoorPalacePattern(input) {
    const rule = QimenCombinationRule.RUMU_ZIXING_RULES.find((r) => r.method === "evaluateDoorPalacePattern");
    return this.applyRule(input, rule);
  }

  evaluateStarDoorPattern(input) {
    const rule = QimenCombinationRule.RUMU_ZIXING_RULES.find((r) => r.method === "evaluateStarDoorPattern");
    return this.applyRule(input, rule);
  }

  evaluateStarGodPattern(input) {
    const rule = QimenCombinationRule.RUMU_ZIXING_RULES.find((r) => r.method === "evaluateStarGodPattern");
    return this.applyRule(input, rule);
  }

  evaluateStarPalacePattern(input) {
    const rule = QimenCombinationRule.RUMU_ZIXING_RULES.find((r) => r.method === "evaluateStarPalacePattern");
    return this.applyRule(input, rule);
  }

  evaluatePalaceDoorPattern(input) {
    const rule = QimenCombinationRule.RUMU_ZIXING_RULES.find((r) => r.method === "evaluatePalaceDoorPattern");
    return this.applyRule(input, rule);
  }

  evaluatePalaceGodPattern(input) {
    const rule = QimenCombinationRule.RUMU_ZIXING_RULES.find((r) => r.method === "evaluatePalaceGodPattern");
    return this.applyRule(input, rule);
  }

  evaluatePalaceStarPattern(input) {
    const rule = QimenCombinationRule.RUMU_ZIXING_RULES.find((r) => r.method === "evaluatePalaceStarPattern");
    return this.applyRule(input, rule);
  }

  evaluateGodDoorPattern(input) {
    const rule = QimenCombinationRule.RUMU_ZIXING_RULES.find((r) => r.method === "evaluateGodDoorPattern");
    return this.applyRule(input, rule);
  }

  evaluateGodPalacePattern(input) {
    const rule = QimenCombinationRule.RUMU_ZIXING_RULES.find((r) => r.method === "evaluateGodPalacePattern");
    return this.applyRule(input, rule);
  }

  evaluateGodStarPattern(input) {
    const rule = QimenCombinationRule.RUMU_ZIXING_RULES.find((r) => r.method === "evaluateGodStarPattern");
    return this.applyRule(input, rule);
  }

  /**
   * 回傳所有命中的組合規則
   * @param {Object} input
   * @returns {Array<Object>}
   */
  evaluate(input) {
    const evaluators = [
      this.evaluateDoorStarPattern.bind(this),
      this.evaluateDoorGodPattern.bind(this),
      this.evaluateDoorPalacePattern.bind(this),
      this.evaluateStarDoorPattern.bind(this),
      this.evaluateStarGodPattern.bind(this),
      this.evaluateStarPalacePattern.bind(this),
      this.evaluatePalaceDoorPattern.bind(this),
      this.evaluatePalaceGodPattern.bind(this),
      this.evaluatePalaceStarPattern.bind(this),
      this.evaluateGodDoorPattern.bind(this),
      this.evaluateGodPalacePattern.bind(this),
      this.evaluateGodStarPattern.bind(this)
    ];

    return evaluators
      .map((fn) => fn(input))
      .filter(Boolean);
  }
}
