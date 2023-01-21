const Clock = require('./Clock');
const EventEmitter = require('events');
const Series = require('./Series.js');

class candles extends EventEmitter {
  constructor(options) {
    super();
    this.series = {};
    this.options = {
      timediff: {
        enabled: options.timediff.enabled || false,
        fixed: options.timediff.fixed || false,
        value: options.timediff.value || 0,
        samples: options.timediff.samples || 100,
      }
    };
    this.clock = new Clock;
    this.clock.setOptions(this.options.timediff)
  }

  addProduct(product, timeframe, serieslength=0) {
    if (!product) {
      throw 'product is missing'
    }
    if (!timeframe) {
      throw 'timeframe is missing'
    }
    (Array.isArray(product) ? product : [product]).forEach(product => {
      if (!this.series[product]) {
        this.addTimeframe(product, timeframe, serieslength);
      }
    })
  };

  addTimeframe(product, timeframe, serieslength) {
    (Array.isArray(timeframe) ? timeframe : [timeframe]).forEach(timeframe => {
      if (this.series[product]?.timeframe[timeframe]) {
        return
      }
      this.addSeries(product, timeframe, serieslength);
    })
  }

  addSeries(product, timeframe, serieslength) {
    if (!this.clock.resolutions[timeframe]) {
      this.clock.addResolution(timeframe);
      this.clock.start();
    }
    var series = new Series(product, timeframe, serieslength);
    this.clock.on('tick ' + timeframe, series.onSeriesClockTick);
    series.on('open', this.seriesOpen.bind(this));
    series.on('close', this.seriesClose.bind(this));
    if (!this.series[product]) {
      this.series[product] = {};
    }
    if (!this.series[product].timeframe) {
      this.series[product].timeframe = {};
    }
    this.series[product].timeframe[timeframe] = series;
  }

  getTimeDrift() {
      return this.clock.timediff.drift
  }

  removeProduct(product, timeframe) {
    (Array.isArray(product) ? product : [product]).forEach(product => {
      if (this.series[product]) {
        this.removeTimeframe(product, timeframe);
        Object.keys(this.series[product].timeframe).length || delete this.series[product];
      }
    })
  }

  removeTimeframe(product, timeframe) {
    (Array.isArray(timeframe) ? timeframe : [timeframe]).forEach(timeframe => {
      if (this.series[product]?.timeframe[timeframe]) {
        this.removeSeries(product, timeframe)
      }
    })
  }

  removeSeries(product, timeframe) {
    this.clock.off('tick ' + timeframe, this.series[product].timeframe[timeframe].onSeriesClockTick);
    this.series[product].timeframe[timeframe].off('open', this.seriesOpen.bind(this));
    this.series[product].timeframe[timeframe].off('close', this.seriesClose.bind(this));
    delete this.series[product].timeframe[timeframe];
  }

  SetSeriesPrice(product, price, size=0) {
    Object.keys(this.series[product].timeframe).forEach(timeframe => {
      if (!this.series[product].timeframe[timeframe]) {
        return;
      }
      this.series[product].timeframe[timeframe].price = Number.parseFloat(price);
      this.series[product].timeframe[timeframe].currentCandle.updatePrice(Number.parseFloat(price), Number.parseFloat(size).toFixed(8));
      this.emit('current ' + this.series[product].timeframe[timeframe].product + ' ' + this.series[product].timeframe[timeframe].timeframe, this.series[product].timeframe[timeframe].currentCandle, this.series[product].timeframe[timeframe].candles);
      this.emit('current ' + this.series[product].timeframe[timeframe].product, this.series[product].timeframe[timeframe].currentCandle, this.series[product].timeframe[timeframe].candles);
      this.emit('current ' + this.series[product].timeframe[timeframe].timeframe, this.series[product].timeframe[timeframe].currentCandle, this.series[product].timeframe[timeframe].candles);
      this.emit('current', this.series[product].timeframe[timeframe].currentCandle, this.series[product].timeframe[timeframe].candles);
    });
  }

  seriesClose(currentCandle, candles) {
    this.emit('close ' + currentCandle.product, currentCandle, candles);
    this.emit('close ' + currentCandle.product + ' ' + currentCandle.timeframe, currentCandle, candles);
    this.emit('close ' + currentCandle.timeframe, currentCandle, candles);
    this.emit('close', currentCandle, candles);
  }

  seriesOpen(currentCandle, candles) {
    this.emit('open ' + currentCandle.product, currentCandle, candles);
    this.emit('open ' + currentCandle.product + ' ' + currentCandle.timeframe, currentCandle, candles);
    this.emit('open ' + currentCandle.timeframe, currentCandle, candles);
    this.emit('open', currentCandle, candles);
  }

  adjustClock(time) {
    if (this.options.timediff.enabled && !this.options.timediff.fixed) {
      this.clock.adjustClock(new Date().valueOf() - new Date(time).valueOf())
    }
  }
}

module.exports = candles;
