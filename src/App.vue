<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
/* eslint-disable */
import { mapMutations } from "vuex";
import SpaceHash from "@/components/common/SpaceHash";
import SpaceValHash from "@/components/common/SpaceValHash";
import ValHash from "@/components/common/ValHash";
import TableHash from "@/components/common/TableHash";
export default {
  name: "app",
  created() {
    const { table } = this.$params;
    this.updateSpaceHash(SpaceHash[table]);
    this.updateSpaceValHash(SpaceValHash[table]);
    this.updateValHash(ValHash[table]);
    this.updateTableHash(table || TableHash[table]);
  },
  methods: {
    ...mapMutations([
      "updateSpaceHash",
      "updateSpaceValHash",
      "updateValHash",
      "updateTableHash"
    ])
  }
};
</script>
<style lang="less">
@import url("https://js.arcgis.com/4.12/esri/css/main.css");
html,
body {
  margin: 0px;
  padding: 0px;
  height: 100%;
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    overflow: hidden;
    height: 100%;
  }
}
.esri-ui {
  display: none !important;
}
</style>
