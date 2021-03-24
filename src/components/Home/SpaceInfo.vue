<template>
  <div class="spaceInfo">
    <div v-if="locate.params.mode == 'point'">
      <p>新落点 空间信息:</p>
      <p>x: {{locate.geometry.x.toFixed(2)}}</p>
      <p>y: {{locate.geometry.y.toFixed(2)}}</p>
    </div>
    <div v-else>
      <p>新地块 空间信息</p>
      <p>面积: {{area}} ㎡</p>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState } from "vuex";
import { loadModules } from "esri-loader";
import { OPTION } from "@/components/common/config";
export default {
  name: "spaceInfo",
  data() {
    return {
      area: undefined
    };
  },
  computed: {
    ...mapState({
      locate: state => state.locate
    })
  },
  watch: {
    locate: {
      handler({ params, geometry }) {
        params.mode == 'polygon' && this.getAreas(geometry);
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    /**
     * 求面积
     * @param {*} geometry  空间信息
     */
    getAreas(geometry) {
      const _context_ = this;
      loadModules(["esri/geometry/support/geodesicUtils"], OPTION).then(
        ([geodesicUtils]) => {
          const areas = geodesicUtils.geodesicAreas(
            [geometry],
            "square-meters"
          );
          _context_.area = areas[0].toFixed(2);
        }
      );
    }
  }
};
</script>

<style scoped lang="less">
.spaceInfo {
  p {
    margin: 0;
    font-weight: 300;
    text-align: left;
  }
}
</style>