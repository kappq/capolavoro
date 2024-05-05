import * as d3 from "d3";

import { WIDTH, HEIGHT } from "../consts";

export default class Zoom {
  constructor(linkGroup, nodeGroup) {
    this._linkGroup = linkGroup;
    this._nodeGroup = nodeGroup;
  }

  add(svg) {
    this._zoomed = this._zoomed.bind(this);

    svg.call(
      d3
        .zoom()
        .extent([
          [0, 0],
          [WIDTH, HEIGHT],
        ])
        .scaleExtent([1, 8])
        .on("zoom", this._zoomed),
    );
  }

  _zoomed({ transform }) {
    this._linkGroup.attr("transform", transform);
    this._nodeGroup.attr("transform", transform);
  }
}
