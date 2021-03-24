/**
 * [SpaceValHash] 业务表\空间表映射
 * 规定通过xx字段从xx服务的xx图层取数据
 * @s_table 空间表名
 * @s_key   空间表字段
 * @arcgis  arcgis服务名
 */
import { CYBJ, ZSZY, DKHX, JJTS, GONGFANG } from "./config";
const SpaceValHash = {
  //  企业 [point]
  u_qyzc: {
    s_table: "HYD",
    s_key: "统一社会信",
    s_primary: "OBJECTID",
    arcgis: CYBJ,
    layer: 4
  },
  //  招商地块面[ polygon ]
  u_zsdkm: {
    s_table: "ZSDKM",
    s_key: "xmmc",
    s_primary: "OBJECTID",
    arcgis: ZSZY,
    layer: 3
  },
  //  用地地块 [polygon]
  u_yddk: {
    s_table: "YDDK",
    s_key: "ydkmc",
    s_primary: "OBJECTID",
    arcgis: DKHX,
    layer: 0
  },
  //  重点项目 [point]
  u_zdcyxmb: {
    s_table: "ZDCY",
    s_key: "name",
    s_primary: "OBJECTID",
    arcgis: JJTS,
    layer: 1
  },
  //  重点楼宇 [point]
  u_lyxx: {
    s_table: "ZDLY",
    s_key: "gdid",
    s_primary: "OBJECTID",
    arcgis: JJTS,
    layer: 2
  },
  //  专业市场 [point]
  u_zyscxxb: {
    s_table: "ZYSC",
    s_key: "name",
    s_primary: "OBJECTID",
    arcgis: JJTS,
    layer: 3
  },
  //  招商地块 [point]
  u_canvass: {
    s_table: "ZSXMD",
    s_key: "name",
    s_primary: "OBJECTID",
    arcgis: JJTS,
    layer: 4
  },
  //  公房 [point]
  u_lcgf: {
    s_table: "LCGF",
    s_key: "dz",
    s_primary: "OBJECTID",
    arcgis: GONGFANG,
    layer: 0
  }
};
export default SpaceValHash;
