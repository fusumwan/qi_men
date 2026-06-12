/**
 * 字串格式化擴充方法
 * 在 JavaScript 原生 String 原型上新增 format 方法，
 * 讓字串能以佔位符方式插入變數，類似 C# 的 String.Format 或 Python 的 str.format。
 *
 * 支援兩種用法：
 * 1. 具名佔位符：以單一物件傳入，例如 "你好，{name}！".format({name: "小明"})
 * 2. 數字索引佔位符：以多個參數傳入，例如 "第{0}名是{1}".format(1, "張三")
 */
String.prototype.format = function() {
	// 將呼叫 format 時傳入的所有參數保存到區域變數 args
	// arguments 為函式內建物件，包含本次呼叫所收到的全部實參
	var args = arguments;

	// 判斷是否為「具名佔位符」模式：
	// 條件一：只傳入一個參數（args.length == 1）
	// 條件二：該參數的型別為 object（即傳入的是一個物件，而非字串或數字等基本型別）
	if(args.length == 1 && typeof args[0] === "object") {
		// 將傳入的物件存為 o，後續以屬性名稱查找對應的替換值
		var o = args[0]

		// 使用正則表達式全域搜尋並替換所有 {屬性名} 形式的佔位符
		// 正則 /{([^{}]*)}/g 說明：
		//   \{        — 匹配左大括號「{」（需跳脫，因大括號在正則中有特殊意義）
		//   ([^{}]*)  — 捕獲群組：匹配零個或多個「非大括號」字元，即佔位符內的屬性名稱
		//   \}        — 匹配右大括號「}」
		//   g         — 全域旗標，替換字串中所有符合的佔位符，而非僅第一個
		return this.replace(/{([^{}]*)}/g, function(a,b) {
			// a：本次匹配到的完整佔位符字串（例如 "{name}"）
			// b：第一個捕獲群組的內容，即大括號內的屬性名稱（例如 "name"）
			var r = o[b];
			// 若物件中存在該屬性，且其值為字串或數字，則以該值替換佔位符；
			// 否則保留原始佔位符 a 不變（避免 undefined、null、物件等造成顯示異常）
			return typeof r ==='string' || typeof r === 'number' ? r : a;
		});
	}

	// 若不符合具名佔位符模式，則採用「數字索引佔位符」模式
	// 正則 /{(\d+)}/g 說明：
	//   \{     — 匹配左大括號「{」
	//   (\d+)  — 捕獲群組：匹配一個或多個數字，即參數的索引（0、1、2…）
	//   \}     — 匹配右大括號「}」
	//   g      — 全域替換
	return this.replace(/{(\d+)}/g, function(match, number) {
		// match：本次匹配到的完整佔位符字串（例如 "{0}"）
		// number：捕獲到的數字字串（例如 "0"），可作為 args 的索引使用
		// 若 args 中該索引位置有定義值，則回傳該參數；否則保留原始佔位符 match
		return typeof args[number] != 'undefined' ? args[number] : match;
	});
};

/**
 * 字串全域替換擴充方法
 * 在 String 原型上新增 replaceAll 方法，
 * 將字串中所有符合 search 的子字串替換為 replacement。
 *
 * 說明：舊版 JavaScript（ES2021 之前）原生 String 沒有 replaceAll，
 * 此方法以 split + join 實作，效果等同於將所有出現處一併替換。
 *
 * 範例："a-b-c".replaceAll("-", "_") 結果為 "a_b_c"
 */
String.prototype.replaceAll = function(search,replacement) {
	// 以 this 取得呼叫此方法的字串本身（例如 "hello world".replaceAll(...) 中的 "hello world"）
	var target = this;
	// 先用 search 分割字串成陣列，再以 replacement 串接回去
	// 例如 "a-b-c".split("-") 得 ["a","b","c"]，再 join("_") 得 "a_b_c"
	// 此寫法可替換所有出現處，且不需正則跳脫特殊字元
	return target.split(search).join(replacement);
}
