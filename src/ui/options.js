import * as d3 from "d3";

import { ConflictType } from "../enums/conflict_type";
import { ConflictIntensity } from "../enums/conflict_intensity";
import { ConflictRegion } from "../enums/conflict_region";
import { PartyType } from "../enums/party_type";

export default class Options {
  constructor(visualization) {
    this._visualization = visualization;

    const container = d3.create("div").classed("options", true);

    this._setupConflictTypeOptions(container);
    this._setupConflictIntensityOptions(container);
    this._setupConflictRegionOptions(container);
    this._setupConflictDateOptions(container);
    this._setupPartyTypeOptions(container);

    document.body.append(container.node());
  }

  filter(graph) {
    const links = graph.links.filter(
      (link) =>
        this._filterByConflictType(link) &&
        this._filterByConflictIntensity(link) &&
        this._filterByConflictRegion(link) &&
        this._filterByConflictDate(link) &&
        this._filterByPartyType(link, graph.nodes),
    );

    const nodes = graph.nodes.filter((node) =>
      links.some((link) => link.source === node.id || link.target === node.id),
    );

    return [links, nodes];
  }

  _setupConflictTypeOptions(container) {
    const details = container.append("details").attr("open", true);
    details.append("summary").text("Conflict Type");

    const ul = details.append("ul");

    this._addCheckbox(ul, ConflictType.Extrasystemic, "Extrasystemic");
    this._addCheckbox(ul, ConflictType.Interstate, "Interstate");
    this._addCheckbox(ul, ConflictType.Internal, "Internal");
    this._addCheckbox(ul, ConflictType.Internationalized, "Internationalized");
  }

  _setupConflictIntensityOptions(container) {
    const details = container.append("details").attr("open", true);
    details.append("summary").text("Conflict Intensity");

    const ul = details.append("ul");

    this._addCheckbox(ul, ConflictIntensity.Minor, "Minor");
    this._addCheckbox(ul, ConflictIntensity.War, "War");
  }

  _setupConflictRegionOptions(container) {
    const details = container.append("details").attr("open", true);
    details.append("summary").text("Conflict Region");

    const ul = details.append("ul");

    this._addCheckbox(ul, ConflictRegion.Europe, "Europe");
    this._addCheckbox(ul, ConflictRegion.MiddleEast, "Middle East");
    this._addCheckbox(ul, ConflictRegion.Asia, "Asia");
    this._addCheckbox(ul, ConflictRegion.Africa, "Africa");
    this._addCheckbox(ul, ConflictRegion.Americas, "Americas");
  }

  _setupConflictDateOptions(container) {
    const details = container.append("details").attr("open", true);
    details.append("summary").text("Conflict Date");

    const ul = details.append("ul");

    this._addNumberInput(ul, "minYear", " Minimum Year", 1946, 2022, 1946);
    this._addNumberInput(ul, "maxYear", " Maximum Year", 1946, 2022, 2022);
  }

  _setupPartyTypeOptions(container) {
    const details = container.append("details").attr("open", true);
    details.append("summary").text("Conflict Date");

    const ul = details.append("ul");

    this._addCheckbox(ul, PartyType.State, "State");
    this._addCheckbox(ul, PartyType.NonState, "Non-state");
  }

  _addCheckbox(ul, option, label) {
    this[option] = true;
    const li = ul.append("li");
    const checkbox = li
      .append("input")
      .attr("type", "checkbox")
      .attr("checked", true)
      .on("change", () => {
        this[option] = checkbox.checked;
        this._visualization.update();
      })
      .node();
    li.append("label").text(label);
  }

  _addNumberInput(ul, option, label, min, max, value) {
    this[option] = value;
    const li = ul.append("li");
    const input = li
      .append("input")
      .attr("type", "number")
      .attr("min", min)
      .attr("max", max)
      .attr("value", value)
      .style("width", "50px")
      .on("change", () => {
        this[option] = parseInt(input.value);
        this._visualization.update();
      })
      .node();
    li.append("label").text(label);
  }

  _filterByConflictType(link) {
    return (
      (this[ConflictType.Extrasystemic] &&
        link.conflictType === ConflictType.Extrasystemic) ||
      (this[ConflictType.Interstate] &&
        link.conflictType === ConflictType.Interstate) ||
      (this[ConflictType.Internal] &&
        link.conflictType === ConflictType.Internal) ||
      (this[ConflictType.Internationalized] &&
        link.conflictType === ConflictType.Internationalized)
    );
  }

  _filterByConflictIntensity(link) {
    return (
      (this[ConflictIntensity.Minor] &&
        link.conflictIntensity === ConflictIntensity.Minor) ||
      (this[ConflictIntensity.War] &&
        link.conflictIntensity === ConflictIntensity.War)
    );
  }

  _filterByConflictRegion(link) {
    return (
      (this[ConflictRegion.Europe] &&
        link.conflictRegion === ConflictRegion.Europe) ||
      (this[ConflictRegion.MiddleEast] &&
        link.conflictRegion === ConflictRegion.MiddleEast) ||
      (this[ConflictRegion.Asia] &&
        link.conflictRegion === ConflictRegion.Asia) ||
      (this[ConflictRegion.Africa] &&
        link.conflictRegion === ConflictRegion.Africa) ||
      (this[ConflictRegion.Americas] &&
        link.conflictRegion === ConflictRegion.Americas)
    );
  }

  _filterByConflictDate(link) {
    // TODO: add ongoing conflict option
    return (
      link.conflictStart.year() >= this.minYear &&
      (!link.conflictEnd || link.conflictEnd.year() <= this.maxYear)
    );
  }

  _filterByPartyType(link, nodes) {
    const source = nodes.find((node) => node.id === link.source);
    const target = nodes.find((node) => node.id === link.target);
    return (
      (this[PartyType.State] && this[PartyType.NonState]) ||
      (this[PartyType.State] && source.code && target.code) ||
      (this[PartyType.NonState] && !source.code && !target.code)
    );
  }
}
