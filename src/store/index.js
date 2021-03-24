/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import { updateDataStores, fetchArcgisServer } from "@/api/beans/space";
import { updateLocatedTrue } from "@/api/beans/single";
import fetchDataStores from "@/api/beans/single";
export default new Vuex.Store({
  state: {
    /** 空间范围查询 */
    radius: 1000, // default
    spaceResults: [],
    /** 空间信息更新 */
    single: {}, //  已有数据业务表信息
    located: undefined, //  已有数据空间信息
    locate: undefined, //  将要入库的空间信息
    kgs: [], // 控规信息
    /** hash表信息 */
    spaceHash: undefined,
    spaceValHash: undefined,
    valHash: undefined,
    tableHash: undefined
  },
  mutations: {
    /**
     * 修改缓冲区半径
     */
    updateRadius(state, val) {
      state.radius = val;
    },
    /**
     * 修改空间信息
     */
    updateLocate(state, val = undefined) {
      state.locate = val;
    },
    /**
     * 若传入信息已有空间化数据,则保存在状态管理内
     */
    updateLocated(state, val = undefined) {
      state.located = val;
    },
    /**
     * 修改空间查询返回的公司信息
     */
    updateSpaces(state, val = []) {
      state.spaceResults = val;
    },
    /**
     * 业务表数据信息
     */
    updateSingle(state, val = {}) {
      state.single = val;
    },
    /**
     * 空间属性表hash获取
     */
    updateSpaceHash(state, val = {}) {
      state.spaceHash = val;
    },
    /**
     * 空间/业务映射hash获取
     */
    updateSpaceValHash(state, val = {}) {
      state.spaceValHash = val;
    },
    /**
     * 业务表hash获取
     */
    updateValHash(state, val = {}) {
      state.valHash = val;
    },
    /**
     * 表hash获取
     */
    updateTableHash(state, val = {}) {
      state.tableHash = val;
    },
    /**
     * 控规查询信息更新
     */
    updateKgs(state, val = []) {
      state.kgs = val;
    }
  },
  actions: {
    async fetchLocatedSpace({ state, commit }, option) {
      const data = await fetchArcgisServer(option);
      return data;
    },
    /**
     * 业务信息表获取
     * @param {*} param0
     */
    async fetchData({ state, commit }, { value, table, valHash, makeToast }) {
      let _search_ = {};
      const cols = [];
      for (let v in valHash) {
        cols.push({ name: v, raw: `a.${v}` });
        valHash[v].primary &&
          (_search_ = { key: v, isNan: valHash[v].number, value });
      }
      const { data } = await fetchDataStores({
        where: `${_search_.key} = ${
          _search_.isNan ? _search_.value : `'${_search_.value}'`
        }`,
        table,
        cols
      });
      !data.length && makeToast("提示", "未找到该数据信息");
      data[0] && commit("updateSingle", data[0]);
    },
    /**
     * 空间信息表更新
     * @param {*} param0
     * @param {*} param1
     */
    async commitSpace(
      { state, commit },
      { s_table, s_key, s_primary, value, attributes, hash }
    ) {
      const _sql_ = [{ key: "Shape", value: attributes["Shape"] }];
      let sql;
      //  根据s_primary判断是否插入
      if (attributes[s_primary]) {
        sql = `UPDATE ${s_table} SET ${_sql_
          .map(item => {
            return ` ${item.key} = ${
              item.type && item.type == "text" ? `'${item.value}'` : item.value
            }`;
          })
          .join(`,`)} WHERE ${s_key} = '${value}'`;
      } else {
        //  插入的内容包括OBJECTID、Shape、空间表外键
        Object.getOwnPropertyNames(attributes).forEach(key => {
          hash[key] &&
            _sql_.push({
              key,
              value: attributes[key],
              type: hash[key]["type"]
            });
        });
        //  插入OBJECTID为时间戳截取到秒
        _sql_.push({
          key: s_primary,
          value: parseInt(+new Date() / 1000),
          type: "number"
        });
        sql = `INSERT INTO ${s_table} (${_sql_
          .map(item => {
            return item.key;
          })
          .join(`,`)}) VALUES (${_sql_
          .map(item => {
            return item.type && item.type == "text"
              ? `'${item.value}'`
              : item.value;
          })
          .join(`,`)})`;
      }
      //  更新空间表
      await updateDataStores(sql);
      for (let v in state.valHash) {
        if (state.valHash[v].primary) {
          //  更新业务表
          await updateLocatedTrue(
            state.tableHash,
            v,
            state.valHash[v].number,
            value
          );
        }
      }
    }
  }
});
