const units = {
  s: 1,
  m: 60,
  h: 3600,
  d: 86400
}

module.exports.timeframeToSec = (timeframe) => {
  let time = '';
  let unit;
  const tfsplit = timeframe.split('');
  for (var i in tfsplit) {
    if (!isNaN(tfsplit[i])) {
      time += tfsplit[i];
    } else {
      unit = tfsplit[i];
      break;
    }
  }
  return unit && units[unit] && time.length > 0 ? Number(time) * units[unit] : units.s;
}

module.exports.secToTimeframe = (secs) => {
  return;
}

module.exports.timeLeft = (epoch, interval) => {
  return interval - (Math.floor(Number(epoch)/1000) % interval);
}

module.exports.nextTime = (epoch, interval) => {
  return (Math.floor(epoch/1000) + this.timeLeft(epoch, interval)) * 1000;
}

module.exports.average = (arr) => {
  return arr.reduce((acc, val) =>  acc + parseFloat(val, 10), 0) / arr.length;
}
