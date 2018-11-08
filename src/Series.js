const Candlestick = require('./Candlestick');
const EventEmitter = require('events');
const { timeframeToSec } = require('./utils');

class Series extends EventEmitter {
  constructor(product, timeframe) {
    super();
    this.product = product;
    this.timeframe = timeframe;
    this.nexttime = new Date();
    this.candles = [];
    this.currentCandle = new Candlestick(this.price, this.product, this.timeframe, this.nexttime);
    this.lastClose = null;
    this.price = 0;
  }

  openSeriesCandle() {
    this.currentCandle = new Candlestick(this.lastClose || this.price, this.product, this.timeframe, this.nexttime);
    this.emit('open', this.currentCandle);
  }
  
  closeSeriesCandle() {
    this.currentCandle.setClose();
    this.lastClose = this.currentCandle.close;
    if (this.currentCandle.open && this.currentCandle.open !== 0) {
      this.candles.push(this.currentCandle)
      this.emit('close', this.currentCandle);
    }
  }
  
  onSeriesClockTick(time) {
    this.nexttime = new Date(time);
    if (this.currentCandle) {
      this.currentCandle.timestamp = new Date(time - (timeframeToSec(this.timeframe) * 1000))
      this.closeSeriesCandle();
    }
    this.openSeriesCandle();
  }
}

module.exports = Series;