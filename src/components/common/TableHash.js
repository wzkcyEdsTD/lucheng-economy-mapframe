/**
 * created 2019/11/10
 * 可供地块、已征待拆存在特殊情况:
 * 两类数据在同一张表内
 * 两类数据在不同图层内,故用table-key做区分,但指向同一张表
 * update 2019/11/22  两类地块已经整合在一个图层、一个业务表
 * --- [暂时不用] ---
 */
const tableHash = {
  u_qyzc: "u_qyzc",
  u_zsdkm: "u_zsdkm",
  u_yddk: "u_yddk",
  u_zdcyxmb: "u_zdcyxmb",
  u_lyxx: "u_lyxx",
  u_zyscxxb: "u_zyscxxb",
  u_canvass: "u_canvass",
  u_lcgf: "u_lcgf"
};
export default tableHash;
