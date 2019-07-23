class Candlestick {
  constructor(open, product, timeframe, timestamp) {
    this.timestamp = timestamp;
    this.timeframe = timeframe;
    this.product = product;
    this.price = this.open;
    this.open = open;
    this.high = this.open;
    this.low = this.open;
    this.close = this.open;
    this.volume = 0;
    this.size = 0;
    this.wick = {};
    this.wick.top = 0;
    this.wick.bottom = 0;
    this.wick.size = 0;
    this.wick.ratio = 0;
    this.closed = false;
    this.setMarket();
  }

  setMarket() {
    let markets = {
      true: 'bullish',
      false: 'bearish'
    }
    this.market = markets[this.price >= this.open];
  }

  setClose() {
    this.closed = true;
  }

  updatePrice(price, size) {
    this.price = !this.closed ? Number.parseFloat(price).toFixed(8) : Number.parseFloat(this.price).toFixed(8);
    this.high = this.price > this.high ? Number.parseFloat(this.price).toFixed(8) : Number.parseFloat(this.high).toFixed(8);
    this.low = this.price < this.low ? Number.parseFloat(this.price).toFixed(8) : Number.parseFloat(this.low).toFixed(8);
    this.close = Number.parseFloat(this.price).toFixed(8);
    this.volume = (Number.parseFloat(this.volume) + Number.parseFloat(size)).toFixed(8);
    this.size = (Number.parseFloat(this.high) - Number.parseFloat(this.low)).toFixed(8);
    if (this.price >= this.open) {
      this.wick.top = (Number.parseFloat(this.high) - Number.parseFloat(this.close)).toFixed(8);
      this.wick.bottom = (Number.parseFloat(this.open) - Number.parseFloat(this.low)).toFixed(8);
    } else {
      this.wick.top = (Number.parseFloat(this.high) - Number.parseFloat(this.open)).toFixed(8);
      this.wick.bottom = (Number.parseFloat(this.close) - Number.parseFloat(this.low)).toFixed(8);
    }
    this.wick.size = Math.abs(Number.parseFloat(this.wick.top) - Number.parseFloat(this.wick.bottom)).toFixed(8);
    if (Number.parseFloat(this.size)> 0) {
      this.wick.ratio = (Number.parseFloat(this.wick.size) / Number.parseFloat(this.size)).toFixed(8);
    } else {
      this.wick.ratio = Number.parseFloat(0).toFixed(8);
    }
    this.setMarket();
  }
}

module.exports = Candlestick;
