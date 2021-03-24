/* eslint-disable */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { auth_token } from "./api/beans/auth";
import util from "@/components/common/util";
Vue.use(BootstrapVue);
Vue.config.productionTip = false;
Vue.prototype.$util = util;
Vue.prototype.$bGeo = new window.BMap.Geocoder();

/**
 * 返回uuid数组
 */
window.getSpaceResults = () => {
  let key;
  const valHash = window._vue_.$store.state.valHash;
  for (let v in valHash) {
    valHash[v]["primary"] && (key = v);
  }
  return {
    key,
    result: window._vue_.$store.state.spaceResults
  };
};

/**
 * 入口函数,父页面调用传参后初始化地图并定位
 * @param {Object} ↓
 *  @param {String} key   value对应key
 *  @param {String} value 数值
 *  @param {String} mode  point/polygon
 *  @param {String} table hash表
 */
window.getParamsInitMap = async params => {
  Vue.prototype.$params = params;
  await auth_token("kcadmin");
  //  初始化地图
  window._vue_ = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
};
/**
 * 1.同源下直接调用函数 getParamsInitMap();
 * 2.非同源下frame.contentWindow.postMessage (data, {}) 调用
 */
window.addEventListener("message", ({ data }) => {
  console.log("[data]", data);
  //event.data获取传过来的数
  data && data instanceof Object && data.mode && window.getParamsInitMap(data);
});

// postMessage(
//   {
//     value: "温州天盛化工集团有限公司",
//     mode: "polygon", //  point\polygon\search
//     table: "u_yddk"
//   },
//   "*"
// );
