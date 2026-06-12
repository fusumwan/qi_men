import { PalaceData } from "../constants/PalaceData.js";

/**
 * 九宮規則
 */
export class QimenPalaceRule {
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
