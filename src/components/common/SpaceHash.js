/**
 * [SpaceHash] 空间属性表字段映射
 * 用于在更新、插入时做是否存在字段的校验
 * @link 中文名
 * @required 是否必须
 * @type 正则校验使用
 * @disabled 是否禁止操作
 */
const SpaceHash = {
  //  招商地块面
  u_qyzc: {
    统一社会信: {
      link: "统一社会信用代码",
      required: true,
      type: "text",
      disabled: true
    }
  },
  //  招商地块面
  u_zsdkm: {
    xmmc: {
      link: "名称",
      required: true,
      type: "text",
      disabled: true
    }
  },
  //  已征待拆
  u_yddk: {
    ydkmc: {
      link: "地块名称",
      required: true,
      type: "text",
      disabled: true
    }
  },
  //  重点项目
  u_zdcyxmb: {
    name: {
      link: "项目名称",
      required: true,
      type: "text",
      disabled: true
    }
  },
  //  重点楼宇
  u_lyxx: {
    gdid: {
      link: "固定id",
      required: true,
      disabled: true
    }
  },
  //  专业市场
  u_zyscxxb: {
    name: {
      link: "市场名称",
      required: true,
      type: "text",
      disabled: true
    }
  },
  //  招商地块
  u_canvass: {
    name: {
      link: "招商地块名称",
      required: true,
      type: "text",
      disabled: true
    }
  },
  //  公房
  u_lcgf: {
    dz: {
      link: "公房地址",
      required: true,
      type: "text",
      disabled: true
    }
  }
};
export default SpaceHash;
