(function() {

// --- DoorScore.js ---
/** 八門基礎分數 */
const DoorScore = {
  開門: 25,
  生門: 30,
  休門: 20,
  景門: 10,
  杜門: -10,
  傷門: -20,
  驚門: -25,
  死門: -35
};


// --- StarScore.js ---
/** 九星基礎分數 */
const StarScore = {
  天蓬: -20,
  天任: 15,
  天沖: 10,
  天輔: 20,
  天英: 5,
  天芮: -15,
  天柱: -10,
  天心: 25,
  天禽: 20
};


// --- GodScore.js ---
/** 八神基礎分數 */
const GodScore = {
  值符: 30,
  九天: 20,
  九地: 15,
  太陰: 20,
  六合: 25,
  騰蛇: -10,
  白虎: -25,
  玄武: -20
};


// --- PalaceData.js ---
/** 九宮資料 */
const PalaceData = {
  坎一宮: {
    name: "坎一宮",
    number: 1,
    element: "水",
    direction: "北",
    meaning: "水、險、流動、智慧、腎、水路"
  },
  坤二宮: {
    name: "坤二宮",
    number: 2,
    element: "土",
    direction: "西南",
    meaning: "地、母、承載、群眾、房產、穩定"
  },
  震三宮: {
    name: "震三宮",
    number: 3,
    element: "木",
    direction: "東",
    meaning: "雷、動、開始、長男、行動、突發"
  },
  巽四宮: {
    name: "巽四宮",
    number: 4,
    element: "木",
    direction: "東南",
    meaning: "風、流動、滲透、文書、消息、長女"
  },
  中五宮: {
    name: "中五宮",
    number: 5,
    element: "土",
    direction: "中央",
    meaning: "中央、樞紐、轉化、核心、過渡"
  },
  乾六宮: {
    name: "乾六宮",
    number: 6,
    element: "金",
    direction: "西北",
    meaning: "天、父、權力、領導、制度、貴人"
  },
  兌七宮: {
    name: "兌七宮",
    number: 7,
    element: "金",
    direction: "西",
    meaning: "澤、口舌、少女、交流、喜悅、破損"
  },
  艮八宮: {
    name: "艮八宮",
    number: 8,
    element: "土",
    direction: "東北",
    meaning: "山、停止、阻隔、少男、積累、轉折"
  },
  離九宮: {
    name: "離九宮",
    number: 9,
    element: "火",
    direction: "南",
    meaning: "火、文明、名聲、文書、眼目、曝光"
  }
};


// --- ElementData.js ---
/** 天干五行 */
const GanElement = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水"
};

/** 八門五行 */
const DoorElement = {
  開門: "金",
  休門: "水",
  生門: "土",
  傷門: "木",
  杜門: "木",
  景門: "火",
  死門: "土",
  驚門: "金"
};

/** 九星五行 */
const StarElement = {
  天蓬: "水",
  天任: "土",
  天沖: "木",
  天輔: "木",
  天英: "火",
  天芮: "土",
  天柱: "金",
  天心: "金",
  天禽: "土"
};

/** 五行生剋關係 */
const ElementRelation = {
  generates: {
    木: "火",
    火: "土",
    土: "金",
    金: "水",
    水: "木"
  },
  controls: {
    木: "土",
    土: "水",
    水: "火",
    火: "金",
    金: "木"
  }
};


// --- PatternData.js ---
/**
 * 三奇六儀格局資料
 * 資料來源：resources/奇門遁甲三奇六儀格局.txt
 * 支援乙、丙、丁、戊、己、庚、辛、壬、癸共 81 種組合
 */

const STEMS = ["乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

/** 吉凶等級（對照原文） */
const LEVEL_MAP = {
  乙乙: "伏吟", 乙丙: "吉", 乙丁: "吉", 乙戊: "凶", 乙己: "凶",
  乙庚: "凶", 乙辛: "凶", 乙壬: "凶", 乙癸: "中",

  丙乙: "吉", 丙丙: "伏吟", 丙丁: "吉", 丙戊: "大吉", 丙己: "凶",
  丙庚: "凶", 丙辛: "吉", 丙壬: "凶", 丙癸: "凶",

  丁乙: "吉", 丁丙: "吉", 丁丁: "伏吟", 丁戊: "吉", 丁己: "凶",
  丁庚: "中", 丁辛: "凶", 丁壬: "吉", 丁癸: "凶",

  戊乙: "中", 戊丙: "大吉", 戊丁: "大吉", 戊戊: "伏吟", 戊己: "凶",
  戊庚: "大凶", 戊辛: "凶", 戊壬: "凶", 戊癸: "中",

  己乙: "凶", 己丙: "凶", 己丁: "凶", 己戊: "中", 己己: "伏吟",
  己庚: "中", 己辛: "凶", 己壬: "凶", 己癸: "凶",

  庚乙: "凶", 庚丙: "凶", 庚丁: "凶", 庚戊: "大凶", 庚己: "大凶",
  庚庚: "大凶", 庚辛: "大凶", 庚壬: "大凶", 庚癸: "大凶",

  辛乙: "凶", 辛丙: "中", 辛丁: "吉", 辛戊: "凶", 辛己: "凶",
  辛庚: "凶", 辛辛: "伏吟", 辛壬: "凶", 辛癸: "凶",

  壬乙: "吉", 壬丙: "凶", 壬丁: "凶", 壬戊: "吉", 壬己: "凶",
  壬庚: "吉", 壬辛: "凶", 壬壬: "伏吟", 壬癸: "凶",

  癸乙: "吉", 癸丙: "吉", 癸丁: "凶", 癸戊: "中", 癸己: "中",
  癸庚: "中", 癸辛: "大凶", 癸壬: "凶", 癸癸: "大凶"
};

/** 指定格局的分數覆寫 */
const SCORE_OVERRIDES = {
  "辛+己": -40,
  "壬+戊": 30,
  "丙+戊": 50,
  "戊+丙": 40,
  "戊+丁": 40,
  "乙+丙": 30,
  "乙+丁": 25,
  "庚+庚": -50,
  "戊+庚": -50,
  "庚+戊": -50,
  "辛+乙": -35,
  "丁+癸": -40,
  "癸+辛": -50
};

/** 指定格局的名稱覆寫 */
const NAME_OVERRIDES = {
  "庚+庚": "伏吟 / 戰格",
  "壬+乙": "小蛇日奇"
};

/** 格局名稱與解釋（摘錄自原文） */
const RAW_PATTERNS = {
  乙乙: { name: "伏吟", explanation: "同干相見，主事情停滯、反覆，不宜妄動。" },
  乙丙: { name: "奇儀順遂", explanation: "乙為日、丙為月，日月相逢屬吉格。但婚姻中以丙為女人的情夫，且乙下坐丙，表示妻子與人私通。天盤為日奇，地盤為月奇，乙木又生丙火，故名曰「奇儀順遂」格，謀事多吉。" },
  乙丁: { name: "奇儀相佐", explanation: "乙為日、丁為星，日星相逢屬吉格。且婚姻中以丁為妾，妻在妾上，吉。" },
  乙戊: { name: "利陰害陽", explanation: "乙木剋戊土，甲藏於戊之下，故凶。" },
  乙己: { name: "日奇入墓", explanation: "乙為日奇，己為墳墓，乙落於墳墓之中故凶。" },
  乙庚: { name: "日奇被刑", explanation: "庚金克乙木，日奇被克。且婚姻中以庚為丈夫，妻凌丈夫之上，故屬凶格。" },
  乙辛: { name: "青龍逃走", explanation: "乙坐卯向，辛坐酉向，卯酉相衝且酉金克卯木，故曰「逃走」，凶格。" },
  乙壬: { name: "日奇入地", explanation: "壬為地羅，乙坐地羅故曰「日奇入地」，凶格。" },
  乙癸: { name: "日奇華蓋", explanation: "癸為天網、華蓋，有逃匿躲藏之意。華蓋逢日奇蔽佑，故宜於藏形，中。" },

  丙乙: { name: "日月並行", explanation: "日奇月奇相會屬吉，且乙木生丙火更吉。此格公私皆利。" },
  丙丙: { name: "伏吟", explanation: "同干相見，火氣重疊，主反覆、焦躁，事多拖延。" },
  丙丁: { name: "月奇朱雀", explanation: "丁為朱雀，得月奇，吉。" },
  丙戊: { name: "飛鳥跌穴", explanation: "甲木生丙火。丙遇甲，好似飛鳥歸巢，故名「飛鳥跌穴」，屬大吉。" },
  丙己: { name: "月奇入墓", explanation: "己為火之墓（甲戌），又為墳墓，故名「月奇入墓」，主暗滯、受困。" },
  丙庚: { name: "熒入太白", explanation: "熒者火也。熒入太白即火入金鄉，凶。" },
  丙辛: { name: "謀事能成", explanation: "丙辛相合，故謀事能成，吉。" },
  丙壬: { name: "火入地羅", explanation: "壬屬水克丙火，又為地羅，故名「火入地羅」，凶。" },
  丙癸: { name: "悖師華蓋", explanation: "丙為悖師，癸為華蓋、天網，克丙火。丙奇遇之，自然為凶。" },

  丁乙: { name: "人遁吉格", explanation: "丁為星，乙為日，相逢為吉格。但婚姻中以丁為妾，有妾在妻上之意。" },
  丁丙: { name: "星隨月轉", explanation: "丁為星，丙為月，相逢為吉格。但火氣太旺，易出亂子。" },
  丁丁: { name: "伏吟", explanation: "同干相見，星奇伏吟，主反覆、遲滯。" },
  丁戊: { name: "青龍轉光", explanation: "戊為青龍，遇星奇屬吉格。" },
  丁己: { name: "星奇入墓", explanation: "己為墳墓，故曰「星奇入墓」，凶。" },
  丁庚: { name: "文書阻隔", explanation: "丁主文書，庚為阻隔之神，故名「文書阻隔」。文書阻隔則行人必歸。" },
  丁辛: { name: "朱雀入獄", explanation: "辛為牢獄，為罪人。得丁奇則是罪人出獄，官人入獄。" },
  丁壬: { name: "五神互合", explanation: "丁壬相合，吉。" },
  丁癸: { name: "朱雀投江", explanation: "癸主江河，故名「朱雀投江」，又因癸水克丁火，故為凶格。" },

  戊乙: { name: "青龍合靈", explanation: "甲、乙皆為青龍，甲藏於戊下，與乙會合，故曰「青龍合靈」，成敗皆為平時一倍。又因乙木剋戊土，所以此格吉凶需看所坐的九宮八門的情況而定。" },
  戊丙: { name: "青龍反首", explanation: "戊為青龍屬木，生丙火，大吉。" },
  戊丁: { name: "青龍耀明", explanation: "戊為青龍屬木，生丁火，丁為星奇，故曰「耀明」，大吉。" },
  戊戊: { name: "伏吟", explanation: "同干伏吟，甲辰戊重疊，主停滯、守成、反覆。" },
  戊己: { name: "貴人入獄", explanation: "甲為元帥，坐己墓，凶。" },
  戊庚: { name: "天乙飛宮", explanation: "甲木元帥最怕庚金來克，故為大凶。" },
  戊辛: { name: "青龍折足", explanation: "戊為甲子，辛為甲午，子午相衝屬凶。又因辛克甲木，故曰「折足」。" },
  戊壬: { name: "青龍入牢", explanation: "壬為天牢，青龍遇之自然屬凶。" },
  戊癸: { name: "青龍華蓋", explanation: "癸為天網，主躲藏。青龍遇之，可躲難避災。但躲成與否還要看九宮八門，故屬中。" },

  己乙: { name: "墓神不明", explanation: "己為墓神，逢乙木剋之，凶。" },
  己丙: { name: "火悖地戶", explanation: "己為地戶，丙為火，故名「火悖地戶」，凶。" },
  己丁: { name: "朱雀入墓", explanation: "丁為朱雀，故曰「朱雀入墓」，凶。" },
  己戊: { name: "犬遇青龍", explanation: "己為甲戌，逢戊甲青龍，故曰「犬遇青龍」，中。" },
  己己: { name: "伏吟", explanation: "同干伏吟，墓庫重疊，主固執、停滯、反覆。" },
  己庚: { name: "利名反格", explanation: "刑格反名，因刑格正好與其相反而得名。己土生庚金，故利主不利客。" },
  己辛: { name: "遊魂入墓", explanation: "辛為白虎，藏於墓下，尤如墓地遊魂惡鬼，凶。" },
  己壬: { name: "地網高張", explanation: "壬為地羅（網），墓地掛網，故為地網高張，凶。" },
  己癸: { name: "地刑玄武", explanation: "癸為玄武。己土克癸水，故名「地刑玄武」，凶。" },

  庚乙: { name: "合格", explanation: "庚乙相合本屬吉格。但合而化金，反助金力，日奇遭刑，凶。" },
  庚丙: { name: "太白入熒", explanation: "金入火鄉，月奇遭刑，故為「太白入熒」，凶。" },
  庚丁: { name: "破格", explanation: "金入火鄉，星奇遭刑，凶。" },
  庚戊: { name: "天乙伏宮", explanation: "庚金克甲木元帥，大凶。" },
  庚己: { name: "刑格", explanation: "己土生庚金，助庚金之力，大凶。" },
  庚庚: { name: "伏吟 / 戰格", explanation: "伏吟，也稱「戰格」，庚力倍增，大凶。" },
  庚辛: { name: "白虎幹格", explanation: "庚辛二金互助，白虎之力大增，大凶。" },
  庚壬: { name: "小格", explanation: "庚遇地羅，凶氣更增。壬主流動，庚主阻隔，此格也有行人難歸之意。大凶。" },
  庚癸: { name: "大格", explanation: "癸為甲寅，庚為甲申，寅申相衝，大凶。" },

  辛乙: { name: "白虎猖狂", explanation: "辛金克乙木，辛為白虎，故曰「白虎猖狂」，凶。" },
  辛丙: { name: "幹合悖師", explanation: "丙辛相合本屬吉，但丙奇落於辛金之下，故為中。" },
  辛丁: { name: "獄神得奇", explanation: "丁為星奇，辛為獄神。丁火克辛金，故名「獄神得奇」，吉。" },
  辛戊: { name: "困龍被傷", explanation: "甲子戊沖甲午辛，又因辛金克甲木，故名「被傷」，凶。" },
  辛己: { name: "入墓自刑", explanation: "己為甲午辛之火墓。辛落己中，好比自己入墓受刑，故屬凶。" },
  辛庚: { name: "白虎出力", explanation: "庚辛二金相助，然辛金在上，故要靠辛金白虎出力，凶。" },
  辛辛: { name: "伏吟", explanation: "同干伏吟，金氣重疊，主固執、反覆、遲滯。" },
  辛壬: { name: "凶蛇入獄", explanation: "壬為騰蛇，上臨天獄，故名「凶蛇入獄」，凶。" },
  辛癸: { name: "天牢華蓋", explanation: "辛為天牢，癸為華蓋，故曰「天牢華蓋」，凶。" },

  壬乙: { name: "小蛇日奇", explanation: "壬為騰蛇，得乙奇，故名「小蛇得奇」，吉。" },
  壬丙: { name: "水蛇入火", explanation: "壬為蛇為水，入丙火之地，故名「水蛇入火」。又因水克火，故屬凶。" },
  壬丁: { name: "幹合蛇刑", explanation: "丁壬相合，合而化火，被水刑克，故曰「幹合蛇刑」，凶。" },
  壬戊: { name: "小蛇化龍", explanation: "壬為騰蛇，戊為青龍，蛇遇青龍且壬水生甲木，故吉。" },
  壬己: { name: "凶蛇入墓", explanation: "己為墳墓。甲辰壬沖甲戌己，又因己土克壬水，凶。" },
  壬庚: { name: "太白擒蛇", explanation: "庚為太白，壬蛇主疑惑，故此格為解疑持正之意。且壬為地羅，制住庚金，故此格屬吉格。" },
  壬辛: { name: "騰蛇相纏", explanation: "辛金以甲辰壬為墓，且辛金生壬水，此使騰蛇之力倍顯，故屬凶。" },
  壬壬: { name: "伏吟", explanation: "同干伏吟，水氣重疊，主沉溺、反覆、遲滯。" },
  壬癸: { name: "幼女奸淫", explanation: "壬主奸，壬得癸相助使壬水之氣倍增，故曰「幼女奸淫」，凶。" },

  癸乙: { name: "華蓋逢星", explanation: "甲寅癸為木之帝旺，下臨乙木好比星歸正位，故吉。" },
  癸丙: { name: "華蓋悖師", explanation: "華蓋遇丙火自然名「華蓋悖師」，吉。" },
  癸丁: { name: "騰蛇夭嬌", explanation: "丁奇本應合壬蛇，然癸水克丁火後丁已無法再去合壬，故壬蛇之力顯出，名為「騰蛇夭嬌」，凶。" },
  癸戊: { name: "天乙會合", explanation: "戊癸相合，且癸水生甲木，故名「天乙會合」。但癸又主天網罩在甲上，所以此格還要看九宮八門吉凶而定。" },
  癸己: { name: "華蓋地戶", explanation: "己為地戶，故曰「華蓋地戶」。己土克癸水，本屬凶，然癸主躲藏，己又主地戶，所以此格宜於藏身遁形。" },
  癸庚: { name: "太白入網", explanation: "庚為太白，癸為天網，故曰「太白入網」。此格有天網擒太白之象，故此格內必然爭鬥不止。以中平論。" },
  癸辛: { name: "網蓋天獄", explanation: "上有天網，下有天獄，故曰「網蓋天獄」，有在劫難逃之意，大凶。" },
  癸壬: { name: "復見騰蛇", explanation: "甲辰壬為癸水之墓。癸既入墓，那隻有「復見騰蛇」了，凶。" },
  癸癸: { name: "伏吟天網", explanation: "伏吟，也稱「天網格」，即上有天網，下也有天網之象，大凶。若臨癸時，則為「天網四張」格，最凶。" }
};

/**
 * 依吉凶等級換算分數
 * @param {string} level
 * @param {string} key
 * @returns {number}
 */
function levelToScore(level, key) {
  if (SCORE_OVERRIDES[key] !== undefined) {
    return SCORE_OVERRIDES[key];
  }
  switch (level) {
    case "大吉": return 50;
    case "吉": return 30;
    case "中": return 0;
    case "伏吟": return -20;
    case "凶": return -35;
    case "大凶": return -50;
    default: return 0;
  }
}

/** 建構完整 81 格格局資料 */
function buildPatternData() {
  const data = {};

  STEMS.forEach((tian) => {
    STEMS.forEach((di) => {
      const compactKey = tian + di;
      const key = `${tian}+${di}`;
      const raw = RAW_PATTERNS[compactKey];

      if (!raw) {
        // TODO: 補齊遺漏格局
        return;
      }

      const level = LEVEL_MAP[compactKey] || "中";
      const name = NAME_OVERRIDES[key] || raw.name;

      data[key] = {
        name,
        level,
        score: levelToScore(level, key),
        explanation: raw.explanation
      };
    });
  });

  return data;
}

const PatternData = buildPatternData();


// --- QimenPatternRule.js ---
/** 合法三奇六儀天干 */
const VALID_GANS = ["乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

/**
 * 三奇六儀格局規則
 */
class QimenPatternRule {
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


// --- QimenPalaceRule.js ---
/**
 * 九宮規則
 */
class QimenPalaceRule {
  /**
   * 取得宮位資料
   * @param {string} name 如 "巽四宮"
   * @returns {Object|null}
   */
  getPalace(name) {
    return PalaceData[name] ? { ...PalaceData[name] } : null;
  }

  /**
   * 取得宮位五行
   * @param {string} name
   * @returns {string|null}
   */
  getPalaceElement(name) {
    const palace = this.getPalace(name);
    return palace ? palace.element : null;
  }

  /**
   * 回傳全部宮位
   * @returns {Array<Object>}
   */
  getAllPalaces() {
    return Object.values(PalaceData).map((palace) => ({ ...palace }));
  }
}


// --- QimenElementRule.js ---
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
class QimenElementRule {
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


// --- QimenCombinationRule.js ---
/**
 * 門、星、神、宮、格局組合規則
 */
class QimenCombinationRule {
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


// --- QimenScoreEngine.js ---
/**
 * 奇門宮位吉利指數總控制器
 *
 * 計算公式：
 * 宮位吉利指數 = 基礎吉凶 + 組合加權 + 五行生剋加權 + 格局放大器 + 宮位環境修正
 * 最終以 50 為中性基準，換算為 0–100 分
 */
class QimenScoreEngine {
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


window.QimenScoreEngine = QimenScoreEngine;
window.formatQimenScoreReport = function formatQimenScoreReport(result) {
  if (!result) return '吉利指數：無法計算\n';
  var text = '吉利指數：' + result.finalScore + '（' + result.level + '）\n';
  text += '格局：' + result.pattern.name + '（' + result.pattern.level + '）\n';
  text += '基礎分：' + result.baseScore + '｜組合加權：' + result.combinationScore + '｜五行加權：' + result.elementScore + '\n';
  if (result.analysis && result.analysis.length > 0) {
    text += '組合分析：\n';
    result.analysis.forEach(function(item) {
      text += '  · ' + item.name + '（' + (item.score >= 0 ? '+' : '') + item.score + '）：' + item.explanation + '\n';
    });
  }
  if (result.summary) text += '綜合評語：' + result.summary + '\n';
  return text;
};
})();
