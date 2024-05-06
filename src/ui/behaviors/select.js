import { LINK_STROKE_OPACITY, NODE_STROKE_OPACITY, NODE_FILL } from "../consts";

export default class Select {
  add(links, nodes, link, node) {
    this._links = links;
    this._nodes = nodes;
    this._link = link;
    this._node = node;

    this._selected = this._selected.bind(this);
    node.on("click", this._selected);
  }

  cleanSelection() {
    this._link.attr("stroke-opacity", LINK_STROKE_OPACITY);
    this._node.attr("opacity", NODE_STROKE_OPACITY).attr("fill", (d) => {
      const count = this._links.filter(
        (link) => {return link.source.id === d.id || link.target.id === d.id},
      ).length;
      return NODE_FILL(100 - count * 2.2);
    });
  }

  _selected(_, d) {
    for (const node of this._nodes) {
      if (node.id !== d.id) node.selected = false;
    }
    this.cleanSelection();
    if (!d.selected) {
      const [neighboringLinks, neighboringNodes] = this._getNeighbors(d);
      this._highlightSelection(neighboringLinks, neighboringNodes);
    }
    d.selected = !d.selected;
  }

  _getNeighbors(d) {
    const neighboringLinks = this._links.filter((link) =>
      this._isLinked(link, d),
    );
    const neighboringNodes = this._nodes.filter((node) =>
      neighboringLinks.some((link) => this._isLinked(link, node)),
    );
    return [neighboringLinks, neighboringNodes];
  }

  _isLinked(link, node) {
    return link.source.id === node.id || link.target.id === node.id;
  }

  _highlightSelection(neighboringLinks, neighboringNodes) {
    this._link.attr("stroke-opacity", (d) => {
      return !this._isNeighboringLink(d, neighboringLinks)
        ? 0.1
        : LINK_STROKE_OPACITY;
    });

    this._node.attr("opacity", (d) => {
      return !this._isNeighboringNode(d, neighboringNodes)
        ? 0.1
        : NODE_STROKE_OPACITY;
    });
  }

  _isNeighboringLink(d, neighboringLinks) {
    return neighboringLinks.some(
      (link) =>
        link.source.id === d.source.id && link.target.id === d.target.id,
    );
  }

  _isNeighboringNode(d, neighboringNodes) {
    return neighboringNodes.some((node) => node.id === d.id);
  }
}
