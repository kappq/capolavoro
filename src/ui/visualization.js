import * as d3 from "d3";

import {
  WIDTH,
  HEIGHT,
  LINK_STROKE_OPACITY,
  LINK_STROKE_COLOR,
  NODE_STROKE_COLOR,
  NODE_STROKE_WIDTH,
  NODE_RADIUS,
  NODE_FILL,
} from "./consts";
import Zoom from "./behaviors/zoom";
import Drag from "./behaviors/drag";
import Tooltip from "./behaviors/tooltip";
import Select from "./behaviors/select";
import Options from "./options";

export default class Visualization {
  constructor(graph) {
    this.graph = graph;
    this.links = graph.links.map((d) => ({ ...d }));
    this.nodes = graph.nodes.map((d) => ({ ...d }));

    this.svg = this._createSvg();
    this.simulation = this._createSimulation();
    [this.linkGroup, this.link] = this._createLinks();
    [this.nodeGroup, this.node] = this._createNodes();

    this._zoom = new Zoom(this.linkGroup, this.nodeGroup);
    this._drag = new Drag(this.simulation);
    this._tooltip = new Tooltip();
    this._select = new Select();

    this._options = new Options(this);
  }

  start() {
    this._prepare();
    this._run();
  }

  update() {
    this._select.cleanSelection();
    [this.links, this.nodes] = this._options.filter(this.graph);

    const old = new Map(this.node.data().map((d) => [d.id, d]));
    this.nodes = this.nodes.map((d) => ({ ...old.get(d.id), ...d }));
    this.links = this.links.map((d) => ({ ...d }));

    this._run();
    this.simulation.alpha(1).restart();
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
    this._zoom.add(this.svg);

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
      .attr("r", NODE_RADIUS)
      .attr("fill", (d) => {
        const count = this.links.filter(
          (link) => link.source === d.id || link.target === d.id,
        ).length;
        return NODE_FILL(100 - count * 2.2);
      });

    this._drag.add(this.node);
    this._tooltip.add(this.node);
    this._select.add(this.links, this.nodes, this.link, this.node);

    this.simulation.nodes(this.nodes);
    this.simulation.force("link").links(this.links);
  }
}
