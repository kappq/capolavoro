import * as d3 from "d3";

export default class Drag {
  constructor(simulation) {
    this._simulation = simulation;
  }

  add(node) {
    this._dragStarted = this._dragStarted.bind(this);
    this._dragged = this._dragged.bind(this);
    this._dragEnded = this._dragEnded.bind(this);

    node.call(
      d3
        .drag()
        .on("start", this._dragStarted)
        .on("drag", this._dragged)
        .on("end", this._dragEnded),
    );
  }

  _dragStarted(event) {
    if (!event.active) this._simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  _dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  _dragEnded(event) {
    if (!event.active) this._simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
}
