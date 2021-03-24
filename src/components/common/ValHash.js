/**
 * [ValHash] 业务表字段映射
 * 展示【数据详情】窗口的相关信息
 * @link 中文名
 * @primary 主键
 * @gis 对应空间表内的字段
 */
const ValHash = {
  //  招商地块面
  u_qyzc: {
    name: {
      link: "企业名称"
    },
    uuid: {
      link: "统一社会信用代码",
      primary: true,
      number: false
    },
    hy: {
      link: "行业类型",
      type: "text"
    },
    address: {
      link: "地址",
      type: "text"
    }
  },
  //  招商地块面
  u_zsdkm: {
    xmmc: {
      link: "地块名称",
      type: "text",
      primary: true,
      number: false
    },
    ydmj: {
      link: "用地面积(亩)",
      type: "text"
    },
    jzmj: {
      link: "建筑面积(㎡)",
      type: "text"
    },
    pid: {
      link: "pid",
      type: "text"
    }
  },
  //  用地地块
  u_yddk: {
    ydkmc: {
      link: "地块名称",
      type: "text",
      primary: true,
      number: false
    },
    dkzl: {
      link: "地址",
      type: "text"
    },
    mj: {
      link: "用地面积(亩)",
      type: "text"
    },
    lx: {
      link: "用地类型",
      type: "text"
    }
  },
  //  重点项目
  u_zdcyxmb: {
    name: {
      link: "名称",
      type: "text",
      primary: true,
      number: false
    },
    duty: {
      link: "所属街道",
      type: "text"
    }
  },
  //  重点楼宇
  u_lyxx: {
    name: {
      link: "楼宇名称",
      type: "text",
    },
    gdid: {
      link: "楼宇固定id",
      type: "text",
      primary: true,
      number: false
    },
    address: {
      link: "地址",
      type: "text"
    }
  },
  //  专业市场
  u_zyscxxb: {
    name: {
      link: "名称",
      type: "text",
      primary: true,
      number: false
    },
    address: {
      link: "地址",
      type: "text"
    }
  },
  //  招商地块
  u_canvass: {
    name: {
      link: "名称",
      type: "text",
      primary: true,
      number: false
    },
    ename: {
      link: "英文名称",
      type: "text"
    },
    ssjd: {
      link: "所属街道",
      type: "text"
    }
  },
  //  鹿城公房
  u_lcgf: {
    dz: {
      link: "地址",
      type: "text",
      primary: true,
      number: false
    }
  }
};
export default ValHash;
