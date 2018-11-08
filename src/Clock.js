const EventEmitter = require('events') 
const { timeframeToSec, nextTime } = require('./utils');
const {average} = require('./utils');

class Clock extends EventEmitter {
  constructor() {
    super();
    this.now = Date.now().valueOf();
    this.resolutions = {};
    this._maxListeners = 1000;
    this.timediff = {
      enabled: false,
      fixed: false,
      value: 0,
      drift: 0,
      arr: [],
      samples: 100,
    };
  }

  start() {
    if (!this.started) {
      setInterval(this.tick.bind(this), 1);
    }
    return this;
  }

  tick() {
    this.now = Date.now().valueOf();
    Object.keys(this.resolutions).forEach(resolution => {
      if (this.now >= this.resolutions[resolution].nexttime - this.timediff.drift) {
        this.emit('tick '+ resolution, this.resolutions[resolution].nexttime);
        this.resolutions[resolution].nexttime = this.resolutions[resolution].timeframe * 1000 + this.resolutions[resolution].nexttime
      }
    })
  }

  getNextTimes() {
    Object.keys(this.resolutions).forEach(resolution => {
      this.resolutions[resolution].nexttime = nextTime(this.now, this.resolutions[resolution].timeframe);
    })
  }

  addResolution(resolution) {
    if (!this.resolutions[resolution]) {
      this.resolutions[resolution] = {
        timeframe: timeframeToSec(resolution),
        nexttime :nextTime(Date.now().valueOf(), timeframeToSec(resolution))
      };
    }
  }

  setOptions(options) {
    this.timediff.enabled = options.enabled;
    this.timediff.fixed = options.fixed;
    this.timediff.value = options.value;    
    this.timediff.samples = options.samples;
    if (this.timediff.enabled && this.timediff.fixed) {
      this.timediff.drift = this.timediff.value;
    } 
  }

  adjustClock(time) {
    if (this.timediff.arr.push(time) > this.timediff.samples) {
      this.timediff.arr.shift()
    }
    this.timediff.drift = average(this.timediff.arr)
  }
}

module.exports = Clock;

let instance;

module.exports.getInstance = function(resolution) {
  if (!instance) {
    instance = new Clock();
  }
  if (resolution) {
    instance.addResolution(resolution);
  }
  return instance;
}
