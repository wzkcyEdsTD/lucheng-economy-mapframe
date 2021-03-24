<template>
  <div id="arcgis"></div>
</template>

<script>
/* eslint-disable */
import { loadModules } from "esri-loader";
import { IMAGELAYER, QHMB, OPTION } from "@/components/common/config";
import { mapState, mapActions } from "vuex";
import { registeQuery } from "./space";
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
      registeQuery(this);
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
            zoom: 12
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