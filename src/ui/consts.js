import * as d3 from "d3";

export const WIDTH = window.innerWidth;
export const HEIGHT = window.innerHeight;

export const LINK_STROKE_OPACITY = 0.6;
export const LINK_STROKE_COLOR = "#999";

export const NODE_STROKE_OPACITY = 1;
export const NODE_STROKE_COLOR = "#fff";
export const NODE_STROKE_WIDTH = 1.5;
export const NODE_RADIUS = 5;
export const NODE_FILL = d3
  .scaleSequential(d3.interpolateRdYlGn)
  .domain([0, 100]);
