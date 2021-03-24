/* eslint-disable */
import { loadModules } from "esri-loader";
import { OPTION } from "@/components/common/config";
const symbol = {
  type: "simple-fill",
  color: [255, 255, 255, 0.2],
  outline: {
    color: [255, 255, 255],
    width: 1
  }
};

/**
 * 注册空间查询组件
 * @param {*} _context_ vue类
 */
export const registeQuery = _context_ => {
  loadModules(
    [
      "esri/Graphic",
      "esri/widgets/Sketch/SketchViewModel",
      "esri/geometry/Circle",
      "esri/geometry/Point"
    ],
    OPTION
  ).then(([Graphic, SketchViewModel, Circle, Point]) => {
    // 绘制多边形
    _context_.sketchViewModel = new SketchViewModel({
      updateOnGraphicClick: false,
      view: _context_.view,
      layer: _context_.graphicsLayer,
      pointSymbol: {
        type: "simple-marker",
        color: "#FFF",
        size: "10px",
        outline: {
          color: [255, 255, 255],
          width: 2
        }
      },
      polylineSymbol: {
        type: "simple-line",
        color: "#FFF",
        width: "2",
        style: "solid"
      },
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
      let graphic;
      _context_.graphicsLayer.removeAll();
      if (
        event.tool == "polyline" &&
        event.graphic.geometry.paths[0].length == 3
      ) {
        event.graphic.geometry.paths[0].length = 2;
        _context_.sketchViewModel.complete();
        const p1 = event.graphic.geometry.paths[0][0];
        const p2 = event.graphic.geometry.paths[0][1];
        const circleCenter = new Point({
          x: p1[0],
          y: p1[1]
        });
        const circle = new Circle({
          center: circleCenter,
          radius:
            Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2)) *
            111000
        });
        graphic = new Graphic({
          geometry: circle,
          symbol
        });
        _context_.graphicsLayer.add(graphic);
        return fetchSpace(_context_, graphic);
      }
      if (event.tool == "polyline" || event.state != "complete") return;
      const _graphic = event.graphic;
      if (_graphic.geometry.type == "point") {
        // 修改buffer中的数值进行半径修改
        const { x, y } = _graphic.geometry;
        const buffer = new Circle({
          center: new Point({ x, y }),
          radius: _context_.$store.state.radius || 1000
        });
        graphic = new Graphic({
          geometry: buffer,
          symbol
        });
        _context_.graphicsLayer.add(graphic);
      } else {
        graphic = event.graphic;
        _context_.graphicsLayer.add(graphic);
      }
      return fetchSpace(_context_, graphic);
    });
  });
};

/**
 * 获取公司信息
 * @param {*} _context_ vue类
 * @param {*} param1    空间信息
 */
export const fetchSpace = (_context_, { geometry }) => {
  const { arcgis, layer, s_key } = _context_.spaceValHash;
  loadModules(
    ["esri/tasks/QueryTask", "esri/tasks/support/Query"],
    OPTION
  ).then(([QueryTask, Query]) => {
    const queryTask = new QueryTask({
      url: `${arcgis}/${layer}`
    });
    const query = new Query();
    query.returnGeometry = true;
    query.outFields = ["*"];
    query.geometry = geometry;
    query.where = "1=1";
    queryTask.execute(query).then(({ features }) => {
      _context_.$store.commit(
        "updateSpaces",
        features.map(item => {
          return item.attributes[s_key];
        })
      );
    });
  });
};
