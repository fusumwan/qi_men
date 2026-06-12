/**
 * =============================================================================
 * qimen_san_qi_liu_yi.js — 奇門遁甲三奇六儀格局查詢
 * =============================================================================
 * 資料來源：resources/奇門遁甲三奇六儀格局.txt
 * 以「天盤天干 + 地盤天干」組合，查詢對應的三奇六儀格局名稱、吉凶與解釋。
 *
 * 使用方式：
 *   const qimen = new QiMenSanQiLiuYiPattern();
 *   qimen.find("乙", "丙");
 *
 * 支援天干：乙、丙、丁、戊、己、庚、辛、壬、癸（九干，共 81 格）
 * =============================================================================
 */

class QiMenSanQiLiuYiPattern {
  /** 合法天干清單 */
  static STEMS = ["乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

  /**
   * 依《奇門遁甲三奇六儀格局》原文整理的權威等級表
   * 優先於 detectLevel() 自動判斷
   */
  static LEVEL_OVERRIDES = {
    "乙乙": "伏吟", "乙丙": "吉", "乙丁": "吉", "乙戊": "凶", "乙己": "凶",
    "乙庚": "凶", "乙辛": "凶", "乙壬": "凶", "乙癸": "中",

    "丙乙": "吉", "丙丙": "伏吟", "丙丁": "吉", "丙戊": "大吉", "丙己": "凶",
    "丙庚": "凶", "丙辛": "吉", "丙壬": "凶", "丙癸": "凶",

    "丁乙": "吉", "丁丙": "吉", "丁丁": "伏吟", "丁戊": "吉", "丁己": "凶",
    "丁庚": "中", "丁辛": "凶", "丁壬": "吉", "丁癸": "凶",

    "戊乙": "中", "戊丙": "大吉", "戊丁": "大吉", "戊戊": "伏吟", "戊己": "凶",
    "戊庚": "大凶", "戊辛": "凶", "戊壬": "凶", "戊癸": "中",

    "己乙": "凶", "己丙": "凶", "己丁": "凶", "己戊": "中", "己己": "伏吟",
    "己庚": "中", "己辛": "凶", "己壬": "凶", "己癸": "凶",

    "庚乙": "凶", "庚丙": "凶", "庚丁": "凶", "庚戊": "大凶", "庚己": "大凶",
    "庚庚": "大凶", "庚辛": "大凶", "庚壬": "大凶", "庚癸": "大凶",

    "辛乙": "凶", "辛丙": "中", "辛丁": "吉", "辛戊": "凶", "辛己": "凶",
    "辛庚": "凶", "辛辛": "伏吟", "辛壬": "凶", "辛癸": "凶",

    "壬乙": "吉", "壬丙": "凶", "壬丁": "凶", "壬戊": "吉", "壬己": "凶",
    "壬庚": "吉", "壬辛": "凶", "壬壬": "伏吟", "壬癸": "凶",

    "癸乙": "吉", "癸丙": "吉", "癸丁": "凶", "癸戊": "中", "癸己": "中",
    "癸庚": "中", "癸辛": "大凶", "癸壬": "凶", "癸癸": "大凶"
  };

  /**
   * 原始格局資料（key = 天盤+地盤，如 "乙丙"）
   * description 摘錄自《奇門遁甲三奇六儀格局》
   * level 可省略，將由 LEVEL_OVERRIDES 或 detectLevel() 判定
   */
  static RAW_PATTERNS = {
    "乙乙": { name: "伏吟", description: "同干相見，主事情停滯、反覆，不宜妄動。" },

    "乙丙": {
      name: "奇儀順遂",
      description: "乙為日、丙為月，日月相逢屬吉格。但婚姻中以丙為女人的情夫，且乙下坐丙，表示妻子與人私通。天盤為日奇，地盤為月奇，乙木又生丙火，故名曰「奇儀順遂」格，謀事多吉；測婚中乙奇代表妻子，丙奇代表第三者男人，乙奇臨吉星則本質好、官場主客關係處理得好，故能遷官晉職；乙奇臨凶星則本質不好、作風壞，難免與第三者男人搞到一起，故出現夫妻反目離別。"
    },
    "乙丁": { name: "奇儀相佐", description: "乙為日、丁為星，日星相逢屬吉格。且婚姻中以丁為妾，妻在妾上，吉。" },
    "乙戊": { name: "利陰害陽", description: "乙木剋戊土，甲藏於戊之下，故凶。" },
    "乙己": { name: "日奇入墓", description: "乙為日奇，己為墳墓，乙落於墳墓之中故凶。" },
    "乙庚": { name: "日奇被刑", description: "庚金克乙木，日奇被克。且婚姻中以庚為丈夫，妻凌丈夫之上，故屬凶格。" },
    "乙辛": { name: "青龍逃走", description: "乙坐卯向，辛坐酉向，卯酉相衝且酉金克卯木，故曰「逃走」，凶格。" },
    "乙壬": { name: "日奇入地", description: "壬為地羅，乙坐地羅故曰「日奇入地」，凶格。" },
    "乙癸": { name: "日奇華蓋", description: "癸為天網、華蓋，有逃匿躲藏之意。華蓋逢日奇蔽佑，故宜於藏形，中。" },

    "丙乙": { name: "日月並行", description: "日奇月奇相會屬吉，且乙木生丙火更吉。此格公私皆利。" },
    "丙丙": { name: "伏吟", description: "同干相見，火氣重疊，主反覆、焦躁，事多拖延。" },
    "丙丁": { name: "月奇朱雀", description: "丁為朱雀，得月奇，吉。" },
    "丙戊": { name: "飛鳥跌穴", description: "甲木生丙火。丙遇甲，好似飛鳥歸巢，故名「飛鳥跌穴」，屬大吉。" },
    "丙己": { name: "月奇入墓", description: "己為火之墓（甲戌），又為墳墓，故名「月奇入墓」，主暗滯、受困。" },
    "丙庚": { name: "熒入太白", description: "熒者火也。熒入太白即火入金鄉，凶。" },
    "丙辛": { name: "謀事能成", description: "丙辛相合，故謀事能成，吉。" },
    "丙壬": { name: "火入地羅", description: "壬屬水克丙火，又為地羅，故名「火入地羅」，凶。" },
    "丙癸": { name: "悖師華蓋", description: "丙為悖師，癸為華蓋、天網，克丙火。丙奇遇之，自然為凶。" },

    "丁乙": { name: "人遁吉格", description: "丁為星，乙為日，相逢為吉格。但婚姻中以丁為妾，有妾在妻上之意。" },
    "丁丙": { name: "星隨月轉", description: "丁為星，丙為月，相逢為吉格。但火氣太旺，易出亂子。" },
    "丁丁": { name: "伏吟", description: "同干相見，星奇伏吟，主反覆、遲滯。" },
    "丁戊": { name: "青龍轉光", description: "戊為青龍，遇星奇屬吉格。" },
    "丁己": { name: "星奇入墓", description: "己為墳墓，故曰「星奇入墓」，凶。" },
    "丁庚": { name: "文書阻隔", description: "丁主文書，庚為阻隔之神，故名「文書阻隔」。文書阻隔則行人必歸。" },
    "丁辛": { name: "朱雀入獄", description: "辛為牢獄，為罪人。得丁奇則是罪人出獄，官人入獄。" },
    "丁壬": { name: "五神互合", description: "丁壬相合，吉。" },
    "丁癸": { name: "朱雀投江", description: "癸主江河，故名「朱雀投江」，又因癸水克丁火，故為凶格。" },

    "戊乙": { name: "青龍合靈", description: "甲、乙皆為青龍，甲藏於戊下，與乙會合，故曰「青龍合靈」，成敗皆為平時一倍。又因乙木剋戊土，所以此格吉凶需看所坐的九宮八門的情況而定。" },
    "戊丙": { name: "青龍反首", description: "戊為青龍屬木，生丙火，大吉。" },
    "戊丁": { name: "青龍耀明", description: "戊為青龍屬木，生丁火，丁為星奇，故曰「耀明」，大吉。" },
    "戊戊": { name: "伏吟", description: "同干伏吟，甲辰戊重疊，主停滯、守成、反覆。" },
    "戊己": { name: "貴人入獄", description: "甲為元帥，坐己墓，凶。" },
    "戊庚": { name: "天乙飛宮", description: "甲木元帥最怕庚金來克，故為大凶。" },
    "戊辛": { name: "青龍折足", description: "戊為甲子，辛為甲午，子午相衝屬凶。又因辛克甲木，故曰「折足」。" },
    "戊壬": { name: "青龍入牢", description: "壬為天牢，青龍遇之自然屬凶。" },
    "戊癸": { name: "青龍華蓋", description: "癸為天網，主躲藏。青龍遇之，可躲難避災。但躲成與否還要看九宮八門，故屬中。" },

    "己乙": { name: "墓神不明", description: "己為墓神，逢乙木剋之，凶。" },
    "己丙": { name: "火悖地戶", description: "己為地戶，丙為火，故名「火悖地戶」，凶。" },
    "己丁": { name: "朱雀入墓", description: "丁為朱雀，故曰「朱雀入墓」，凶。" },
    "己戊": { name: "犬遇青龍", description: "己為甲戌，逢戊甲青龍，故曰「犬遇青龍」，中。" },
    "己己": { name: "伏吟", description: "同干伏吟，墓庫重疊，主固執、停滯、反覆。" },
    "己庚": { name: "利名反格", description: "刑格反名，因刑格正好與其相反而得名。己土生庚金，故利主不利客。" },
    "己辛": { name: "遊魂入墓", description: "辛為白虎，藏於墓下，尤如墓地遊魂惡鬼，凶。" },
    "己壬": { name: "地網高張", description: "壬為地羅（網），墓地掛網，故為地網高張，凶。" },
    "己癸": { name: "地刑玄武", description: "癸為玄武。己土克癸水，故名「地刑玄武」，凶。" },

    "庚乙": { name: "合格", description: "庚乙相合本屬吉格。但合而化金，反助金力，日奇遭刑，凶。" },
    "庚丙": { name: "太白入熒", description: "金入火鄉，月奇遭刑，故為「太白入熒」，凶。" },
    "庚丁": { name: "破格", description: "金入火鄉，星奇遭刑，凶。" },
    "庚戊": { name: "天乙伏宮", description: "庚金克甲木元帥，大凶。" },
    "庚己": { name: "刑格", description: "己土生庚金，助庚金之力，大凶。" },
    "庚庚": { name: "伏吟戰格", description: "伏吟，也稱「戰格」，庚力倍增，大凶。" },
    "庚辛": { name: "白虎幹格", description: "庚辛二金互助，白虎之力大增，大凶。" },
    "庚壬": { name: "小格", description: "庚遇地羅，凶氣更增。壬主流動，庚主阻隔，此格也有行人難歸之意。大凶。" },
    "庚癸": { name: "大格", description: "癸為甲寅，庚為甲申，寅申相衝，大凶。" },

    "辛乙": { name: "白虎猖狂", description: "辛金克乙木，辛為白虎，故曰「白虎猖狂」，凶。" },
    "辛丙": { name: "干合悖師", description: "丙辛相合本屬吉，但丙奇落於辛金之下，故為中。" },
    "辛丁": { name: "獄神得奇", description: "丁為星奇，辛為獄神。丁火克辛金，故名「獄神得奇」，吉。" },
    "辛戊": { name: "困龍被傷", description: "甲子戊沖甲午辛，又因辛金克甲木，故名「被傷」，凶。" },
    "辛己": { name: "入墓自刑", description: "己為甲午辛之火墓。辛落己中，好比自己入墓受刑，故屬凶。" },
    "辛庚": { name: "白虎出力", description: "庚辛二金相助，然辛金在上，故要靠辛金白虎出力，凶。" },
    "辛辛": { name: "伏吟", description: "同干伏吟，金氣重疊，主固執、反覆、遲滯。" },
    "辛壬": { name: "凶蛇入獄", description: "壬為騰蛇，上臨天獄，故名「凶蛇入獄」，凶。" },
    "辛癸": { name: "天牢華蓋", description: "辛為天牢，癸為華蓋，故曰「天牢華蓋」，凶。" },

    "壬乙": { name: "小蛇得奇", description: "壬為騰蛇，得乙奇，故名「小蛇得奇」，吉。" },
    "壬丙": { name: "水蛇入火", description: "壬為蛇為水，入丙火之地，故名「水蛇入火」。又因水克火，故屬凶。" },
    "壬丁": { name: "干合蛇刑", description: "丁壬相合，合而化火，被水刑克，故曰「干合蛇刑」，凶。" },
    "壬戊": { name: "小蛇化龍", description: "壬為騰蛇，戊為青龍，蛇遇青龍且壬水生甲木，故吉。" },
    "壬己": { name: "凶蛇入墓", description: "己為墳墓。甲辰壬沖甲戌己，又因己土克壬水，凶。" },
    "壬庚": { name: "太白擒蛇", description: "庚為太白，壬蛇主疑惑，故此格為解疑持正之意。且壬為地羅，制住庚金，故此格屬吉格。" },
    "壬辛": { name: "騰蛇相纏", description: "辛金以甲辰壬為墓，且辛金生壬水，此使騰蛇之力倍顯，故屬凶。" },
    "壬壬": { name: "伏吟", description: "同干伏吟，水氣重疊，主沉溺、反覆、遲滯。" },
    "壬癸": { name: "幼女奸淫", description: "壬主奸，壬得癸相助使壬水之氣倍增，故曰「幼女奸淫」，凶。" },

    "癸乙": { name: "華蓋逢星", description: "甲寅癸為木之帝旺，下臨乙木好比星歸正位，故吉。" },
    "癸丙": { name: "華蓋悖師", description: "華蓋遇丙火自然名「華蓋悖師」，吉。" },
    "癸丁": { name: "騰蛇夭嬌", description: "丁奇本應合壬蛇，然癸水克丁火後丁已無法再去合壬，故壬蛇之力顯出，名為「騰蛇夭嬌」，凶。" },
    "癸戊": { name: "天乙會合", description: "戊癸相合，且癸水生甲木，故名「天乙會合」。但癸又主天網罩在甲上，所以此格還要看九宮八門吉凶而定。" },
    "癸己": { name: "華蓋地戶", description: "己為地戶，故曰「華蓋地戶」。己土克癸水，本屬凶，然癸主躲藏，己又主地戶，所以此格宜於藏身遁形。" },
    "癸庚": { name: "太白入網", description: "庚為太白，癸為天網，故曰「太白入網」。此格有天網擒太白之象，故此格內必然爭鬥不止。以中平論。" },
    "癸辛": { name: "網蓋天獄", description: "上有天網，下有天獄，故曰「網蓋天獄」，有在劫難逃之意，大凶。" },
    "癸壬": { name: "復見騰蛇", description: "甲辰壬為癸水之墓。癸既入墓，那隻有「復見騰蛇」了，凶。" },
    "癸癸": { name: "伏吟天網", description: "伏吟，也稱「天網格」，即上有天網，下也有天網之象，大凶。若臨癸時，則為「天網四張」格，最凶。" }
  };

  constructor() {
    this.patterns = QiMenSanQiLiuYiPattern.buildPatternMap();
  }

  /**
   * 將原始資料轉為完整格局物件 map
   * @returns {Object<string, Object>}
   */
  static buildPatternMap() {
    const map = {};
    const stems = QiMenSanQiLiuYiPattern.STEMS;

    stems.forEach(function (skyStem) {
      stems.forEach(function (earthStem) {
        const combination = skyStem + earthStem;
        const raw = QiMenSanQiLiuYiPattern.RAW_PATTERNS[combination];
        if (!raw) return;

        const level = raw.level
          || QiMenSanQiLiuYiPattern.LEVEL_OVERRIDES[combination]
          || QiMenSanQiLiuYiPattern.detectLevel(raw.name, raw.description, skyStem, earthStem);

        map[combination] = {
          skyStem: skyStem,
          earthStem: earthStem,
          combination: combination,
          name: raw.name,
          level: level,
          description: raw.description
        };
      });
    });

    return map;
  }

  /**
   * 依格局名稱與描述自動判斷吉凶等級（對照《奇門遁甲三奇六儀格局》用語）
   *
   * 判斷優先順序：
   *   1. 天網格 / 天網四張 / 最凶 → 大凶
   *   2. 戰格 → 大凶
   *   3. 大吉 / 属大吉 / 屬大吉
   *   4. 大凶 / 大兇
   *   5. 中平 / 以中平論 / 故屬中 / ，中。
   *   6. 属吉格 / 屬吉格 / 故吉 / ，吉。 / 吉格（排除「本屬吉」後的否定句）
   *   7. 故凶 / 故兇 / 凶格 / 兇格 / 屬凶 / 屬兇 / 為凶 / 為兇 / 自然為凶
   *   8. 同干伏吟 → 伏吟
   *   9. 預設中
   */
  static detectLevel(name, description, skyStem, earthStem) {
    const desc = String(description);
    const combination = skyStem + earthStem;

    // 特殊格局名稱
    if (/天網四張|天網格/.test(desc) || name.indexOf("天網") !== -1) return "大凶";
    if (/戰格/.test(name) || /戰格/.test(desc)) return "大凶";

    // 掃描描述尾段與全文的明確標記（先長後短，避免「大吉」被「吉」搶先）
    const rules = [
      { pattern: /属大吉|屬大吉|大吉/u, level: "大吉" },
      { pattern: /大凶|大兇/u, level: "大凶" },
      { pattern: /中平|以中平論|故屬中|，中。/u, level: "中" },
      { pattern: /属吉格|屬吉格|故吉|，吉。|吉格/u, level: "吉" },
      { pattern: /故凶|故兇|凶格|兇格|屬凶|屬兇|為凶|為兇|自然為凶|自然為兇|本屬凶|本屬兇/u, level: "凶" }
    ];

    for (let i = 0; i < rules.length; i++) {
      if (rules[i].pattern.test(desc)) return rules[i].level;
    }

    // 名稱含「吉」但描述已否定者（如「合格」「人遁吉格」）——以描述為準，上面已處理
    // 名稱單獨線索
    if (/大吉/.test(name)) return "大吉";
    if (/吉格|人遁/.test(name) && !/凶|兇/.test(desc)) return "吉";

    // 同干伏吟
    if (skyStem === earthStem) {
      if (name.indexOf("伏吟") !== -1 || desc.indexOf("伏吟") !== -1) return "伏吟";
      return "伏吟";
    }

    // 入墓、刑、破格等隱含凶意
    if (/入墓|被刑|破格|逃走|入地|入牢|折足|高張|相纏|投江|猖狂|出力/.test(name)) {
      return "凶";
    }

    return "中";
  }

  /** 正規化並驗證天干 */
  normalizeStem(stem) {
    const s = String(stem).trim();
    if (QiMenSanQiLiuYiPattern.STEMS.indexOf(s) === -1) return null;
    return s;
  }

  /** 組合 key，如 "乙" + "丙" => "乙丙" */
  makeKey(skyStem, earthStem) {
    const sky = this.normalizeStem(skyStem);
    const earth = this.normalizeStem(earthStem);
    if (!sky || !earth) return null;
    return sky + earth;
  }

  /**
   * 查詢格局
   * @param {string} skyStem  天盤天干
   * @param {string} earthStem 地盤天干
   * @returns {Object|null}
   */
  find(skyStem, earthStem) {
    const key = this.makeKey(skyStem, earthStem);
    if (!key) return null;
    const hit = this.patterns[key];
    return hit ? Object.assign({}, hit) : null;
  }

  /** 只回傳格局名稱 */
  findName(skyStem, earthStem) {
    const hit = this.find(skyStem, earthStem);
    return hit ? hit.name : null;
  }

  /** 只回傳解釋文字 */
  findDescription(skyStem, earthStem) {
    const hit = this.find(skyStem, earthStem);
    return hit ? hit.description : null;
  }

  /** level 為「大吉」或「吉」時回傳 true */
  isAuspicious(skyStem, earthStem) {
    const hit = this.find(skyStem, earthStem);
    if (!hit) return false;
    return hit.level === "大吉" || hit.level === "吉";
  }

  /**
   * 關鍵字搜尋（格局名稱或 description）
   * @returns {Array<Object>}
   */
  search(keyword) {
    const kw = String(keyword).trim();
    if (!kw) return [];

    return Object.keys(this.patterns)
      .filter((key) => {
        const p = this.patterns[key];
        return p.name.indexOf(kw) !== -1 || p.description.indexOf(kw) !== -1;
      })
      .map((key) => Object.assign({}, this.patterns[key]));
  }

  /** 回傳全部格局陣列 */
  getAll() {
    return Object.keys(this.patterns).map((key) => Object.assign({}, this.patterns[key]));
  }

  /** 回傳某一天盤天干的九種組合 */
  getBySkyStem(skyStem) {
    const sky = this.normalizeStem(skyStem);
    if (!sky) return [];
    return QiMenSanQiLiuYiPattern.STEMS
      .map((earth) => this.find(sky, earth))
      .filter(Boolean);
  }

  /** 回傳某一地盤天干相關的全部格局 */
  getByEarthStem(earthStem) {
    const earth = this.normalizeStem(earthStem);
    if (!earth) return [];
    return QiMenSanQiLiuYiPattern.STEMS
      .map((sky) => this.find(sky, earth))
      .filter(Boolean);
  }

  /** 依吉凶等級篩選 */
  getByLevel(level) {
    const lv = String(level).trim();
    return this.getAll().filter((p) => p.level === lv);
  }

  // ── 向下相容舊版 API ──────────────────────────────────────────

  /** @deprecated 請改用 find() */
  getPattern(tianPanGan, diPanGan) {
    const hit = this.find(tianPanGan, diPanGan);
    if (!hit) {
      return {
        found: false,
        key: String(tianPanGan) + "+" + String(diPanGan),
        message: "找不到此天干組合，請確認是否為乙、丙、丁、戊、己、庚、辛、壬、癸。"
      };
    }
    return Object.assign({ found: true, key: hit.combination, tianPanGan: hit.skyStem, diPanGan: hit.earthStem }, hit);
  }

  /** @deprecated 請改用 search() */
  searchByName(patternName) {
    return this.search(patternName);
  }

  /** @deprecated 請改用 getAll() */
  getAllPatterns() {
    return this.getAll();
  }

  /**
   * 格式化成報告用單行文字
   * @param {string} skyStem  天盤天干
   * @param {string} earthStem 地盤天干
   * @returns {string}
   */
  formatText(skyStem, earthStem) {
    const hit = this.find(skyStem, earthStem);
    if (!hit) return "";
    return hit.name + "（" + hit.level + "）" + hit.description;
  }
}

// 別名：建構函式（需 new 後才能呼叫 find）
var QimenSanQiLiuYi = QiMenSanQiLiuYiPattern;

/** 全域單例，避免重複建立 */
var _qimenSanQiLiuYiInstance = null;

function getQimenSanQiLiuYi() {
  if (!_qimenSanQiLiuYiInstance) {
    _qimenSanQiLiuYiInstance = new QiMenSanQiLiuYiPattern();
  }
  return _qimenSanQiLiuYiInstance;
}

/**
 * 依宮位資料（含 天盤天干、地盤天干）查三奇六儀格局並格式化
 * @param {Object} palaceInfo parseQiMenTableToJson() 的單宮 entry
 * @returns {string}
 */
function formatSanQiLiuYiFromPalace(palaceInfo) {
  if (!palaceInfo) return "無標示";
  const sky = palaceInfo.地盤天干;
  const earth = palaceInfo.地盤;
  if (!sky || !earth) return "無標示";
  const text = getQimenSanQiLiuYi().formatText(sky, earth);
  return text || "無標示";
}

/*
 * ── 使用範例 ────────────────────────────────────────────────
 *
 * const qimen = new QiMenSanQiLiuYiPattern();
 *
 * qimen.find("乙", "丙");
 * // level: "吉"（原文：屬吉格）
 *
 * qimen.find("戊", "丙");
 * // level: "大吉"（原文：青龍反首，大吉）
 *
 * qimen.find("庚", "庚");
 * // level: "大凶"（原文：戰格，大凶）
 *
 * qimen.find("乙", "乙");
 * // level: "伏吟"
 *
 * qimen.getByLevel("大吉");   // 戊丙、戊丁、丙戊
 * qimen.isAuspicious("壬", "庚"); // true（太白擒蛇，吉）
 */
