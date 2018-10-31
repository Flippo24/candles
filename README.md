# Candles

## Summary

This project started as an fork of [gdax-candles](https://github.com/swimclan/gdax-candles).

Candles gives you the ability to create candlesticks from your tick data. The candlesticks will be created from live tick data and not historical tick data. For example, via websocket clients.

## Installation

To install the most recent release from npm, run:

```sh
npm i @flippo24/candles --save
```

## Usage

Here is a basic example using gdax as data provider:

```js
const Chart = require('candles');
const Gdax = require('gdax');

const product = 'ETH-USD';
const timeframe = '2m';
const websocket = new Gdax.WebsocketClient(product);

const ETHChart = new Chart({product, timeframe}).start();

websocket.on('message', data => {
if (data.type === 'match') {
    ETHChart.SetPrice(data.price, data.size)
    }
});

ETHChart.on('close', candle => {
  console.log(candle);
});

/*
Candlestick {
  timestamp: 2018-10-30T23:02:00.002Z,
  product: 'ETH-USD',
  open: '195.53000000',
  price: '195.56000000',
  close: '195.56000000',
  high: '195.56000000',
  low: '195.35000000',
  volume: '21.10665262',
  size: '0.21000000',
  wick:
   { top: '0.00000000',
     bottom: '0.18000000',
     size: '0.18000000',
     ratio: '0.85714286' },
  closed: true,
  market: 'bullish' }
*/
```

## arguments

When a new instance is created, a productname and a timeframe must be specified.

* `product` Can be the name of the currencypair or anything else.
* `timeframe` second, minute and hour intervals (i.e. 1h, 30s, 10m, etc)

## events

Events emitted from candles. For all events the current candle will be passed.

* `open` a new candle created
* `close` a candle is closed
* `current` the current candle where updated

## properties

The candle instance gives you following properties.

* `currentCandle` Can be the name of the currencypair or anything else.
* `candles` second, minute and hour intervals (i.e. 1h, 30s, 10m, etc)
* `timeframe` the timeframe you choose
