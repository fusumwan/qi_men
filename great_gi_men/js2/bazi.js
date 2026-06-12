/**
 * =============================================================================
 * bazi.js — 八字大運、小運排盤模組
 * =============================================================================
 * 本檔案為奇門遁甲排盤系統的八字運勢層，依賴 jiqi.js 提供的節氣與四柱資料，
 * 主要功能：
 *   1. 依性別與年干陰陽，判斷大運順行或逆行
 *   2. 計算起運時間（三日折一歲）
 *   3. 排出小運（時柱递推）與大運（月柱递推，共 12 步 120 年）
 *   4. 提供干支轉索引工具（供奇門刻盤等用途）
 *
 * 八字運勢規則摘要：
 *   - 陽男、陰女：大運順行（順排月柱）
 *   - 陰男、陽女：大運逆行（逆排月柱）
 *   - 起運：出生至下一「節」（非中氣）的天數 ÷ 3 = 起運歲數
 *   - 小運：以時柱為起點，每年一柱，至交大運為止
 * =============================================================================
 */

// 若全域命名空間 QIMEN_STAR 尚未定義，則建立空物件
if(typeof(QIMEN_STAR) == "undefined") var QIMEN_STAR = {};
// 在 QIMEN_STAR 下建立 bazi 子模組，專責八字大運小運計算
QIMEN_STAR.bazi = {};
// 立即執行函式（IIFE），封裝內部邏輯，僅透過 _e 暴露公開 API
(function(_e) {
  // 啟用嚴格模式
  "use strict";

  /**
   * info — 八字運勢完整排盤（大運、小運、起運時刻）
   * @param {number} y,m,d,h,i,s - 出生年月日時分秒
   * @param {number} ms          - 出生毫秒
   * @param {number} _g          - 性別：1=男，0=女
   * @returns {Object} 含 bazi、small、start、start_text、big 等欄位
   */
  function info(y,m,d,h,i,s,ms,_g) {
    // 建立輸出物件，存放排盤結果
    var _out = new Object();

    // 呼叫 jiqi 模組，一次取得節氣、儒略日、八字等基礎資料
    var jiqi = QIMEN_STAR.jiqi.GetJiqiInfo(y,m,d,h,i,s,ms);
    // 性別：1 為男性，0 為女性（影響大運順逆）
    var gender = _g;
    // fcol：八字天干地支連續字串，每 2 字一柱
    // 索引對應： [0][1]年 [2][3]月 [4][5]日 [6][7]時 [8][9]分 …
    var fcol   = jiqi.bazi;
    // jtoday：出生時刻的儒略日（含時分秒小數）
    var jtoday = jiqi.julian;
    // jqpos：當前節氣在 jq0 陣列中的 0-based 索引（立春=0, 雨水=1, …）
    // currentJiqiIdx 為 1-based，故減 1
    var jqpos  = jiqi.currentJiqiIdx - 1;
    // jqTime：該節氣年 24 節氣的儒略日陣列副本（避免修改原始資料）
    var jqTime = jiqi.wholeYear.slice();

    // 將八字字串寫入輸出
    _out.bazi = jiqi.bazi;

    // ── 起大運：判斷順行或逆行 ──
    // 依年干判斷陰陽年：
    //   甲丙戊庚壬（索引 0,2,4,6,8）→ (索引+1)%2=1 → 陽年
    //   乙丁己辛癸（索引 1,3,5,7,9）→ (索引+1)%2=0 → 陰年
    // posneg：0=陰年，1=陽年
    var posneg = ("甲乙丙丁戊己庚辛壬癸".indexOf(fcol.charAt(0))+1) % 2;
    // start_time：出生至目標節氣的天數差（用於起運計算），單位：日
    var start_time = 0;

    // 陽男、陰女 → 大運順行（順排月柱，找「下一個節」）
    if((gender == 1 && posneg == 1) || (gender == 0 && posneg == 0)) {
      // jqpos2：目標節氣索引
      // 若當前在「節」（偶數 index：立春0、驚蟄2…），跳 2 格到下一節
      // 若當前在「氣」（奇數 index：雨水1、春分3…），跳 1 格到下一節
      var jqpos2 = jqpos + (jqpos%2 == 0 ? 2 : 1);
      // 若超出當年節氣表（>23），則取下一年立春（index 0）
      if(jqpos2 > 23) {
        jqpos2 = 0;
        // 重新計算下一節氣年的 24 節氣 JD
        QIMEN_STAR.jiqi.CalJiqiByYear(y+1,m,d,h,i,s,jqTime);
      }
      // 順行：目標節氣時刻 - 出生時刻 = 距下一節的天數
      start_time = jqTime[jqpos2] - jtoday;
    }
    // 陰男、陽女 → 大運逆行（逆排月柱，找「上一個節」）
    else {
      // 若當前在「節」（偶數 index），往回找同節（減 0，即當前節）
      // 若當前在「氣」（奇數 index），往回 1 格到上一節
      var jqpos2 = jqpos - (jqpos%2 == 0 ? 0 : 1);
      // 若小於 0，則取上一年小寒（index 22）
      if(jqpos2 < 0) {
        jqpos2 = 22;
        QIMEN_STAR.jiqi.CalJiqiByYear(y-1,m,d,h,i,s,jqTime);
      }
      // 逆行：出生時刻 - 目標節氣時刻 = 距上一節的天數
      start_time = jtoday - jqTime[jqpos2];
    }

    // ── 計小運 ──
    // 古法：三日折一歲，start_time（天）÷ 3 = 起運前的年數（小運年數）
    var start_small = start_time / 3;
    _out.small = new Array();
    if(start_small < 1) {
      // 不足 1 歲即交大運，無小運可排
      _out.small.push("即年入大運");
    } else {
      // 小運以「時柱」為起點递推（非月柱）
      var tinIdx = "甲乙丙丁戊己庚辛壬癸".indexOf(fcol[6]);  // 時干索引
      var deiIdx = "子丑寅卯辰巳午未申酉戌亥".indexOf((fcol[7])); // 時支索引
      // 陽男、陰女：小運順行（時柱往後推）
      if((gender==1 && posneg==1) || (gender==0 && posneg==0))
        for(var i = 1; i <= start_small; i++) {
          _out.small.push(
            "甲乙丙丁戊己庚辛壬癸".charAt((tinIdx+i)%10) +   // 時干順推 i 步
            "子丑寅卯辰巳午未申酉戌亥".charAt((deiIdx+i)%12)  // 時支順推 i 步
          );
        }
      // 陰男、陽女：小運逆行（時柱往前推）
      else
        for(var i = 1; i <= start_small; i++) {
          _out.small.push(
            "甲乙丙丁戊己庚辛壬癸".charAt((tinIdx-i+10)%10) +  // +10 避免負數
            "子丑寅卯辰巳午未申酉戌亥".charAt((deiIdx-i+12)%12) // +12 避免負數
          );
        }
    }

    // ── 計大運起始時刻（儒略日）──
    // 將「距節氣天數」換算為「年數」，再加到出生 JD，得交大運的儒略日
    // 365.25：一個回歸年的平均天數
    start_time = jtoday + 365.25 * (start_time / 3.0);
    _out.start = start_time;                                    // 起運儒略日（數值）
    _out.start_text = QIMEN_STAR.jiqi.JTime(start_time);        // 起運時刻（中文格式）

    // ── 計大運（12 步 × 10 年 = 120 年）──
    // 註：120 年大限亦見於吠陀占星、法達星限等古老曆法系統
    _out.big = new Array();
    // 大運以「月柱」為起點递推
    var tinIdx = "甲乙丙丁戊己庚辛壬癸".indexOf(fcol[2]);  // 月干索引
    var deiIdx = "子丑寅卯辰巳午未申酉戌亥".indexOf((fcol[3])); // 月支索引

    // 陽男、陰女：大運順行（月柱往後推 12 步）
    if((gender==1 && posneg==1) || (gender==0 && posneg==0)) {
      for(var i = 1; i < 13; i++) {
        _out.big.push(
          "甲乙丙丁戊己庚辛壬癸".charAt((tinIdx+i)%10)+   // 月干順推
          "子丑寅卯辰巳午未申酉戌亥".charAt((deiIdx+i)%12)  // 月支順推
        );
      }
    }
    // 陰男、陽女：大運逆行（月柱往前推 12 步）
    else {
      for(var i = 1; i < 13; i++) {
        var _tmp = (tinIdx-i)%10;
        if(_tmp < 0) _tmp += 10;  // 天干逆推時處理負索引
        var tcol = "甲乙丙丁戊己庚辛壬癸".charAt(_tmp);
        var _tmp = (deiIdx-i)%12;
        if(_tmp < 0) _tmp += 12;  // 地支逆推時處理負索引
        var dcol = "子丑寅卯辰巳午未申酉戌亥".charAt(_tmp);
        _out.big.push(tcol+dcol);
      }
    }

    // 回傳完整排盤結果物件
    return _out;
  }

  /**
   * _gz2idx — 將干支對轉換為奇門用數值索引
   * @param {string} gz - 兩字干支，如「甲子」
   * @returns {number} 索引值（0–59 範圍內的編碼）
   *
   * 演算法說明：
   *   1. 取天干、地支在十天干、十二地支中的索引
   *   2. 依天干數，將地支逆推至「旬首」對應的地支
   *   3. 在「子戌申午辰寅」六陽支中找該旬首地支的位置
   *   4. 回傳：旬位 × 10 + 天干索引
   *
   * 此編碼與六甲旬首（甲子、甲戌、甲申、甲午、甲辰、甲寅）對應，
   * 供奇門遁甲排盤時定位干支在六旬中的位置。
   */
  function _gz2idx(gz)
  {
    // g1：天干索引（甲=0, 乙=1, …, 癸=9）
    var g1 = "甲乙丙丁戊己庚辛壬癸".indexOf(gz[0]);
    // z1：地支索引（子=0, 丑=1, …, 亥=11）
    var z1 = "子丑寅卯辰巳午未申酉戌亥".indexOf(gz[1]);
    // 將地支逆推 g1 步，得該干支所屬「旬」的地支（旬首地支）
    var a = g1, b = z1;
    while(a > 0) { a--; b--; if(b < 0) b+=12; }
    // s：旬首地支在「子戌申午辰寅」六陽支序列中的位置（0–5）
    var s = "子戌申午辰寅".indexOf("子丑寅卯辰巳午未申酉戌亥"[b]);
    // 回傳編碼：旬位 × 10 + 天干索引
    return s*10 + g1;
  }

  /*
   * 以下為開發測試用程式碼（已註解）：
   * 以當前系統時間排盤，性別設為 1（男）
   */
  //var d = new Date();
  //console.log(info(d.getFullYear(),d.getMonth()+1,d.getDate(),d.getHours(),d.getMinutes(),d.getSeconds(),d.getMilliseconds(),1));

  /** info — 公開 API：八字運勢排盤 */
  _e.info = function(y,m,d,h,i,s,ms,_g) {
    return info(y,m,d,h,i,s,ms,_g);
  };

  /** gz2idx — 公開 API：干支轉奇門索引 */
  _e.gz2idx = _gz2idx;

// 若 QIMEN_STAR.bazi 已存在則沿用，否則傳入空物件
})(QIMEN_STAR.bazi || {});
