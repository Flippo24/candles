# Candles

Candles gives you the ability to create candlesticks from your tick data. The candlesticks will be created from live tick data and not historical tick data. For example, via websocket clients.

### About

This project started as an fork of [gdax-candles](https://github.com/swimclan/gdax-candles).
During use, it turned out that there was a need to use it on other exchanges. So it changed to candles.

## Installation

To install the most recent release from npm, run:

```sh
npm i candles --save
```

## Example

Here is a basic example using gdax as data provider:

```js
const candles = require('candles');
const Gdax = require('gdax');

const product = ['ETH-USD', 'BTC-USD'];
const timeframe = ['30s', '1m', '2m', '5m', '15m', '30m', '1h', '3h', '6h', '12h', '24h'];

const options = {
  timediff: {
    enabled: true,
    fixed: false,
    value: 50,
    samples: 1000
  }
}
const Candlecollection = new candles(options);
Candlecollection.addProduct(product, timeframe);

const websocket = new Gdax.WebsocketClient(product);

websocket.on('message', data => {
if (data.time) {
  Candlecollection.adjustClock(data.time);
}

if (data.type === 'match') {
    Candlecollection.SetSeriesPrice(data.product_id, data.price, data.size);
    }
});

Candlecollection.on('close', candle => {
  console.log(candle);
});

/*
Candlestick {
  timestamp: 2018-11-08T15:20:00.000Z,
  timeframe: '30s',
  product: 'BTC-USD',
  price: '6479.01000000',
  open: '6479.01000000',
  high: '6479.01000000',
  low: '6479.00000000',
  close: '6479.01000000',
  volume: '0.39818029',
  size: '0.01000000',
  wick:
   { top: '0.00000000',
     bottom: '0.01000000',
     size: '0.01000000',
     ratio: '1.00000000' },
  closed: true,
  market: 'bullish' }
  */
```
### Constructor

When a new instance is created, some options for fixing timelag between provider and your local system can be specified.
By default lagtime correction is disabled.

```js
const options = {
  timediff: {
    enabled: true,
    fixed: false,
    value: 50,
    samples: 1000
  }
}

const Candlecollection = new candles(options);
```

* `enabled` Enabling the correction of timelag.
* `fixed` For a fixed lag between your provider and you local system set fixed to true. Otherwise the lagtime will be calculated by the given message timestamp, you have to pass.
* `value` Only when fixed lag selected, the lag in ms has to be specified.
* `samples` For the calculated lagtime an average of x samples will be calculated.

### Functions

#### addProduct()

After creating an instance of candles, you have to add products and timeframes.

```js
const product = ['ETH-USD', 'BTC-USD'];
const timeframe = ['30s', '1m', '2m', '5m', '15m', '30m', '1h', '3h', '6h', '12h', '24h'];
Candlecollection.addProduct(product, timeframe, serieslength);
```

* `product` You can set a name for your own, but it make sense to put the name of the currencypair in here. You have to tell candle this name, every time you update the current candle.  
* `timeframe` Setup the timeframe of your choice. The timeframes have to be writen in any number of s=seconds, m=minutes, h=hours and d=days. Feel free to use 13m or 7s as well as 21h.
Product and Timeframe can both be arrays. Then for every product the given timeframe will be created. You can also seperate it.
* `serieslength` [optional] If you like to collect a amount of last x candles, set the amount here. If not passed, only the last candle will be hold in memmory.

```js
Candlecollection.addProduct('ETH-USD', '30s');
Candlecollection.addProduct('BTC-USD', '1m', 60);
```

#### removeProduct()

Removing products is as easy as adding, just provide the product(s) and timeframe(s).

```js
// removing these timeframes in these products
const product = ['ETH-USD', 'BTC-USD'];
const timeframe = ['30s', '1m', '2m', '5m', '15m', '30m', '1h', '3h', '6h', '12h', '24h'];
Candlecollection.removeProduct(product, timeframe);
```

* `product` You have to set the same name(s), you use for adding your product(s).  
* `timeframe` same as above.

```js
// removing one timeframe in a product
Candlecollection.removeProduct('ETH-USD', '30s');
Candlecollection.removeProduct('BTC-USD', '1m');
```

#### SetSeriesPrice()

Candles need to know when the price of the product has been changed.

```js
const product = 'BTC-USD';
const price = 6479.01;
const size = 0.39818029;
Candlecollection.SetSeriesPrice(product, price, size)
```

* `product` The name you set in addProduct() before.
* `price` The actual price you got from provider.
* `size` This is an optional parameter. If your provider don't give you any volume information, just leave it. Then your candlesticks volume will be 0.

#### adjustClock()

If you setup timelag correction, by enabling and setting samples count, you can pass your message timestamps to candles. Candles will build an average of these and your system clock, so the timestamp of the created candle will be more accorate.

```js
Candlecollection.adjustClock(timestamp);
```

* `timestamp` Will be the timestamp from your providers message.

#### getTimeDrift()

Gives you the average difference between exchange and local time. Depends on the timediff options you set. The value is in ms.

```js
Candlecollection.getTimeDrift();
```

### Events

Events emitted from candles. For all events the current candle and the candle collection will be passed.

* `open` when a new candle created
* `close` when a candle is closed
* `current` when the current candle where updated

These events can be more specific by adding the timeframe and/or the productname.

* `open BTC-USD` when a new candle of product 'BTC-USD' created
* `open BTC-USD 1m` when a new candle of product 'BTC-USD' with timeframe '1m' created
* `open 1m` when a new candle with timeframe '1m' created

This works also for close and current events to.

like:

```js
Candlecollection.on('close BTC-USD 30s', currentCandle, candles => {
  console.log(currentCandle);
});
```

### Properties

The candles instance provides you following properties.

Candles collects all candlesticks for you in a series. You can get it by using the product and timeframe as property name.

```js
Candlecollection.series['BTC-USD'].timeframe['30s'].candles
```

### Candlestick

This is an overview of the candlestick properties.

* `timestamp` Time when this candle started. Opening time.
* `timeframe` How much time this candle burned.
* `price` The actual price.
* `open` Opening price.
* `high` Highest price in timeframe.
* `low` Lowest price in timeframe.
* `close` Closing price.
* `volume` Volume traded in this timeframe.
* `size` The Candlesize.
* `wick.top` Top of the wick.
* `wick.bottom` Bottom of the wick.
* `wick.size` Size of the wick.
* `wick.ratio` Ration body to wick.
* `closed` Is this candle closed?
* `market` Market situation of this candle.
