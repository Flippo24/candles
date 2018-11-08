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
    this.clock = new Clock.getInstance();
    this.clock.setOptions(this.options.timediff)
  }

  addProduct(product, timeframe) {
    if (!product) {
      throw 'product is missing'
    }
    if (!timeframe) {
      throw 'timeframe is missing'
    }
    if (Array.isArray(product)) {
      product.forEach(product => {
        this.addTimeframe(product, timeframe);
      })
    } else {
      this.addTimeframe(product,  timeframe);
    }
  };

  addTimeframe(product, timeframe) {
    if (Array.isArray(timeframe)) {
      timeframe.forEach(timeframe => {
        this.addSeries(product, timeframe);
      })
    } else {
      this.addSeries(product, timeframe);
    }
  }

  addSeries(product, timeframe) {
    if (!this.clock || !this.clock.resolutions[timeframe]) {
      this.clock = new Clock.getInstance(timeframe).start();
    }
    var series = new Series(product, timeframe);
    this.clock.on('tick '+ timeframe, series.onSeriesClockTick.bind(series));
    series.on('open',this.seriesOpen.bind(this));
    series.on('close',this.seriesClose.bind(this)); 
    if (!this.series[product]) {
      this.series[product] = {};
    }
    if (!this.series[product].timeframe) {
      this.series[product].timeframe = {};
    }
    this.series[product].timeframe[timeframe] = series;
  }

  SetSeriesPrice(product, price, size=0) {
    Object.keys(this.series[product].timeframe).forEach(timeframe => {
      this.series[product].timeframe[timeframe].price = Number.parseFloat(price);
      this.series[product].timeframe[timeframe].currentCandle.updatePrice(Number.parseFloat(price), Number.parseFloat(size).toFixed(8));
      this.emit('current ' + this.series[product].timeframe[timeframe].timeframe, this.series[product].timeframe[timeframe].currentCandle);
      this.emit('current', this.series[product].timeframe[timeframe].currentCandle);
    });
  }

  seriesClose(currentCandle) {
    this.emit('close ' + currentCandle.product, currentCandle);
    this.emit('close ' + currentCandle.product + ' ' + currentCandle.timeframe, currentCandle);
    this.emit('close ' + currentCandle.timeframe, currentCandle);
    this.emit('close', currentCandle);
  }

  seriesOpen(currentCandle) {
    this.emit('open ' + currentCandle.product, currentCandle);
    this.emit('open ' + currentCandle.product + ' ' + currentCandle.timeframe, currentCandle);
    this.emit('open ' + currentCandle.timeframe, currentCandle);
    this.emit('open', currentCandle);
  }

  adjustClock(time) {
    if (this.options.timediff.enabled && !this.options.timediff.fixed) {
      this.clock.adjustClock(new Date().valueOf() - new Date(time).valueOf())
    }
  }
}

module.exports = candles;
