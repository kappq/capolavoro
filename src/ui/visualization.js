import * as d3 from "d3";

import {
  WIDTH,
  HEIGHT,
  LINK_STROKE_OPACITY,
  LINK_STROKE_COLOR,
  NODE_STROKE_WIDTH,
  NODE_STROKE_COLOR,
} from "./consts";
import Zoom from "./zoom";
import Drag from "./drag";

export default class Visualization {
  constructor(graph) {
    this.graph = graph;
    this.links = graph.links.map((d) => ({ ...d }));
    this.nodes = graph.nodes.map((d) => ({ ...d }));

    this.svg = this._createSvg();
    this.simulation = this._createSimulation();
    [this.linkGroup, this.link] = this._createLinks();
    [this.nodeGroup, this.node] = this._createNodes();

    this.zoom = new Zoom(this.linkGroup, this.nodeGroup);
    this.drag = new Drag(this.simulation);
  }

  start() {
    this._prepare();
    this._run();
  }

  _createSimulation() {
    const forceLink = d3.forceLink().id((d) => d.id);
    return d3
      .forceSimulation()
      .force("link", forceLink)
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX())
      .force("y", d3.forceY());
  }

  _createSvg() {
    return d3
      .create("svg")
      .attr("viewBox", [-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT]);
  }

  _createLinks() {
    const linkGroup = this.svg
      .append("g")
      .attr("stroke-opacity", LINK_STROKE_OPACITY)
      .attr("stroke", LINK_STROKE_COLOR);
    const link = linkGroup.selectAll("line");

    return [linkGroup, link];
  }

  _createNodes() {
    const nodeGroup = this.svg
      .append("g")
      .attr("stroke-width", NODE_STROKE_WIDTH)
      .attr("stroke", NODE_STROKE_COLOR);
    const node = nodeGroup.selectAll("circle");

    return [nodeGroup, node];
  }

  _prepare() {
    this.zoom.add(this.svg);

    this._ticked = this._ticked.bind(this);
    this.simulation.on("tick", this._ticked);

    document.body.append(this.svg.node());
  }

  _ticked() {
    this.link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    this.node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  }

  _run() {
    this.link = this.link.data(this.links).join("line");
    this.node = this.node
      .data(this.nodes)
      .join("circle")
      .attr("r", 5)
      .attr("fill", "black");

    this.drag.add(this.node);

    this.simulation.nodes(this.nodes);
    this.simulation.force("link").links(this.links);
  }
}
