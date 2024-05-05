export default class Link {
  constructor(source, target, conflictId, conflictVictims, conflictLocation, conflictType, conflictIntensity, conflictRegion, conflictStart, conflictEnd) {
    this.source = source;
    this.target = target;
    this.conflictId = conflictId;
    this.conflictVictims = conflictVictims;
    this.conflictLocation = conflictLocation;
    this.conflictType = conflictType;
    this.conflictIntensity = conflictIntensity;
    this.conflictRegion = conflictRegion;
    this.conflictStart = conflictStart;
    this.conflictEnd = conflictEnd;
  }
}
