/* eslint-disable */
import { loadModules } from "esri-loader";
import { colorHash } from "@/components/common/colorHash";
import { ALLLANDREGULATORY, OPTION } from "@/components/common/config";
/**
 * 查询控规数据,画在地图上
 * @param {*} _context_
 * @param {*} code 地块编号
 */
export const forceKg = async (_context_, code) => {
  clearKg(_context_);
  const url = `${ALLLANDREGULATORY}/0`;
  const { data } = await _context_.fetchLocatedSpace({
    where: `DKBH = '${code}'`,
    url
  });
  const { features } = data;
  loadModules(
    [
      "esri/geometry/Polygon",
      "esri/geometry/Point",
      "esri/layers/GraphicsLayer",
      "esri/Graphic"
    ],
    OPTION
  ).then(([Polygon, Point, GraphicsLayer, Graphic]) => {
    const kgs = [];
    const kdLayer = new GraphicsLayer({ id: "kg" });
    features.map(item => {
      const { attributes } = item;
      const { color, outline } = colorHash[attributes.YDDM];
      const geometry = new Polygon(item.geometry);
      const center = _context_.$util.getPolygonCenter(geometry.rings);
      const symbol = {
        type: "simple-fill",
        color,
        outline: {
          color: outline,
          width: 1
        }
      };
      const polygonGraphic = new Graphic({
        geometry,
        symbol
      });
      kdLayer.add(polygonGraphic);
      const textGraphic = new Graphic({
        geometry: new Point({ x: center[0], y: center[1] }),
        symbol: {
          type: "text",
          color: "#fff",
          haloColor: "#000",
          haloSize: "1px",
          text: `[${attributes.DKBH}] ${attributes.YDXZ}`,
          yoffset: 10,
          font: {
            size: 12,
            family: "sans-serif"
          }
        }
      });
      kdLayer.add(textGraphic);
      kgs.push({
        ...attributes,
        center
      });
    });
    _context_.map.add(kdLayer);
    _context_.$store.commit("updateKgs", kgs);
  });
};
/**
 * 清除控规信息
 * @param {*} _context_
 */
export const clearKg = _context_ => {
  const layer = _context_.map.findLayerById("kg");
  layer && _context_.map.remove(layer);
  _context_.$store.commit("updateKgs", []);
};
