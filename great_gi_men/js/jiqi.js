/**
 * =============================================================================
 * jiqi.js — 節氣與八字排盤核心模組
 * =============================================================================
 * 本檔案為奇門遁甲排盤系統的天文曆法底層，主要功能：
 *   1. 依天文算法計算二十四節氣的精確時刻（儒略日）
 *   2. 將格里曆（公曆）與儒略日互相轉換
 *   3. 依節氣定月柱、依子初換日定日柱，排出八字（含時分秒及毫秒細柱）
 *   4. 計算刻分（奇門用時）
 *
 * 玄學背景：
 *   - 二十四節氣依太陽黃經每 15° 劃分，是八字「以節定月」的依據
 *   - 八字年柱以「立春」為歲首，非正月初一
 *   - 月柱以「節」換月（立春、驚蟄…），「氣」不換月（雨水、春分…）
 * =============================================================================
 */

// 若全域命名空間 QIMEN_STAR 尚未定義，則建立空物件，避免與其他模組衝突
if(typeof(QIMEN_STAR) == "undefined") var QIMEN_STAR = {};
// 在 QIMEN_STAR 下建立 jiqi 子模組，專責節氣與八字計算
QIMEN_STAR.jiqi = {};
// 立即執行函式（IIFE），將內部函式封裝，僅透過 _e 暴露公開 API
(function(_e) {
  // 啟用嚴格模式，避免隱式全域變數、重複參數名等常見錯誤
  "use strict";

  /**
   * jq — 內部計算用節氣名稱陣列（共 24 項）
   * 排列順序以「春分」為起點（index 0），對應天文算法中太陽黃經 0° 的春分點。
   * 天文上節氣由春分起算，每相隔 15° 黃經為一節氣。
   */
  var jq = new Array("春分", "清明", "穀雨", "立夏", "小滿", "芒種", "夏至", "小暑", "大暑", "立秋", "處暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪",   "冬至", "小寒", "大寒", "立春", "雨水", "驚蟄");

  /**
   * jq0 — 輸出用節氣名稱陣列（共 24 項）
   * 排列順序以「立春」為起點（index 0），符合中國傳統曆法與八字排盤慣例。
   * 八字以立春換年，月柱亦從立春後的寅月開始。
   * 與 jq 的差異：同一節氣名稱，index 不同，需透過轉換函式對應。
   */
  var jq0 = new Array("立春", "雨水", "驚蟄","春分", "清明", "穀雨", "立夏", "小滿", "芒種", "夏至", "小暑", "大暑", "立秋", "處暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪",   "冬至", "小寒", "大寒" );

  /***
   * 以下三組陣列為行星攝動（Perturbation）計算係數，現已移入 Perturbation 函式內部。
   * ptsa：各週期項振幅（秒）
   * ptsb：各週期項初相位（度）
   * ptsc：各週期項角頻率係數
   ***/
  //this.ptsa = new Array(485, 203, 199, 182, 156, 136, 77, 74, 70, 58, 52, 50, 45, 44, 29, 18, 17, 16, 14, 12, 12, 12, 9, 8);
  //this.ptsb = new Array(324.96, 337.23, 342.08, 27.85, 73.14, 171.52, 222.54, 296.72, 243.58, 119.81, 297.17, 21.02, 247.54, 325.15, 60.93, 155.12, 288.79, 198.04, 199.76, 95.39, 287.11, 320.81, 227.73, 15.45);
  //this.ptsc = new Array(1934.136, 32964.467, 20.186, 445267.112, 45036.886, 22518.443, 65928.934, 3034.906, 9037.513, 33718.147, 150.678, 2281.226, 29929.562, 31555.956, 4443.417, 67555.328, 4562.452, 62894.029, 31436.921, 14577.848, 31931.756, 34777.259, 1222.114, 16859.074);

  // jdez：儲存各節氣的平均儒略日（未經攝動與 ΔT 修正），最多 30 個位置
  var jdez = new Array(30);
  // jdjq：儲存經攝動、ΔT、時區修正後的最終節氣儒略日，最多 26 個位置
  var jdjq=new Array(26);

  /**
   * date_to_julian_day — 格里曆轉儒略日（簡化公式版）
   * @param {number} y - 西元年
   * @param {number} m - 月份（1–12）
   * @param {number} d - 日期
   * @returns {number} 當日 0 時的儒略日數（不含時分秒小數）
   *
   * 儒略日（JD）為天文學連續計日法，起算點為公元前 4713 年 1 月 1 日正午。
   * 八字與節氣計算皆以 JD 為中介，避免閏年、月份天數差異造成誤差。
   */
  function date_to_julian_day(y,m,d) {
    "use strict";
    // 將 1、2 月視為前一年的第 13、14 月，使公式適用全年
    var a = parseInt((14 - m) / 12);
    // 調整年份：加 4800 為算法常數，減 a 補償月份前移
    var y = y + 4800 - a;
    // 調整月份：加 12*a 再減 3，轉為以 3 月為起點的連續月序
    var m = m + 12*a - 3;
    // 格里曆儒略日標準公式（適用 1582-10-15 之後）
    return d + parseInt((153*m + 2)/5) + 365*y + parseInt(y/4) - parseInt(y/100) + parseInt(y/400) - 32045;
  }

  /**
   * date_to_julian_day2 — 格里曆轉儒略日（進階版，支援曆法改革與時分）
   * @param {number} yr - 西元年
   * @param {number} mh - 月份
   * @param {number} dy - 日期
   * @returns {number|false} 儒略日（含小數時分），超出範圍回傳 false
   *
   * 本函式為排盤主用版本，能處理 1582 年格里曆改革前後的差異。
   */
  function date_to_julian_day2(yr,mh,dy) {
    "use strict";
    // 時分預設為 0（本函式僅傳年月日，時分由 date_to_julian_time 另行加入）
    var hr = 0;
    // op：強制使用新曆算法的開關，預設 false
    var op = false;
    // 年份超出 ±40 萬年則無法計算，回傳 false
    if(yr<-400000 || yr>400000) return false;
    // yp：調整年值，將 1–2 月歸入前一年度（曆法慣例）
    var yp=yr+Math.floor((mh-3)/10);
    // 1582-10-15 之後，或強制新曆：採用含百年閏年修正的格里曆算法
    if(((yr>1582) || (yr==1582 && mh>10) || (yr==1582 && mh==10 && dy>=15)) || op){
      var init=1721119.5;  // 新曆儒略日起算常數
      // 含四年一閏、百年不閏、四百年再閏的完整修正
      var jdy=Math.floor(yp*365.25)-Math.floor(yp/100)+Math.floor(yp/400);
    }
    else{
      // 1582-10-04 之前：採用舊儒略曆（僅四年一閏）
      if((yr<1582) || (yr==1582 && mh<10) || (yr==1582 && mh==10 && dy<=4)){
        var init=1721117.5;  // 舊曆儒略日起算常數
        var jdy=Math.floor(yp*365.25);
      }
      else {
        // 1582-10-05 至 1582-10-14 為曆法空白期，無法轉換
        return false;
      }
    }
    // mp：將月份轉為 0–11 的月序（以 3 月為 0）
    var mp=Math.floor(mh+9)%12;
    // jdm：該月已過天數的近似值（30 天月制近似公式）
    var jdm=mp*30+Math.floor((mp+1)*34/57);
    // jdd：當月日期減 1（因日起算為 0）
    var jdd=dy-1;
    // jdh：時分轉換為日的小數部分（hr=0 時為 0）
    var jdh=hr/24;
    // 合併年、月、日、時，加上基準常數，得完整儒略日
    var jd=jdy+jdm+jdd+jdh+init;
    return jd;
  }

  /**
   * date_to_julian_time — 將時分秒轉為儒略日的小數部分
   * @param {number} h - 時（0–23）
   * @param {number} i - 分（0–59）
   * @param {number} s - 秒（0–59）
   * @returns {number} 當日時分秒佔一整天的比例（0–1 之間的小數）
   *
   * 一天 = 86400 秒；此值加在整數 JD 上，即得含時刻的精確儒略日。
   * 奇門、八字換日、換時皆依此精度判斷。
   */
  function date_to_julian_time(h,i,s) {
    // 將時分秒統一換算為秒數，再除以 86400 得日的小數
    return ((h * 3600) + (i * 60) + s) /86400;
  }

  /**
   * VE — 計算指定年份的「春分點」儒略日（Vernal Equinox）
   * @param {number} yy - 西元年
   * @returns {number|false} 該年春分的儒略日，超出範圍回傳 false
   *
   * 春分為太陽黃經 0°，是天文節氣計算的起點。
   * 八字雖以立春換年，但底層天文算法仍從春分點反推全年 24 節氣時刻。
   */
  function VE(yy) {
    var yx=yy;       // 工作用年份副本
    var jdve = 0;    // 春分儒略日結果
    // 公元 1000–8001 年：採用現代天文多項式擬合公式
    if(yx>=1000 && yx<=8001){
      var m=(yx-2000)/1000;  // 以 2000 年為基準的千年尺度變量
      // 五次多項式逼近春分時刻（係數來自天文曆表）
      jdve=2451623.80984+365242.37404*m+0.05169*m*m-0.00411*m*m*m-0.00057*m*m*m*m;
    }
    else{
      // 公元前 8000 年至公元 999 年：採用另一組歷史擬合係數
      if(yx>=-8000 && yx<1000){
        m=yx/1000;
        jdve=1721139.29189+365242.1374*m+0.06134*m*m+0.00111*m*m*m-0.00071*m*m*m*m;
      }
      else{
        // 超出算法有效範圍，無法計算
        return false;
      }
    }
    return jdve;
  };

  /**
   * Perturbation — 計算行星攝動對節氣時刻的微調量
   * @param {number} jdez - 該節氣的平均儒略日
   * @returns {number} 攝動修正量（單位：日）
   *
   * 地球公轉並非完美橢圓，受月球、木星等引力攝動影響，
   * 節氣時刻需疊加此修正，才能與實際天象吻合。
   */
  function Perturbation(jdez){
    // t：自 J2000.0（JD 2451545）起算的儒略世紀數
    var t=(jdez-2451545)/36525;
    var s=0;  // 累加各週期攝動項
    // 24 組傅立葉級數係數：振幅、初相位、角頻率
    var ptsa = new Array(485, 203, 199, 182, 156, 136, 77, 74, 70, 58, 52, 50, 45, 44, 29, 18, 17, 16, 14, 12, 12, 12, 9, 8);
    var ptsb = new Array(324.96, 337.23, 342.08, 27.85, 73.14, 171.52, 222.54, 296.72, 243.58, 119.81, 297.17, 21.02, 247.54, 325.15, 60.93, 155.12, 288.79, 198.04, 199.76, 95.39, 287.11, 320.81, 227.73, 15.45);
    var ptsc = new Array(1934.136, 32964.467, 20.186, 445267.112, 45036.886, 22518.443, 65928.934, 3034.906, 9037.513, 33718.147, 150.678, 2281.226, 29929.562, 31555.956, 4443.417, 67555.328, 4562.452, 62894.029, 31436.921, 14577.848, 31931.756, 34777.259, 1222.114, 16859.074);
    // 對 24 個週期項求和：振幅 × cos(相位 + 頻率×t)
    for(var k=0;k<=23;k++){
      s=s+ptsa[k]*Math.cos(ptsb[k]*2*Math.PI/360+ptsc[k]*2*Math.PI/360*t);
    }
    // w：地球軌道長軸方向相關角度，用於調整攝動幅度
    var w=35999.373*t-2.47;
    // l：軌道偏心率引起的振幅調制因子
    var l=1+0.0334*Math.cos(w*2*Math.PI/360)+0.0007*Math.cos(2*w*2*Math.PI/360);
    // 最終攝動修正（秒轉換為日的比例：×0.00001，再除以 l）
    var ptb=0.00001*s/l;
    return ptb;
  };

  /**
   * DeltaT — 計算力學時（TD/TT）與世界時（UT）的差值
   * @param {number} yy - 西元年
   * @param {number} mm - 月份（用於內插，提高精度）
   * @returns {number} ΔT，單位：分鐘
   *
   * 天文計算用均勻力學時，民用曆法用地球自轉不均的世界時，
   * 兩者差值隨年代變化（地球自轉減速），排盤時必須扣除 ΔT 才得地方平時。
   */
  function DeltaT(yy , mm ){
    var u, t, dt, y;
    // y：將月份折算入年份的小數（年中為 0.5 月偏移）
    y = yy + (mm - 0.5) / 12;

    // 依不同年代區間，採用對應的多項式或經驗公式
    if(y<=-500){
      u = (y - 1820) / 100;
      dt = (-20 + 32*u*u);}
    else{if(y< 500){
      u = y / 100;
      dt=(10583.6-1014.41*u+33.78311*u*u-5.952053*u*u*u-0.1798452*u*u*u*u+0.022174192*u*u*u*u*u+0.0090316521*u*u*u*u*u*u);}
    else{if(y<1600){
      u = (y - 1000) / 100;
      dt = (1574.2-556.01*u+71.23472*u*u+0.319781*u*u*u-0.8503463*u*u*u*u-0.005050998*u*u*u*u*u+ 0.0083572073*u*u*u*u*u*u);}
    else{if(y<1700){
      t = y - 1600;
      dt = (120 - 0.9808 * t - 0.01532 * t*t + t*t*t / 7129);}
    else{if(y<1800){
      t = y - 1700;
      dt = (8.83 + 0.1603 * t - 0.0059285 * t*t + 0.00013336 * t*t*t - t*t*t*t / 1174000);}
    else{if(y<1860){
      t = y - 1800;
      dt=(13.72-0.332447*t+0.0068612*t*t+0.0041116*t*t*t-0.00037436*t*t*t*t+0.0000121272*t*t*t*t*t-0.0000001699*t*t*t*t*t*t+ 0.000000000875*t*t*t*t*t*t*t);}
    else{if(y<1900){
      t = y - 1860;
      dt = (7.62 + 0.5737 * t - 0.251754 * t*t + 0.01680668 * t*t*t - 0.0004473624 * t*t*t*t + t*t*t*t*t / 233174);}
    else{if(y<1920){
      t = y - 1900;
      dt = (-2.79 + 1.494119 * t - 0.0598939 * t*t + 0.0061966 * t*t*t - 0.000197 * t*t*t*t);}
    else{if(y<1941){
      t = y - 1920;
      dt = (21.2 + 0.84493 * t - 0.0761 * t*t + 0.0020936 * t*t*t);}
    else{if(y<1961){
      t = y - 1950;
      dt = (29.07 + 0.407 * t - t*t / 233 + t*t*t / 2547);}
    else{if(y<1986){
      t = y - 1975;
      dt = (45.45 + 1.067 * t - t*t / 260 - t*t*t / 718);}
    else{if(y<2005){
      t = y - 2000;
      dt = (63.86 + 0.3345 * t - 0.060374 * t*t + 0.0017275 * t*t*t + 0.000651814 * t*t*t*t + 0.00002373599 * t*t*t*t*t);}
    else{if(y<2050){
      t = y - 2000;
      dt = (62.92 + 0.32217 * t + 0.005589 * t*t);}
    else{if(y<2150){
      u = (y - 1820) / 100;
      dt = (-20 + 32*u*u-0.5628*(2150 - y));}
    else{
      u = (y - 1820) / 100;
      dt = (-20 + 32*u*u);}}}}}}}}}}}}}}

    // 1955–2005 年區間外，額外疊加二次修正項
    if(y<1955 || y>=2005) dt=dt-(0.000012932*(y-1955)*(y-1955));
    // dt 原為秒，除以 60 轉為分鐘
    var DeltaT = dt / 60;
    return DeltaT;
  }

  /**
   * MeanJQJD — 由春分點推算各節氣的平均儒略日（開普勒橢圓模型）
   * @param {number} yy   - 年份
   * @param {number} jdve - 該年春分儒略日
   * @param {number} ty   - 回歸年長（天）
   * @param {number} ini  - 起始節氣索引
   * @param {number} num  - 計算節氣數量
   * @returns {boolean} 固定回傳 true
   *
   * 將黃道均分 24 等份（每份 15°），依地球軌道偏心率修正，
   * 得出各節氣的「平均」時刻，寫入全域陣列 jdez。
   */
  function MeanJQJD(yy,jdve,ty,ini,num){
    var ath=2*Math.PI/24;  // 相鄰節氣的角距：2π/24 = 15°
    // tx：自 J2000 起算的萬年尺度時間變量
    var tx=(jdve-2451545)/365250;
    // e：地球軌道偏心率（隨時間微變）
    var e=0.0167086342-0.0004203654*tx-0.0000126734*tx*tx+0.0000001444*tx*tx*tx-0.0000000002*tx*tx*tx*tx+0.0000000003*tx*tx*tx*tx*tx;
    var tt=yy/1000;
    // vp：近日點黃經（度），決定節氣在軌道上的分布
    var vp=111.25586939-17.0119934518333*tt-0.044091890166673*tt*tt-4.37356166661345E-04*tt*tt*tt+8.16716666602386E-06*tt*tt*tt*tt;
    var rvp=vp*2*Math.PI/360;  // 近日點黃經轉弧度
    var peri = new Array(30);    // 各節氣自春分到達的天數
    var i;
    // 第一階段：計算每個節氣對應的平黃經，再經開普勒方程轉為時間
    for(i=1;i<=(ini+num);i++){
      var flag=0;  // 象限修正旗標
      // th：第 i 個節氣的平黃經（弧度），加近日點修正
      var th=ath*(i-1)+rvp;
      // 第二、三象限需做角度反射修正（開普勒方程對稱性）
      if(th>Math.PI && th<=3*Math.PI){
        th=2*Math.PI-th;
        flag=1;
      }
      if(th>3*Math.PI){
        th=4*Math.PI-th;
        flag=2;
      }
      // f1：偏近點角相關項；f2：偏心率修正項
      var f1=2*Math.atan((Math.sqrt((1-e)/(1+e))*Math.tan(th/2)));
      var f2=(e*Math.sqrt(1-e*e)*Math.sin(th))/(1+e*Math.cos(th));
      // f：該節氣在回歸年中所佔天數
      var f=(f1-f2)*ty/2/Math.PI;
      if(flag==1) f=ty-f;      // 第二象限修正
      if(flag==2) f=2*ty-f;    // 第四象限修正
      peri[i]=f;
    }
    // 第二階段：以春分為基準，累加得天數差，寫入 jdez
    for(i=ini;i<=(ini+num);i++){
      jdez[i]=jdve+peri[i]-peri[1];
    }
    return true;
  };

  /**
   * GetAdjustedJQ — 取得經攝動、ΔT、時區修正後的節氣儒略日
   * @param {number} yy   - 年份
   * @param {number} ini  - 起始節氣索引（天文序，春分=0）
   * @param {number} num  - 計算節氣數量
   * @param {Array}  jdjq - 輸出陣列，存放修正後儒略日
   *
   * 此為節氣計算的核心整合函式，串接 VE → MeanJQJD → Perturbation → DeltaT → 時區。
   */
  function GetAdjustedJQ(yy, ini, num, jdjq){
    var veb= VE(yy);              // 該年春分儒略日
    var ty= VE(yy+1)-veb;         // 回歸年長 = 下年春分 - 今年春分
    if(MeanJQJD(yy,veb,ty,ini,num)==true){
      for(var i=ini+1;i<=(ini+num);i++){
        var ptb= Perturbation(jdez[i]);              // 行星攝動修正（日）
        // Math.floor(i/2)+3：依節氣序估算月份，供 ΔT 內插
        var dt= DeltaT(yy,Math.floor(i/2)+3);        // ΔT（分鐘）
        // 平均儒略日 + 攝動 - ΔT（分→日）= 世界時儒略日
        jdjq[i]= jdez[i]+ptb-dt/60/24;
        // 加上時區偏移（預設東八區 +8 小時 = 8/24 日）
        jdjq[i]=jdjq[i]+_e.timezone;
      }
    }
  }

  /**
   * GetPureJQsinceSpring2 — 重排節氣為「立春起算」的 24 節氣儒略日陣列
   * @param {number} yy    - 西元年
   * @param {*}      ptsa   - 保留參數（未使用，相容舊介面）
   * @param {*}      ptsb   - 保留參數（未使用）
   * @param {*}      ptsc   - 保留參數（未使用）
   * @param {Array}  jdpjq  - 輸出陣列，jdpjq[0]=立春, jdpjq[23]=大寒
   *
   * 八字、奇門皆以立春為年界，月柱亦依「節」換月，
   * 故須將天文算法（春分起）的結果重排為曆法順序（立春起）。
   */
  function GetPureJQsinceSpring2(yy, ptsa,ptsb,ptsc, jdpjq){
    var sjdjq=new Array;  // 暫存天文序節氣儒略日
    var yea = yy - 1;
    // 取前一年第 22–24 節氣（立春、雨水、驚蟄），因這三氣在該年立春前已屬新年
    GetAdjustedJQ(yea, 21, 3, sjdjq);
    // 重排 index：立春=0, 雨水=1, 驚蟄=2
    jdpjq[0] =sjdjq[22];  // 立春
    jdpjq[1] =sjdjq[23];  // 雨水
    jdpjq[2] =sjdjq[24];  // 驚蟄
    yea = yy;
    // 取該年春分起至年底全部 26 個節氣（含跨年前後）
    GetAdjustedJQ(yea, 0, 26, sjdjq);
    // 將春分(驚蟄後)至小寒的節氣填入 jdpjq[3]–jdpjq[24]
    for(var i=2;i<=24;i++){
      jdpjq[i+1] = sjdjq[i-1];
    }
  };

  /**
   * Jtime — 儒略日轉換為中文格式字串（年月日時分秒）
   * @param {boolean} op - 強制使用新曆算法
   * @param {number}  jd - 儒略日
   * @returns {string} 如「2024年03月20日12時30分00秒」
   */
  function Jtime (op,jd){
    // 2299160.5 = 1582-10-15 的儒略日，為新舊曆分界
    if(jd>=2299160.5 || op){
      var y4h=146097;      // 格里曆 400 年總日數
      var init=1721119.5;  // 新曆基準
    }
    else{
      var y4h=146100;      // 儒略曆 400 年總日數
      var init=1721117.5;  // 舊曆基準
    }
    var jdr=Math.floor(jd-init);                    // 自基準日起算的天數
    var yh=y4h/4;                                     // 100 年週期日數
    var cen=Math.floor((jdr+0.75)/yh);               // 世紀數
    var d=Math.floor(jdr+0.75-cen*yh);               // 世紀內餘日
    var ywl=1461/4;                                   // 4 年週期日數
    var jy=Math.floor((d+0.75)/ywl);                 // 4 年組序
    d=Math.floor(d+0.75-ywl*jy+1);                   // 4 年組內餘日
    var ml=153/5;                                     // 月長近似常數
    var mp=Math.floor((d-0.5)/ml);                   // 月序（0–11）
    d=Math.floor((d-0.5)-30.6*mp+1);                 // 當月日期
    var y=(100*cen)+jy;                               // 年
    var m=(mp+2)%12+1;                                // 月（1–12）
    if(m<3) y=y+1;                                    // 1–2 月歸入次年
    // 取儒略日小數部分，換算時分秒
    var sd=Math.floor((jd+0.5-Math.floor(jd+0.5))*24*60*60+0.00005);
    var mt=Math.floor(sd/60);    // 總分鐘
    var ss=sd%60;                // 秒
    var hh=Math.floor(mt/60);    // 時
    var mmt=mt%60;               // 分
    var yy=Math.floor(y);
    var mm=Math.floor(m);
    var dd=Math.floor(d);
    // 格式化為中文日期字串，不足位補零
    var yc="     "+yy;
    yc=yc.substr(yc.length-5,5);
    var dytm=yc;dytm+="年";
    dytm+= ((mm < 10) ? "0" : "") + mm+"月";
    dytm+= ((dd < 10) ? "0" : "") + dd+"日";
    dytm+= ((hh < 10) ? "0" : "") + hh+"時";
    dytm+= ((mmt < 10) ? "0" : "") + mmt+"分";
    dytm+= ((ss < 10) ? "0" : "") + ss+"秒";
    return dytm.trim();
  };

  /**
   * Jtime2 — 儒略日轉換為 JavaScript Date 物件
   * @param {boolean} op - 強制使用新曆算法
   * @param {number}  jd - 儒略日
   * @returns {Date} 含年月日時分秒的 Date 物件
   *
   * 與 Jtime 演算法相同，但回傳 Date 供程式進一步運算。
   * 注意：Date 的月份為 0–11，故 mm-1。
   */
  function Jtime2 (op,jd){
    if(jd>=2299160.5 || op){
      var y4h=146097;
      var init=1721119.5;
    }
    else{
      var y4h=146100;
      var init=1721117.5;
    }
    var jdr=Math.floor(jd-init);
    var yh=y4h/4;
    var cen=Math.floor((jdr+0.75)/yh);
    var d=Math.floor(jdr+0.75-cen*yh);
    var ywl=1461/4;
    var jy=Math.floor((d+0.75)/ywl);
    d=Math.floor(d+0.75-ywl*jy+1);
    var ml=153/5;
    var mp=Math.floor((d-0.5)/ml);
    d=Math.floor((d-0.5)-30.6*mp+1);
    var y=(100*cen)+jy;
    var m=(mp+2)%12+1;
    if(m<3) y=y+1;
    var sd=Math.floor((jd+0.5-Math.floor(jd+0.5))*24*60*60+0.00005);
    var mt=Math.floor(sd/60);
    var ss=sd%60;
    var hh=Math.floor(mt/60);
    var mmt=mt%60;
    var yy=Math.floor(y);
    var mm=Math.floor(m);
    var dd=Math.floor(d);
    // 回傳 Date（月份 0-based，故 mm-1）
    return new Date(yy,mm-1,dd,hh,mmt,ss);
  };

  /**
   * CalJiqiByYear — 計算指定時刻所屬「節氣年」的全年 24 節氣儒略日
   * @param {number} y      - 西元年
   * @param {number} m,d,h,i,s - 月日時分秒
   * @param {Array}  _array - 輸出陣列，填入 24 個節氣 JD
   *
   * 若查詢時刻在當年立春之前，則改算前一年的節氣表（八字年界以立春為準）。
   */
  function CalJiqiByYear(y,m,d,h,i,s,_array) {
    // 查詢時刻的完整儒略日
    var jtoday = date_to_julian_day2(y,m,d) +
      date_to_julian_time(h,i,s);
    GetPureJQsinceSpring2(y,0,0,0,_array);
    // 若尚未過立春，則節氣年屬前一年
    if(jtoday < _array[0]) {
      // 精確到秒級比較：避免立春當日同一秒內的邊界誤判
      var jt1 = Math.ceil((jtoday - Math.floor(jtoday))*86400);   // 當日已過秒數
      var jq1 = Math.ceil((_array[0] - Math.floor(_array[0]))*86400); // 立春日內秒數
      if(Math.floor(jtoday) == Math.floor(_array[0]) && jt1 >= jq1) {
        // 與立春同一日且已過立春時刻：仍屬新年，不減年
      }else{
        y = y - 1;
        GetPureJQsinceSpring2(y,0,0,0,_array);
      }
    }
  }

  /**
   * CalCurrentJiqi — 計算指定時刻所處的節氣索引（立春=1, 大寒=24）
   * @returns {number} 節氣索引（1–24），供 jq0 陣列取名
   *
   * 奇門遁甲、八字月柱皆需知道「當前在哪一節氣之後」，
   * 才能正確定月建、用事。
   */
  function CalCurrentJiqi(y,m,d,h,i,s) {
    var jtoday = date_to_julian_day2(y,m,d) +
      date_to_julian_time(h,i,s);
    var jqTime=new Array;
    GetPureJQsinceSpring2(y,0,0,0,jqTime);
    // 立春前則改用前一年節氣表
    if(jtoday < jqTime[0]) {
      var jt1 = Math.ceil((jtoday - Math.floor(jtoday))*86400);
      var jq1 = Math.ceil((jqTime[0] - Math.floor(jqTime[0]))*86400);
      if(Math.floor(jtoday) == Math.floor(jqTime[0]) && jt1 >= jq1) {
        // 立春當日已過立春時刻，不減年
      }else{
        y = y - 1;
        GetPureJQsinceSpring2(y,0,0,0,jqTime);
      }
    }
    var dgz = -1;  // 節氣索引，-1 表示尚未找到
    var jt2 = Math.ceil((jtoday - Math.floor(jtoday))*86400);
    // 由大寒往前掃，找到最後一個已過的節氣
    for(var ii = 24; ii > 0; ii--) {
      if(jtoday > jqTime[ii-1]) {
        dgz = ii;
        break;
      }
      // 與某節氣同一日：比較當日內的秒數
      if(Math.floor(jtoday) == Math.floor(jqTime[ii-1])) {
        if( Math.ceil((jqTime[ii-1] - Math.floor(jqTime[ii-1]))*86400) <= jt2) {
          dgz = ii;
          break;
        }
      }
    }
    return dgz;  // 回傳索引（1=立春, 2=雨水, …, 24=大寒）
  }

  /**
   * GetGZ — 四柱（及延伸細柱）八字計算
   * @param {number} y,m,d,h,i,s - 年月日時分秒
   * @param {number} ms - 毫秒（可選，用於毫秒柱以下細柱）
   * @returns {string} 天干地支串，如「甲子乙丑丙寅丁卯…」
   *
   * 排盤規則：
   *   - 年柱：立春換年，以 1984 甲子年為基準推算六十甲子
   *   - 月柱：以「節」換月，五虎遁年起月法推月干
   *   - 日柱：子初換日（23:00 起算次日），非子正（00:00）
   *   - 時柱：五鼠遁日起時法，子時 23:00–01:00
   *   - 分柱、秒柱、毫秒柱等：奇門細盤用，依時柱递推
   */
  function GetGZ(y,m,d,h,i,s,ms) {
    var jtoday = date_to_julian_day2(y,m,d) + date_to_julian_time(h,i,s);

    var jqTime=new Array;
    GetPureJQsinceSpring2(y,0,0,0,jqTime);
    // 立春前則節氣年屬前一年，年柱、月柱皆受影響
    if(jtoday < jqTime[0]) {
      var jt1 = Math.ceil((jtoday - Math.floor(jtoday))*86400);
      var jq1 = Math.ceil((jqTime[0] - Math.floor(jqTime[0]))*86400);
      if(Math.floor(jtoday) == Math.floor(jqTime[0]) && jt1 >= jq1) {
        // 立春當日已過立春：不減年
      }else{
        y = y - 1;
        GetPureJQsinceSpring2(y,0,0,0,jqTime);
      }
    }
    // 十天干、十二地支字串表
    var tin = "甲乙丙丁戊己庚辛壬癸甲乙丙丁戊己庚辛壬癸甲乙";
    var di  = "子丑寅卯辰巳午未申酉戌亥";

    var rtn_gz = new Array;
    // ── 年柱 ──
    // 以 4712+24 為甲子基準，取模 60 得六十甲子序號
    var ygz = ((y + 4712 + 24) % 60 + 60) % 60;
    rtn_gz.push(tin[ygz % 10]);   // 年干
    rtn_gz.push(di[ygz % 12]);    // 年支

    // ── 月柱 ──
    var dgz = -1;
    var jt2 = Math.ceil((jtoday - Math.floor(jtoday))*86400);
    // 找出當前所處節氣（同 CalCurrentJiqi 邏輯）
    for(var ii = 24; ii > 0; ii--) {
      if(jtoday > jqTime[ii-1]) {
        dgz = ii;
        break;
      }
      if(Math.floor(jtoday) == Math.floor(jqTime[ii-1])) {
        if( Math.ceil((jqTime[ii-1] - Math.floor(jqTime[ii-1]))*86400) <= jt2) {
          dgz = ii;
          break;
        }
      }
    }
    if(dgz < 0) dgz = 1;           // 保底：至少為立春
    if(dgz%2 == 0) dgz--;          // 只取「節」不取「氣」：偶數 index 為中氣，退一格
    dgz = Math.floor(dgz / 2);     // 節氣序轉月建序（立春=0→寅月）
    if(dgz == 12) dgz = 11;        // 大寒後仍屬丑月（12月建）
    // 五虎遁年起月：依年干推月干；月支為「寅卯辰…」序
    rtn_gz.push(tin.substr(Math.floor((ygz%10)%5*2+2),12)[dgz]);  // 月干
    rtn_gz.push("寅卯辰巳午未申酉戌亥子丑".charAt(dgz));            // 月支

    // ── 日柱 ──
    var jda = jtoday + 0.5;  // 加 0.5 為曆法慣例（正午為日界）
    // thes：子初換日修正，將時分納入日柱計算（+3600 秒 = 提前 1 小時換日）
    var thes = ((jda - Math.floor(jda)) * 86400) + 3600;
    var dayjd = Math.floor(jda) + thes / 86400;
    dgz = (Math.floor(dayjd + 49) % 60 + 60) % 60;  // 六十甲子日序
    // if(h >= 23) dgz--; // 子正換日（已註解，本程式用子初換日）
    rtn_gz.push(tin[dgz % 10]);  // 日干
    rtn_gz.push(di[dgz % 12]);   // 日支

    // ── 時柱 ──
    var dh = dayjd * 12;  // 一日分 12 時辰，每時辰 2 小時
    var hgz = (Math.floor(dh + 48) % 60 + 60) % 60;  // 五鼠遁日起時
    // 時支與時辰索引不一致時，天干進一位（跨子时邊界修正）
    if((Math.ceil(h/2)%12) != (hgz%12)) hgz++;
    rtn_gz.push(tin[hgz % 10]);  // 時干
    rtn_gz.push(di[hgz % 12]);   // 時支

    // ── 分柱 ──
    // 奇門細盤：每時辰 10 分鐘為一單位，共 12 地支分位
    var minhz = i; if(h%2 == 0) minhz += 60; minhz = Math.floor(minhz * 60 / 600);
    var gan_idx = [0,2,4,6,8,0,2,4,6,8];  // 依時干起分干的索引表
    rtn_gz.push(tin.substr(gan_idx[tin.indexOf(rtn_gz[6])],12).charAt(minhz)); // 分干
    rtn_gz.push(di[minhz % 12]);  // 分支

    // ── 秒柱 ──
    // 每 50 秒為一單位，共 12 地支秒位
    var minhz = i; if(h%2 == 0) minhz += 60; minhz = Math.floor((minhz * 60 % 600+s) / 50);
    var gan_idx = [0,2,4,6,8,0,2,4,6,8];
    rtn_gz.push(tin.substr(gan_idx[tin.indexOf(rtn_gz[8])],12).charAt(minhz)); // 秒干
    rtn_gz.push(di[minhz % 12]);  // 秒支

    // ── 毫秒柱、混元柱、無極柱、究竟柱、破限柱 ──
    // 將時分秒毫秒合併為總毫秒，再依層級細分
    if(1) {
      var minhz = i; if(h%2 == 0) minhz += 60; minhz = minhz * 60 + s; minhz = minhz * 1000 + ms;
      var minhz1 = Math.floor(minhz/600000);                          // 分柱層級
      var minhz2 = Math.floor(minhz%600000/50000);                    // 秒柱層級
      var minhz3 = Math.floor(minhz%50000/(50000/12.0));              // 毫秒柱（12 等分）
      var minhz4 = Math.floor(minhz%(50000/12.0)/(50000/12.0/12.0)); // 混元柱
      var minhz5 = Math.floor(minhz%(50000/12.0/12.0)/(50000/12.0/12.0/12.0)); // 無極柱
      var minhz6 = Math.floor(minhz%(50000/12.0/12.0/12.0)/(50000/12.0/12.0/12.0/12.0)); // 究竟柱
      var gan_idx = [0,2,4,6,8,0,2,4,6,8];
      rtn_gz.push(tin.substr(gan_idx[tin.indexOf(rtn_gz[10])],12).charAt(minhz3)); // 毫秒干
      rtn_gz.push(di[minhz3 % 12]);
      rtn_gz.push(tin.substr(gan_idx[tin.indexOf(rtn_gz[12])],12).charAt(minhz4)); // 混元干
      rtn_gz.push(di[minhz4 % 12]);
      rtn_gz.push(tin.substr(gan_idx[tin.indexOf(rtn_gz[14])],12).charAt(minhz5)); // 無極干
      rtn_gz.push(di[minhz5 % 12]);
      rtn_gz.push(tin.substr(gan_idx[tin.indexOf(rtn_gz[16])],12).charAt(minhz6)); // 究竟干
      rtn_gz.push(di[minhz6 % 12]);
    };
    return rtn_gz.join("");  // 合併為連續字串回傳
  };

  /**
   * calc_hak_fun — 計算奇門「刻分」干支
   * @param {string} gz - 時柱干支（2 字，如「甲子」）
   * @param {number} h  - 時
   * @param {number} i  - 分
   * @returns {string} 刻分干支（2 字）
   *
   * 奇門遁甲以時柱推刻，每刻 15 分鐘，用於排盤細時。
   */
  function calc_hak_fun(gz,h,i) {
    var tin = "甲乙丙丁戊己庚辛壬癸甲乙丙丁戊己庚辛壬癸甲乙";
    var di  = "子丑寅卯辰巳午未申酉戌亥子丑寅卯辰巳午未申酉戌亥";
    var g = tin.indexOf(gz[0]);   // 時干索引
    var z = di.indexOf(gz[1]);    // 時支索引
    // 刻支：由時干支推算
    var c = di[(z - g + 12)%12];
    // 刻干序：子戌申午辰寅 六陽支對應不同起點
    var c2 = "子戌申午辰寅".indexOf(c) * 10 + g;
    // 刻分：每 15 分鐘進一刻，奇偶時修正
    var c3 = c2 * 8 + (h%2 == 0 ? 4:0) + Math.floor(i/15);
    return tin[c3%10]+di[c3%12];
  }

  // =========================================================================
  // 公開 API — 掛載至 QIMEN_STAR.jiqi，供奇門 HTML 頁面呼叫
  // =========================================================================

  /** GetBazi — 依年月日時分秒（及毫秒）取得八字字串 */
  _e.GetBazi = function(y,m,d,h,i,s,ms) {
    if(!ms || typeof ms !== "number") ms = 0;  // 毫秒預設 0
    return GetGZ(y,m,d,h,i,s,ms);
  };

  /** GetBazi2 — 依儒略日取得八字字串 */
  _e.GetBazi2 = function(jtoday) {
    var d = Jtime2(false,jtoday);  // JD 轉 Date
    return GetGZ(d.getFullYear(),
      d.getMonth()+1,   // Date 月份 0-based，轉回 1-based
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds(),
      d.getMilliseconds()
    );
  };

  /** CalCurrentJiqi — 回傳當前節氣名稱（字串，如「立春」） */
  _e.CalCurrentJiqi = function(y,m,d,h,i,s) {
    return jq0[CalCurrentJiqi(y,m,d,h,i,s)];
  };

  /** CalCurrentJiqiIdx — 回傳當前節氣索引（1–24） */
  _e.CalCurrentJiqiIdx = function(y,m,d,h,i,s) {
    return CalCurrentJiqi(y,m,d,h,i,s);
  };

  /** GetJulianToday — 將指定時刻轉為儒略日 */
  _e.GetJulianToday = function(y,m,d,h,i,s) {
    return date_to_julian_day2(y,m,d) + date_to_julian_time(h,i,s);
  };

  /** JTime — 儒略日轉中文日期字串 */
  _e.JTime = function(jtoday) {
    return Jtime(false,jtoday);
  };

  /** JTime2 — 儒略日轉 Date 物件 */
  _e.JTime2 = function(jtoday) {
    return Jtime2(false,jtoday);
  };

  /** CalJiqiByYear — 計算節氣年內 24 節氣 JD，寫入 _arr */
  _e.CalJiqiByYear = function(y,m,d,h,i,s,_arr) {
    CalJiqiByYear(y,m,d,h,i,s,_arr);
  };

  /**
   * GetJiqiInfo — 一次取得排盤所需的完整節氣與八字資訊
   * @returns {Object} 含 julian、jiqi 名稱表、currentJiqiIdx、bazi、刻分、wholeYear 等
   */
  _e.GetJiqiInfo = function(y,m,d,h,i,s,ms) {
    var _out = new Array();
    _out.jd = date_to_julian_day2(y,m,d);                          // 當日 0 時 JD
    _out.julian = _out.jd + date_to_julian_time(h,i,s);            // 含時刻 JD
    _out.jiqi = jq0.slice();                                       // 24 節氣名稱表副本
    _out.currentJiqiIdx = CalCurrentJiqi(y,m,d,h,i,s);             // 當前節氣索引
    _out.bazi = GetGZ(y,m,d,h,i,s,ms);                             // 八字字串
    _out.bazi_hak_fun = calc_hak_fun(_out.bazi.substr(6,2), h, i); // 刻分（取時柱）
    _out.wholeYear = new Array();                                  // 全年 24 節氣 JD
    _out.year=y;                                                   // 節氣年（可能已減年）
    CalJiqiByYear(y,m,d,h,i,s,_out.wholeYear);
    return _out;
  };

  // 時區偏移：東八區（北京時間）= UTC+8 小時 = 8/24 儒略日
  _e.timezone = 8/24;

// 若 QIMEN_STAR.jiqi 已存在則沿用，否則傳入空物件作為 _e
}(QIMEN_STAR.jiqi || {}));
