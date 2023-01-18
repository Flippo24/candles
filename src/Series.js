const Candlestick = require('./Candlestick');
const EventEmitter = require('events');
const { timeframeToSec } = require('./utils');

class Series extends EventEmitter {
  constructor(product, timeframe, serieslength) {
    super();
    this.product = product;
    this.timeframe = timeframe;
    this.length = serieslength;
    this.nexttime = new Date();
    this.candles = [];
    this.currentCandle = new Candlestick(this.price, this.product, this.timeframe, this.nexttime);
    this.lastClose = null;
    this.price = 0;
    this.onSeriesClockTick = this.onSeriesClockTick.bind(this)
  }

  openSeriesCandle() {
    this.currentCandle = new Candlestick(this.lastClose || this.price, this.product, this.timeframe, this.nexttime);
    this.emit('open', this.currentCandle, this.candles);
  }
  
  closeSeriesCandle() {
    this.currentCandle.setClose();
    this.lastClose = this.currentCandle.close;
    if (this.currentCandle.open && this.currentCandle.open !== 0) {
      this.candles.push(this.currentCandle)
      if(this.candles.length > this.length) {
        this.candles.shift()
      }
      this.emit('close', this.currentCandle, this.candles);
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