const EventEmitter = require('events') 
const { timeframeToSec, nextTime } = require('./utils');

class Clock extends EventEmitter {
  constructor(resolution='1s') {
    super();
    this.started = false;
    this.resolution = timeframeToSec(resolution);
    this.resolutions = [];
    this.nextTimes = {};
    this.currentTicks = [];
  }

  start() {
    if (!this.started) {
      this.now = Date.now().valueOf();
      this.getNextTimes();
      setInterval(this.tick.bind(this), 1);
      this.started = true;
    }
    return this;
  }

  tick() {
    let emit = false;
    this.now = Date.now().valueOf();
    for (var resolution in this.nextTimes) {
      if (this.now >= this.nextTimes[resolution]) {
        this.currentTicks.push(resolution);
        emit = true;
      }
    }
    emit && this.emit('tick', this.currentTicks);
    this.getNextTimes();
    this.currentTicks = [];
  }

  getNextTimes() {
    this.resolutions.forEach(resolution => {
      this.nextTimes[resolution] = nextTime(this.now, timeframeToSec(resolution));
    });
    return this.nextTimes;
  }

  addResolution(resolution) {
    this.resolutions.indexOf(resolution) === -1 && (this.resolutions.push(resolution));
  }
}

let instance;

module.exports.getInstance = function(resolution='1s') {
  if (!instance) {
    instance = new Clock(resolution);
  }
  instance.addResolution(resolution);
  return instance;
}
