const Clock = require('./Clock');
const Candlestick = require('./Candlestick');
const EventEmitter = require('events');

class Chart extends EventEmitter {
  constructor({product, timeframe='1s' }) {
    super();
    this.product = product;
    this.timeframe = timeframe;
    this.clock = new Clock.getInstance(this.timeframe).start();
    this.price = 0;
    this.clock.on('tick', this.onClockTick.bind(this, this.clock));
    this.candles = [];
    this.currentCandle = null;
    this.lastClose = null;
  }

  SetPrice(price, size) {
    this.price = Number.parseFloat(price);
    this.currentCandle.updatePrice(Number.parseFloat(price), Number.parseFloat(size).toFixed(8));
    this.emit('current', this.currentCandle);
  }

  closeCandle() {
    this.currentCandle.setClose();
    this.lastClose = this.currentCandle.close;
    if (this.currentCandle.open !== 0) {
      this.candles.push(this.currentCandle)
      this.emit('close', this.currentCandle);
    }
  }

  openCandle() {
    this.currentCandle = new Candlestick(this.lastClose || this.price, this.product);
    this.emit('open', this.currentCandle);
  }

  onClockTick(clock) {
    let myTick = clock.currentTicks.indexOf(this.timeframe) !== -1;
    myTick && this.currentCandle && this.closeCandle();
    (myTick || !this.currentCandle) && this.openCandle();
  }

  start() {
    if (!this.currentCandle) {
      this.openCandle();
    }
    return this;
  }
}

module.exports = Chart;
