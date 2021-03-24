<template>
  <div id="arcgis"></div>
</template>

<script>
/* eslint-disable */
import { loadModules } from "esri-loader";
import { IMAGELAYER, QHMB, OPTION } from "@/components/common/config";
import { mapState, mapActions } from "vuex";
import { registeHit, drawLocationPoint } from "./hit";
import { forceKg, clearKg } from "./kg";
export default {
  name: "arcgis",
  data() {
    return {
      map: null,
      view: null,
      sketchViewModel: null,
      graphicsLayer: null,
      locationLayer: null
    };
  },
  computed: {
    ...mapState({
      spaceValHash: state => state.spaceValHash,
      single: state => state.single
    })
  },
  mounted() {
    this.createMap(() => {
      registeHit(this);
    });
  },
  methods: {
    ...mapActions(["fetchLocatedSpace"]),
    /**
     * @param {String} type 地图画图工具类型
     */
    spaceQuery(type) {
      this.clearLayer();
      this.sketchViewModel.create(type);
    },
    clearLayer() {
      this.locationLayer.removeAll();
      this.graphicsLayer.removeAll();
    },
    /**
     * 控规查询匹配
     * @param {String} isSearch 搜索开关 false清除图层 true查询图层
     * @param {String} code 地块编号
     */
    kgControll(isSearch = false, code) {
      isSearch && forceKg(this, code);
      !isSearch && clearKg(this);
    },
    kgMove({ center }) {
      this.view.goTo({ center, zoom: 15 });
    },
    /**
     * 百度匹配地址
     */
    spaceQueryAuto() {
      const _context_ = this;
      !this.single.address &&
        _context_.$parent.makeToast(
          "提示",
          "业务表内无[address]地址字段,无法精确定位"
        );
      this.single &&
        this.$bGeo.getPoint(
          this.single.address ||
            this.single.duty ||
            this.single.name ||
            this.single.dz,
          point => {
            point &&
              drawLocationPoint(
                _context_,
                _context_.$util.bd09togcj02(point.lng, point.lat)
              );
          },
          "温州市"
        );
    },
    /**
     * @param {Function} callback
     */
    createMap(fn) {
      const _context_ = this;
      loadModules(
        [
          "esri/Map",
          "esri/views/MapView",
          "esri/layers/VectorTileLayer",
          "esri/layers/MapImageLayer",
          "esri/layers/GraphicsLayer"
        ],
        OPTION
      ).then(
        ([Map, MapView, VectorTileLayer, MapImageLayer, GraphicsLayer]) => {
          const veclayer = new VectorTileLayer({
            url: IMAGELAYER,
            id: "vector"
          });
          const qh = new MapImageLayer({
            url: QHMB,
            id: "lcjjdt",
            sublayers: [{ id: 3 }, { id: 1 }, { id: 0 }]
          });
          _context_.map = new Map({
            layers: [veclayer, qh]
          });
          _context_.view = new MapView({
            container: "arcgis",
            map: _context_.map,
            center: [120.61419448808013, 28.039695289562555],
            zoom: 11
          });
          //  绘画图层Graphics
          _context_.graphicsLayer = new GraphicsLayer({
            id: "graphicsLayer"
          });
          _context_.map.add(_context_.graphicsLayer);
          //  空间落点Graphics
          _context_.locationLayer = new GraphicsLayer({
            id: "locationLayer"
          });
          _context_.map.add(_context_.locationLayer);
          fn && fn();
        }
      );
    }
  }
};
</script>

<style scoped lang="less">
#arcgis {
  height: 100%;
}
</style>