class Candlestick {
  constructor(open, product, timeframe, timestamp) {
    this.timestamp = +timestamp;
    this.timeframe = timeframe;
    this.product = product;
    this.price = +open;
    this.open = open;
    this.high = +open;
    this.low = +open;
    this.close = +open;
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


    this.price = !this.closed ? Number.parseFloat(price) : Number.parseFloat(this.price);

    if (!this.open || this.open === 0) {
      this.open = Number.parseFloat(this.price);
    }

    if (+this.price > +this.high || +this.high === 0) {
      this.high = Number.parseFloat(this.price)
    };
    if (+this.price < +this.low || +this.low === 0) {
      this.low = Number.parseFloat(this.price)
    };

    this.close = Number.parseFloat(this.price);

    this.volume = (Number.parseFloat(this.volume) + Number.parseFloat(size));
    this.size = (Number.parseFloat(this.high) - Number.parseFloat(this.low));
    if (+this.price >= +this.open) {
      this.wick.top = (Number.parseFloat(this.high) - Number.parseFloat(this.close));
      this.wick.bottom = (Number.parseFloat(this.open) - Number.parseFloat(this.low));
    } else {
      this.wick.top = (Number.parseFloat(this.high) - Number.parseFloat(this.open));
      this.wick.bottom = (Number.parseFloat(this.close) - Number.parseFloat(this.low));
    }
    this.wick.size = Math.abs(Number.parseFloat(this.wick.top) - Number.parseFloat(this.wick.bottom));
    if (Number.parseFloat(this.size) > 0) {
      this.wick.ratio = (Number.parseFloat(this.wick.size) / Number.parseFloat(this.size));
    } else {
      this.wick.ratio = Number.parseFloat(0);
    }
    this.setMarket();
  }
}

module.exports = Candlestick;
