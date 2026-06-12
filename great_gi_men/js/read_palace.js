function parseQiMenTableToJson() {
  const result = {};

  var numPalaceGroup=document.getElementById("drpSelectPalaceGroup").value;
  // 尋找 #p5 裡面的 #tplTable
  const tplTable = document.querySelector(`#p${numPalaceGroup} #tplTable`);
  if (!tplTable) {
    console.warn("找不到 #p5 裡的 #tplTable");
    return result;
  }

  for (let i = 1; i <= 9; i++) {
    const td = tplTable.querySelector(`#i${i}`);
    if (!td) continue;

    const text = td.innerHTML
      .replace(/<br\s*\/?>/gi, '\n')         // 將 <br> 換成換行
      .replace(/<[^>]+>/g, '')               // 清除 HTML 標籤
      .replace(/，/g, '')                    // 去除可見與隱藏頓號
      .trim();

    const lines = text
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    const palaceName = `宮${i}`;
    const entry = {
      九宮: palaceName,
      神煞: '',
      八門: '',
      地盤天干: '',
      地盤: '',
      天盤天干: '',
      天星: ''
    };

    if (lines.length >= 1) {
      entry.神煞 = lines[0]; // 第一行 → 神煞
    }

    if (lines.length >= 2) {
      const line2 = lines[1];
      if (line2.length === 4) {
        // 例如：癸景門庚 → 天盤天干=癸, 八門=景門, 地盤天干=庚
        entry.天盤天干 = line2[0];
        entry.八門 = line2.slice(1, 3);
        entry.地盤天干 = line2[3];
      } else if (line2.length === 3) {
        // 例如：杜門戊 → 無天盤天干，八門=杜門，地盤天干=戊
        entry.八門 = line2.slice(0, 2);
        entry.地盤天干 = line2[2];
      }
    }

    if (lines.length >= 3) {
      const line3 = lines[2];
      if (line3.length >= 3) {
        // 例如：天苪壬 → 天星=天苪，地盤=壬
        entry.天星 = line3.slice(0, 2);
        entry.地盤 = line3[2];
      }
    }

    result[palaceName] = entry;
  }

  return result;
}
