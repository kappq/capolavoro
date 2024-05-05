import moment from "moment";

import Node from "./node";
import Link from "./link";
import { ConflictIntensity } from "../enums/conflict_intensity";
import { ConflictRegion } from "../enums/conflict_region";
import { ConflictType } from "../enums/conflict_type";

const SEPARATOR = /\s*,\s*(?![^(]*\))/g;

export default class Graph {
  constructor(dataset) {
    this.nodes = [];
    this.links = [];

    for (const row of dataset) {
      const [countries, opposingCountries] = this._getCountries(row);
      const [countryCodes, opposingCountryCodes] = this._getCountryCodes(row);

      const conflictType = this._getConflictType(row);
      const conflictIntensity = this._getConflictIntensity(row);
      const conflictRegion = this._getConflictRegion(row);
      const [conflictStart, conflictEnd] = this._getConflictDate(row);

      const conflictId = parseInt(row.id);
      const conflictVictims = parseInt(row.bdeadbes); // TODO: handle -999 victims
      const conflictLocation = row.location;

      for (let i = 0; i < countries.length; i++) {
        const country = countries[i];
        const countryCode = countryCodes[i];

        this._addNode(country, countryCode);

        for (let j = 0; j < opposingCountries.length; j++) {
          const opposingCountry = opposingCountries[j];
          const opposingCountryCode = opposingCountryCodes[j];

          // TODO: this should probably be done outside the loop
          this._addNode(opposingCountry, opposingCountryCode);

          const link = new Link(
            country,
            opposingCountry,
            conflictId,
            conflictVictims,
            conflictLocation,
            conflictType,
            conflictIntensity,
            conflictRegion,
            conflictStart,
            conflictEnd,
          );
          this.links.push(link);
        }
      }
    }
  }

  _getCountries(row) {
    // Get countries from side A and their supporters
    let countries = row.sidea.split(SEPARATOR);
    if (row.sidea2nd) {
      const supporters = row.sidea2nd.split(SEPARATOR);
      countries = countries.concat(supporters);
    }

    // Get countries from side B and their supporters
    let opposingCountries = row.sideb.split(SEPARATOR);
    if (row.sideb2nd) {
      const supporters = row.sideb2nd.split(SEPARATOR);
      opposingCountries = opposingCountries.concat(supporters);
    }

    return [countries, opposingCountries];
  }

  _getCountryCodes(row) {
    // Get country codes from side A and their supporters
    let countryCodes = row.gwnoa.split(SEPARATOR);
    if (row.gwnoa2nd) {
      const supporters = row.gwnoa2nd.split(SEPARATOR);
      countryCodes = countryCodes.concat(supporters);
    }

    // Get country codes from side B and their supporters
    let opposingCountryCodes = row.gwnob.split(SEPARATOR);
    if (row.gwnob2nd) {
      const supporters = row.gwnob2nd.split(SEPARATOR);
      opposingCountryCodes = opposingCountryCodes.concat(supporters);
    }

    return [countryCodes, opposingCountryCodes];
  }

  _getConflictType(row) {
    let conflictType;
    if (row.type === "1") conflictType = ConflictType.Extrasystemic;
    else if (row.type === "2") conflictType = ConflictType.Interstate;
    else if (row.type === "3") conflictType = ConflictType.Internal;
    else if (row.type === "4") conflictType = ConflictType.Internationalized;
    else throw new Error(`Invalid conflict type: '${row.type}'`);

    return conflictType;
  }

  _getConflictIntensity(row) {
    let conflictIntensity;
    if (row.int === "1") conflictIntensity = ConflictIntensity.Minor;
    else if (row.int === "2") conflictIntensity = ConflictIntensity.War;
    else throw new Error(`Invalid conflict intensity: '${row.int}'`);

    return conflictIntensity;
  }

  _getConflictRegion(row) {
    let conflictRegion;
    if (row.region === "1") conflictRegion = ConflictRegion.Europe;
    else if (row.region === "2") conflictRegion = ConflictRegion.MiddleEast;
    else if (row.region === "3") conflictRegion = ConflictRegion.Asia;
    else if (row.region === "4") conflictRegion = ConflictRegion.Africa;
    else if (row.region === "5") conflictRegion = ConflictRegion.Americas;
    else throw new Error(`Invalid conflict region: '${row.region}'`);

    return conflictRegion;
  }

  _getConflictDate(row) {
    const conflictStart = moment(row.startdate2, "MM/DD/YYYY");
    let conflictEnd;
    if (parseInt(row.epend)) conflictEnd = moment(row.ependdate, "MM/DD/YYYY");

    return [conflictStart, conflictEnd];
  }

  _containsNode(nodeId) {
    return this.nodes.some((node) => node.id === nodeId);
  }

  _addNode(country, countryCode) {
    if (!this._containsNode(country)) {
      const node = new Node(country);
      // TODO: the handling for -99 country code should probably
      // be done when initially parsing the fields
      if (countryCode && countryCode !== "-99") node.code = countryCode;
      this.nodes.push(node);
    }
  }
}
