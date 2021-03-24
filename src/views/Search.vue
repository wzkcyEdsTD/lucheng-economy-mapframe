<template>
  <div class="search">
    <div class="home_space">
      <b-input-group prepend="缓冲半径(米)">
        <b-form-input v-model="_radius" type="number" min="100" max="5000"></b-form-input>
        <template v-slot:append>
          <b-dropdown text="查询类型">
            <b-dropdown-item
              v-for="(item,key,index) in queryTip"
              :key="index"
              @click="()=>{ queryType(key) }"
            >{{item}}</b-dropdown-item>
          </b-dropdown>
        </template>
      </b-input-group>
    </div>
    <Arcgis ref="arcgis" />
  </div>
</template>

<script>
/* eslint-disable */
import Arcgis from "@/components/Search/Arcgis";
import { mapState, mapMutations } from "vuex";
export default {
  name: "search",
  components: { Arcgis },
  data() {
    return {
      queryTip: {
        rectangle: "拉框查询",
        polygon: "多边形查询",
        point: "点查询",
        polyline: "缓冲区查询"
      }
    };
  },
  computed: {
    _radius: {
      get() {
        return this.radius;
      },
      set(val) {
        this.updateRadius(val);
      }
    },
    ...mapState({
      radius: state => state.radius
    })
  },
  methods: {
    ...mapMutations(["updateRadius", "updateLocate"]),
    queryType(item) {
      this.updateLocate();
      this.$refs.arcgis.spaceQuery(item);
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
.search {
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
}
</style>