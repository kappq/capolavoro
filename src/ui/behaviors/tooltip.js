import * as d3 from "d3";

export default class Tooltip {
  constructor() {
    this._tooltip = d3.create("div").classed("tooltip", true);
    document.body.append(this._tooltip.node());
  }

  add(node) {
    this._tooltipon = this._tooltipon.bind(this);
    this._tooltipmove = this._tooltipmove.bind(this);
    this._tooltipout = this._tooltipout.bind(this);

    node
      .on("mouseover", this._tooltipon)
      .on("mousemove", this._tooltipmove)
      .on("mouseout", this._tooltipout);
  }

  _tooltipon(e, d) {
    this._tooltip
      .style("opacity", 1)
      .text(d.id)
      .style("left", e.pageX + 10 + "px")
      .style("top", e.pageY - 30 + "px");
  }

  _tooltipmove(e) {
    this._tooltip
      .style("left", e.pageX + 10 + "px")
      .style("top", e.pageY - 30 + "px");
  }

  _tooltipout() {
    this._tooltip.style("opacity", 0);
  }
}
