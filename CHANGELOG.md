# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2019-07-23
### Added
- Collect more then one candle per product and timeframe.
- On events you get all candles for this collection.
- Products and timeframes can now be removed from the collection.
- Added function to get the average time difference between messages and local time.

### Fixed
- Clock don't need to be a Singleton.

## [2.0.0] - 2018-11-08
### Added
- Added support for multiple products and timeframes
- Only one clock for all products.
- Added adjustable clock.

## [1.0.0] - 2018-10-31
### Added
- Forked from gdax-candles
