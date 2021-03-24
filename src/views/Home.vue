<template>
  <div class="home" v-if="_switch">
    <div class="home_hit">
      <space-detail ref="detail" />
      <kg-controll ref="kg" />
      <space-form ref="form" />
    </div>
    <Arcgis ref="arcgis" />
  </div>
</template>

<script>
/* eslint-disable */
import Arcgis from "@/components/Home/Arcgis";
import SpaceForm from "@/components/Home/SpaceForm";
import SpaceDetail from "@/components/Home/SpaceDetail";
import KgControll from "@/components/Home/KgControll";
import { mapState, mapMutations } from "vuex";
export default {
  name: "home",
  components: { Arcgis, SpaceForm, KgControll, SpaceDetail },
  computed: {
    //  空间查询 & 空间落点
    _switch() {
      return this.$params.mode == "search" ? false : true;
    }
  },
  methods: {
    ...mapMutations(["updateRadius", "updateLocate"]),
    queryType(item) {
      this.updateLocate();
      this.$refs.arcgis.spaceQuery(item);
    },
    queryByBaidu() {
      this.$refs.arcgis.spaceQueryAuto();
    },
    makeToast(title, msg) {
      this.$bvToast.toast(msg, {
        title,
        toaster: "b-toaster-top-left",
        autoHideDelay: 5000,
        appendToast: false
      });
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  p {
    margin: 0;
    line-height: 30px;
  }
  .home_space {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 2;
  }
  .home_hit {
    display: inline-block;
    position: fixed;
    top: 20px;
    right: 10px;
    font-size: 16px;
    z-index: 2;
  }
}
</style>