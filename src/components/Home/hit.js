/* eslint-disable */
import { loadModules } from "esri-loader";
import { WRT_config, OPTION } from "@/components/common/config";
const { server } = WRT_config;

/**
 * 初始化定位工具
 * @param {*} _context_
 */
export const registeHit = _context_ => {
  const params = _context_.$params;
  const { mode } = params;
  //  地图工具(点击落点\绘制地块)
  initMapTool(_context_, params);
  //  params传参落点
  if (mode === "point") {
    forcePoint(_context_, params);
  } else if (mode === "polygon") {
    forceArea(_context_, params);
  }
};

/**
 * 查询点数据并落点
 * @param {*} _context_
 * @param {*} param1
 */
export const forcePoint = async (_context_, params) => {
  const { value } = params;
  if (!Object.keys(_context_.spaceValHash).length)
    return _context_.$parent.makeToast(
      "提示",
      "未找到该类型空间图层,请关注后续更新"
    );
  const { arcgis, s_key, layer } = _context_.spaceValHash;
  const url = `${arcgis}/${layer}`;
  const { data } = await _context_.fetchLocatedSpace({
    where: `${s_key}='${value}'`,
    url
  });
  const { features } = data;
  loadModules(["esri/geometry/Point", "esri/Graphic"], OPTION).then(
    ([Point, Graphic]) => {
      const { x, y } = features[0].geometry;
      const geometry = new Point({ x, y });
      const graphic = new Graphic({
        geometry,
        symbol: {
          type: "picture-marker", // autocasts as new PictureMarkerSymbol()
          url: `${server}/icon/commonIcon/mobile_location_self.png`,
          width: "49px",
          height: "69px",
          yoffset: 10
        }
      });
      _context_.view.graphics.add(graphic);
      _context_.view.goTo({
        center: [x, y],
        zoom: 15
      });
      _context_.$store.commit("updateLocated", {
        params,
        geometry: features[0].geometry,
        attributes: features[0].attributes
      });
      //  调用form页面传递数据
      _context_.$parent.$refs.form.getAttributes(features[0].attributes);
    }
  );
};

/**
 * 查询面数据并落面
 * @param {*} _context_
 * @param {*} param1
 */
export const forceArea = async (_context_, params) => {
  const { value } = params;
  if (!Object.keys(_context_.spaceValHash).length)
    return _context_.$parent.makeToast(
      "提示",
      "未找到该类型空间图层,请关注后续更新"
    );
  const { arcgis, s_key, layer } = _context_.spaceValHash;
  const url = `${arcgis}/${layer}`;
  const { data } = await _context_.fetchLocatedSpace({
    where: `${s_key}='${value}'`,
    url
  });
  const { features } = data;
  if (!features.length) return;
  loadModules(["esri/geometry/Polygon", "esri/Graphic"], OPTION).then(
    ([Polygon, Graphic]) => {
      const geometry = new Polygon(features[0].geometry);
      const fillSymbol = {
        type: "simple-fill",
        color: [227, 139, 79, 0.6],
        outline: {
          color: [255, 255, 255],
          width: 1
        }
      };
      const polygonGraphic = new Graphic({
        geometry,
        symbol: fillSymbol
      });
      let center = [0, 0];
      const len = geometry.rings[0].length;
      geometry.rings[0].map(item => {
        center[0] += item[0];
        center[1] += item[1];
      });
      center = [center[0] / len, center[1] / len];
      _context_.$store.commit("updateLocated", {
        params,
        geometry: features[0].geometry,
        attributes: features[0].attributes,
        center
      });
      _context_.view.graphics.add(polygonGraphic);
      _context_.view.goTo({
        center,
        zoom: 15
      });
      //  调用form页面传递数据
      _context_.$parent.$refs.form.getAttributes(features[0].attributes);
    }
  );
};

/**
 * 初始化地图事件
 * [点] 点击事件
 * [面] 绘制地块
 * @param {*} params
 */
export const initMapTool = (_context_, params) => {
  const MODE = params.mode; //  default
  if (MODE === "point") {
    _context_.view.on("click", function(evt) {
      const { x, y } = evt.mapPoint;
      drawLocationPoint(_context_, { x, y });
    });
  } else {
    loadModules(["esri/widgets/Sketch/SketchViewModel"], OPTION).then(
      ([SketchViewModel]) => {
        // 绘制多边形
        _context_.sketchViewModel = new SketchViewModel({
          updateOnGraphicClick: false,
          view: _context_.view,
          layer: _context_.locationLayer,
          polygonSymbol: {
            type: "simple-fill",
            color: "rgba(255,255,255,0.2)",
            style: "solid",
            outline: {
              color: "white",
              width: 1
            }
          }
        });
        _context_.sketchViewModel.on("create", function(event) {
          _context_.locationLayer.removeAll();
          if (event.state != "complete") return;
          _context_.locationLayer.add(event.graphic);
          _context_.$store.commit("updateLocate", {
            params,
            geometry: event.graphic.geometry
          });
        });
      }
    );
  }
};

/**
 * 画红点
 * @param {*} _context_
 * @param {*} param1
 */
export const drawLocationPoint = (_context_, { x, y }) => {
  loadModules(["esri/Graphic", "esri/geometry/Point"], OPTION).then(
    ([Graphic, Point]) => {
      _context_.locationLayer.removeAll();
      const geometry = new Point({ x, y });
      const graphic = new Graphic({
        geometry,
        symbol: {
          type: "picture-marker", // autocasts as new PictureMarkerSymbol()
          url: `${server}/icon/commonIcon/location.png`,
          width: "22px",
          height: "32px",
          yoffset: 9
        }
      });
      _context_.locationLayer.add(graphic);
      _context_.view.goTo({
        center: [x, y],
        zoom: 13
      });
      _context_.$store.commit("updateLocate", {
        params: _context_.$params,
        geometry
      });
    }
  );
};
